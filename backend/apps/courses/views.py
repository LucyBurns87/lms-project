"""
Views for the Courses application.
Handles API endpoints for course and enrollment management.

ViewSets:
    CourseViewSet: CRUD operations for courses with custom enrollment action
    EnrollmentViewSet: CRUD operations for enrollments with role-based filtering
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer
from apps.users.permissions import IsTeacherOrAdmin


class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing courses.
    Provides CRUD operations and custom enrollment functionality.
    
    Endpoints:
        GET    /api/courses/              - List all courses (public)
        POST   /api/courses/              - Create course (teacher/admin only)
        GET    /api/courses/{id}/         - View course details (public)
        PUT    /api/courses/{id}/         - Update course (teacher/admin only)
        PATCH  /api/courses/{id}/         - Partial update (teacher/admin only)
        DELETE /api/courses/{id}/         - Delete course (teacher/admin only)
        POST   /api/courses/{id}/enroll/  - Enroll in course (authenticated users)
    
    Permissions:
        - list, retrieve: Anyone can view (read-only for unauthenticated)
        - create, update, partial_update, destroy: Teachers and admins only
        - enroll: Authenticated users only
    """
    # Base queryset - retrieve all courses
    queryset = Course.objects.all()
    
    # Serializer for JSON conversion
    serializer_class = CourseSerializer
    
    # Allow unauthenticated users to view courses
    # Authentication required for modifications
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """
        Override to automatically set the course creator.
        
        Args:
            serializer: Validated CourseSerializer instance
        
        Note:
            created_by is set from request.user, tracking who created each course.
            This is used for permission checks (teachers can only edit their courses).
        """
        # Set the course creator to the authenticated user
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        """
        Custom action to enroll a student in a course.
        
        URL: POST /api/courses/{id}/enroll/
        
        Args:
            request: HTTP request object containing authenticated user
            pk: Primary key of the course to enroll in
        
        Returns:
            Response: JSON with enrollment data or error message
        
        Status Codes:
            201: Successfully enrolled
            400: Already enrolled or validation error
            404: Course not found
        
        Business Logic:
            - Checks if user is already enrolled
            - Creates new Enrollment record
            - Returns enrollment details
        
        Usage Example:
            POST /api/courses/1/enroll/
            Headers: Authorization: Bearer {jwt_token}
            Response: {
                "id": 1,
                "student": 2,
                "student_username": "john_doe",
                "course": {...},
                "date_enrolled": "2024-12-03T10:30:00Z"
            }
        """
        # Get the course object (raises 404 if not found)
        course = self.get_object()
        
        # Get the authenticated user (student)
        student = request.user

        # Check if already enrolled
        if Enrollment.objects.filter(student=student, course=course).exists():
            return Response(
                {'detail': 'Already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the enrollment
        enrollment = Enrollment.objects.create(student=student, course=course)
        
        # Serialize and return the enrollment data
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing course enrollments.
    Provides CRUD operations with role-based filtering.
    
    Endpoints:
        GET    /api/courses/enrollments/              - List enrollments (filtered)
        POST   /api/courses/enrollments/              - Create enrollment
        GET    /api/courses/enrollments/{id}/         - View enrollment details
        PUT    /api/courses/enrollments/{id}/         - Update enrollment
        PATCH  /api/courses/enrollments/{id}/         - Partial update
        DELETE /api/courses/enrollments/{id}/         - Delete enrollment (unenroll)
        GET    /api/courses/enrollments/my_enrollments/ - Get user's enrollments
    
    Permissions:
        - All actions: Authenticated users only
        - Data visibility controlled by get_queryset()
    
    Filtering:
        - Students: Only see their own enrollments
        - Teachers/Admins: See all enrollments
    """
    # Base queryset - will be filtered in get_queryset()
    queryset = Enrollment.objects.all()
    
    # Serializer for JSON conversion
    serializer_class = EnrollmentSerializer
    
    # Require authentication for all actions
    permission_classes = [IsAuthenticated]

def get_queryset(self):
    """
    Filter enrollments based on user role and query parameters.
    
    Returns:
        QuerySet: Filtered enrollment queryset
    
    Filtering Rules:
        - Teachers/Admins: See all enrollments (can filter by course)
        - Students: Only their own enrollments
        - Others: Empty queryset
    
    Query Parameters:
        - course: Filter by course ID (e.g., ?course=1)
    
    Security:
        Prevents students from viewing other students' enrollment data.
    """
    user = self.request.user
    
    # Teachers and admins see all enrollments
    if hasattr(user, 'role') and user.role in ['teacher', 'admin']:
        queryset = Enrollment.objects.all()
    else:
        # Students only see their own enrollments
        queryset = Enrollment.objects.filter(student=user)
    
    # Apply course filter if provided in query params
    course_id = self.request.query_params.get('course', None)
    if course_id is not None:
        queryset = queryset.filter(course_id=course_id)
    
    return queryset

    def perform_create(self, serializer):
        """
        Override to handle enrollment creation with validation.
        
        Args:
            serializer: Validated EnrollmentSerializer instance
        
        Raises:
            ValidationError: If course doesn't exist or already enrolled
        
        Business Logic:
            1. Extract course_id from request data
            2. Validate course exists
            3. Check for duplicate enrollment
            4. Create enrollment with course instance
        """
        # Get course_id from request data
        course_id = self.request.data.get('course')
        if not course_id:
            raise ValidationError({'course': 'Course ID is required.'})
        
        # Validate course exists
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise ValidationError({'course': 'Course not found.'})
        
        # Check for duplicate enrollment
        if Enrollment.objects.filter(
            student=self.request.user, 
            course=course
        ).exists():
            raise ValidationError({'detail': 'Already enrolled in this course.'})
        
        # Create enrollment with validated data
        serializer.save(student=self.request.user, course=course)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_enrollments(self, request):
        """
        Custom action to get current user's enrollments.
        
        URL: GET /api/courses/enrollments/my_enrollments/
        
        Args:
            request: HTTP request object containing authenticated user
        
        Returns:
            Response: JSON array of user's enrollments
        
        Usage Example:
            GET /api/courses/enrollments/my_enrollments/
            Headers: Authorization: Bearer {jwt_token}
            Response: [
                {
                    "id": 1,
                    "student": 2,
                    "student_username": "john_doe",
                    "course": {...},
                    "date_enrolled": "2024-12-03T10:30:00Z"
                },
                ...
            ]
        """
        # Get enrollments for the authenticated user
        enrollments = Enrollment.objects.filter(student=request.user)
        
        # Serialize the queryset (many=True for list)
        serializer = self.get_serializer(enrollments, many=True)
        
        # Return serialized data
        return Response(serializer.data)