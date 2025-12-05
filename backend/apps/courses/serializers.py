from rest_framework import serializers
from .models import Course, Enrollment

"""
Serializers for the Courses application.
Converts Course and Enrollment model instances to/from JSON format.
"""


class CourseSerializer(serializers.ModelSerializer):
    """
    Serializer for Course model.
    Handles conversion between Course objects and JSON representation.
    
    Fields:
        id (int): Primary key of the course (read-only)
        title (str): Course name
        description (str): Detailed course information
        created_by (int): User ID of course creator (auto-set)
        created_by_username (str): Username of creator (read-only)
        date_created (datetime): Course creation timestamp (auto-generated)
    
    Read-only fields:
        created_by: Set automatically from authenticated user
        date_created: Auto-generated timestamp
        created_by_username: Prevents modification of creator identity
    
    Usage:
        # Create course
        data = {'title': 'Python 101', 'description': 'Learn Python basics'}
        serializer = CourseSerializer(data=data)
        if serializer.is_valid():
            course = serializer.save(created_by=request.user)
        
        # List courses
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        json_data = serializer.data
    """
    # Display creator's username for better UX
    created_by_username = serializers.CharField(
        source='created_by.username', 
        read_only=True,
        help_text="Username of the teacher who created this course"
    )
    
    class Meta:
        """
        Metadata for CourseSerializer.
        Defines which model and fields to serialize.
        """
        model = Course
        
        # Fields to include in serialization
        fields = [
            'id',                    # Primary key
            'title',                 # Course name
            'description',           # Course details
            'created_by',            # Creator user ID
            'created_by_username',   # Creator username (read-only)
            'date_created'           # Creation timestamp
        ]
        
        # Fields that cannot be modified by the user
        read_only_fields = [
            'created_by',      # Set automatically from request.user
            'date_created'     # Set automatically on creation
        ]
        
        # Optional: Add validation rules
        # extra_kwargs = {
        #     'title': {
        #         'min_length': 3,
        #         'max_length': 200,
        #         'required': True
        #     },
        #     'description': {
        #         'required': True,
        #         'allow_blank': False
        #     }
        # }


class EnrollmentSerializer(serializers.ModelSerializer):
    """
    Serializer for Enrollment model.
    Handles conversion between Enrollment objects and JSON representation.
    
    Fields:
        id (int): Primary key of enrollment (read-only)
        student (int): Student user ID (auto-set from request)
        student_username (str): Student's username (read-only)
        course (obj): Full course details (read-only for display)
        course_id (int): Course ID for enrollment creation (write-only)
        date_enrolled (datetime): Enrollment timestamp (auto-generated)
    
    Read-only fields:
        student: Set automatically from authenticated user
        date_enrolled: Auto-generated timestamp
    
    Usage:
        # Enroll student in course
        data = {'course_id': 1}
        serializer = EnrollmentSerializer(data=data)
        if serializer.is_valid():
            enrollment = serializer.save(student=request.user)
        
        # Get student's enrollments
        enrollments = Enrollment.objects.filter(student=request.user)
        serializer = EnrollmentSerializer(enrollments, many=True)
        json_data = serializer.data
    """
    # Nested serializer to show full course details in response
    course = CourseSerializer(
        read_only=True,
        help_text="Full course details for enrolled course"
    )
    
    # Write-only field for creating enrollments
    # Allows sending just course ID instead of full course object
    course_id = serializers.IntegerField(
        write_only=True,
        help_text="ID of the course to enroll in"
    )
    
    # Display student username for better context
    student_username = serializers.CharField(
        source='student.username', 
        read_only=True,
        help_text="Username of the enrolled student"
    )
    
    class Meta:
        """
        Metadata for EnrollmentSerializer.
        Defines which model and fields to serialize.
        """
        model = Enrollment
        
        # Fields to include in serialization
        fields = [
            'id',                # Primary key
            'student',           # Student user ID (auto-set)
            'student_username',  # Student username (read-only)
            'course',            # Full course object (read-only)
            'course_id',         # Course ID for enrollment (write-only)
            'date_enrolled'      # Enrollment timestamp
        ]
        
        # Fields that cannot be modified by the user
        read_only_fields = [
            'student',         # Set from authenticated user
            'date_enrolled'    # Set automatically on creation
        ]
    
    def create(self, validated_data):
        """
        Custom create method to handle course_id -> course conversion.
        
        Args:
            validated_data (dict): Validated data from the request
            
        Returns:
            Enrollment: The created enrollment instance
            
        Raises:
            serializers.ValidationError: If course doesn't exist or
                                        student is already enrolled
        """
        # Extract course_id from validated data
        course_id = validated_data.pop('course_id')
        
        # Get the course instance
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise serializers.ValidationError({
                'course_id': 'Course not found'
            })
        
        # Check for duplicate enrollment
        student = validated_data.get('student')
        if Enrollment.objects.filter(student=student, course=course).exists():
            raise serializers.ValidationError({
                'detail': 'Already enrolled in this course'
            })
        
        # Create enrollment with course instance
        enrollment = Enrollment.objects.create(
            course=course, 
            **validated_data
        )
        return enrollment