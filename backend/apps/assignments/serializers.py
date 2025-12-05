from rest_framework import serializers
from .models import Assignment, Submission

"""
Serializers for the Assignments application.
Converts Assignment and Submission model instances to/from JSON format.
"""


class AssignmentSerializer(serializers.ModelSerializer):
    """
    Serializer for Assignment model.
    Handles conversion between Assignment objects and JSON representation.
    
    """
    
    course_title = serializers.CharField(
        source='course.title', 
        read_only=True,
        help_text="Name of the course this assignment belongs to"
    )
    
    class Meta:
        """
        Metadata for AssignmentSerializer.
        Defines which model and fields to serialize.
        """
        model = Assignment
        
        # Fields to include in serialization
        fields = [
            'id',              # Primary key (auto-generated)
            'course',          # Course ID (for creating/updating)
            'course_title',    # Course name (read-only, for display)
            'title',           # Assignment title
            'description',     # Assignment instructions
            'due_date'         # Submission deadline
        ]
        
        # Optional: Specify read-only fields
        # read_only_fields = ['id', 'course_title']
        
        # Optional: Add validation
        # extra_kwargs = {
        #     'title': {'min_length': 3, 'max_length': 200},
        #     'due_date': {'required': False}
        # }


class SubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer for Submission model.
    Handles conversion between Submission objects and JSON representation.
    
    """
    # Display student's username instead of just ID
    student_username = serializers.CharField(
        source='student.username', 
        read_only=True,
        help_text="Username of the student who made the submission"
    )
    
    # Display assignment title for better context
    assignment_title = serializers.CharField(
        source='assignment.title', 
        read_only=True,
        help_text="Title of the assignment being submitted"
    )
    
    class Meta:
        """
        Metadata for SubmissionSerializer.
        Defines which model and fields to serialize.
        """
        model = Submission
        
        # Fields to include in serialization
        fields = [
            'id',                  # Primary key (auto-generated)
            'assignment',          # Assignment ID (for creating submission)
            'assignment_title',    # Assignment name (read-only)
            'student',             # Student ID (auto-set from request)
            'student_username',    # Student username (read-only)
            'content',       # Submission text/content
            'file',                # Uploaded file (optional)
            'submitted_at',        # Timestamp (auto-generated)
            'grade',               # Teacher's grade (optional)
            'feedback'             # Teacher's comments (optional)
        ]
        
        # Fields that cannot be modified by the user
        read_only_fields = [
            'student',         # Set automatically from authenticated user
            'submitted_at'     # Set automatically on creation
        ]
        
        # Optional: Add custom validation
        # extra_kwargs = {
        #     'grade': {
        #         'min_value': 0,
        #         'max_value': 100,
        #         'required': False
        #     },
        #     'content': {'required': True}
        # }
    
    def validate_grade(self, value):
        """
        Custom validation for grade field.
        Ensures grade is between 0 and 100.
        
        Args:
            value (int): The grade value to validate
            
        Returns:
            int: The validated grade
            
        Raises:
            serializers.ValidationError: If grade is out of range
        """
        if value is not None and (value < 0 or value > 100):
            raise serializers.ValidationError(
                "Grade must be between 0 and 100"
            )
        return value