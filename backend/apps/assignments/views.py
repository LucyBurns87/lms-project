"""
Views for the Assignments application.
Handles API endpoints for assignment and submission management.

ViewSets:
    AssignmentViewSet: CRUD operations for assignments
    SubmissionViewSet: CRUD operations for submissions with role-based filtering
"""

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer
from apps.users.permissions import IsTeacher, IsStudent, IsTeacherOrAdmin


class AssignmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing assignments.
    Provides CRUD operations with role-based permissions.
    
    Endpoints:
        GET    /api/assignments/           - List all assignments (authenticated users)
        POST   /api/assignments/           - Create assignment (teacher/admin only)
        GET    /api/assignments/{id}/      - View assignment details (authenticated users)
        PUT    /api/assignments/{id}/      - Update assignment (teacher/admin only)
        PATCH  /api/assignments/{id}/      - Partial update (teacher/admin only)
        DELETE /api/assignments/{id}/      - Delete assignment (teacher/admin only)
    
    Permissions:
        - list, retrieve: Any authenticated user can view assignments
        - create, update, partial_update, destroy: Only teachers and admins
    
    Query Parameters:
        ?course={id}: Filter assignments by course ID
    """
    # Base queryset - retrieve all assignments from database
    queryset = Assignment.objects.all()
    
    # Serializer to convert Assignment objects to/from JSON
    serializer_class = AssignmentSerializer

    def get_permissions(self):
        """
        Determine permissions based on the action being performed.
        
        Returns:
            list: Permission classes required for the current action
        
        Permission Logic:
            - 'list' (GET /assignments/): All authenticated users
            - 'retrieve' (GET /assignments/{id}/): All authenticated users
            - 'create', 'update', 'partial_update', 'destroy': Teachers/Admins only
        """
        # Students can view assignments, but not modify them
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        
        # Only teachers and admins can create/update/delete assignments
        return [IsTeacherOrAdmin()]


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing assignment submissions.
    Provides CRUD operations with role-based permissions and filtering.
    
    Endpoints:
        GET    /api/assignments/submissions/           - List submissions (filtered by role)
        POST   /api/assignments/submissions/           - Submit assignment (students only)
        GET    /api/assignments/submissions/{id}/      - View submission details
        PUT    /api/assignments/submissions/{id}/      - Full update (deprecated)
        PATCH  /api/assignments/submissions/{id}/      - Grade submission (teachers only)
        DELETE /api/assignments/submissions/{id}/      - Delete submission
    
    Permissions:
        - create: Students only (submit their work)
        - update, partial_update: Teachers only (grade submissions)
        - list, retrieve, destroy: Authenticated users (with filtering)
    
    Filtering:
        - Students: Only see their own submissions
        - Teachers: Only see submissions for their courses
        - Admins: See all submissions
    """
    # Base queryset - will be filtered in get_queryset()
    queryset = Submission.objects.all()
    
    # Serializer to convert Submission objects to/from JSON
    serializer_class = SubmissionSerializer

    def get_permissions(self):
        """
        Determine permissions based on the action being performed.
        
        Returns:
            list: Permission classes required for the current action
        
        Permission Logic:
            - 'create': Students only (submitting their work)
            - 'update', 'partial_update': Teachers only (grading submissions)
            - Other actions: Any authenticated user (with queryset filtering)
        """
        if self.action == 'create':
            # Only students can submit assignments
            return [IsStudent()]
        
        elif self.action in ['update', 'partial_update']:
            # Only teachers can grade/update submissions
            # Typically PATCH is used for grading: {'grade': 85, 'feedback': '...'}
            return [IsTeacher()]
        
        # Default: require authentication for all other actions
        # Actual data visibility controlled by get_queryset()
        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Filter submissions based on user role.
        Ensures users only see submissions they're authorized to view.
        
        Returns:
            QuerySet: Filtered submission queryset based on user role
        
        Filtering Rules:
            - Students: Only their own submissions
            - Teachers: Submissions for courses they created
            - Admins: All submissions
            - Other: Empty queryset (no access)
        
        Security:
            This method prevents unauthorized access to submission data
            even if a user guesses submission IDs.
        """
        user = self.request.user
        
        if user.role == 'student':
            # Students only see their own submissions
            # Prevents students from viewing other students' work
            return Submission.objects.filter(student=user)
        
        elif user.role == 'teacher':
            # Teachers see submissions for courses they created
            # Uses double-underscore notation to traverse relationships:
            # Submission -> Assignment -> Course -> created_by
            return Submission.objects.filter(
                assignment__course__created_by=user
            )
        
        elif user.role == 'admin':
            # Admins see everything - no filtering
            return Submission.objects.all()
        
        # Fallback: return empty queryset for unknown roles
        # This ensures security by default - deny access unless explicitly allowed
        return Submission.objects.none()

    def perform_create(self, serializer):
        """
        Override to automatically set the student when creating a submission.
        
        Args:
            serializer: Validated SubmissionSerializer instance
        
        Note:
            Student is set from request.user, preventing students from
            submitting assignments on behalf of other students.
        """
        # Automatically set the student to the authenticated user
        serializer.save(student=self.request.user)