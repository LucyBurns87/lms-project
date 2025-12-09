from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Avg, Count


"""
Serializers for the Users application.
Handles user registration, authentication, and profile management.
"""

# Get the custom User model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Basic serializer for User model.
    Used for displaying user information in API responses.
    Includes statistics for student dashboard.
    """
    # Add computed fields for statistics
    submissions_count = serializers.SerializerMethodField()
    enrollments_count = serializers.SerializerMethodField()
    average_grade = serializers.SerializerMethodField()
    
    class Meta:
        """
        Metadata for UserSerializer.
        Defines which model and fields to serialize.
        """
        model = User
        
        # Fields to include in serialization
        fields = [
            'id',                  # Primary key (read-only)
            'username',            # Login username
            'email',               # Email address
            'role',                # User role (student/teacher/admin)
            'first_name',          # First name
            'last_name',           # Last name
            'submissions_count',   # Number of submissions
            'enrollments_count',   # Number of enrolled courses
            'average_grade',       # Average grade across submissions
        ]
        
        # Only id is read-only; other fields can be updated
        read_only_fields = ['id', 'submissions_count', 'enrollments_count', 'average_grade']
    
    def get_submissions_count(self, obj):
        """Get total number of submissions by this user"""
        return obj.submissions.count()
    
    def get_enrollments_count(self, obj):
        """Get total number of course enrollments by this user"""
        return obj.enrollments.count()
    
    def get_average_grade(self, obj):
        """Get average grade across all graded submissions"""
        avg = obj.submissions.filter(grade__isnull=False).aggregate(Avg('grade'))['grade__avg']
        if avg is not None:
            return round(avg, 1)
        return None

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles creation of new user accounts with password hashing.
       
    Validation:
        - Username must be unique
        - Email must be valid format
        - Password must be at least 8 characters
        - Role must be one of: student, teacher, admin
    """
    # Password field configuration
    # write_only ensures password is never returned in API responses
    # min_length enforces minimum security requirement
    password = serializers.CharField(
        write_only=True,       # Never include in serialized output
        min_length=8,          # Minimum password length
        style={'input_type': 'password'},  # HTML input type hint
        help_text="Password must be at least 8 characters"
    )
    
    class Meta:
        """
        Metadata for RegisterSerializer.
        Defines which model and fields to serialize.
        """
        model = User
        
        # Fields required for registration
        fields = [
            'username',     # Required: unique login name
            'email',        # Required: contact email
            'password',     # Required: user password (write-only)
            'role',         # Optional: defaults to 'student'
            'first_name',   # Optional: user's first name
            'last_name'     # Optional: user's last name
        ]
        
        # Optional: Add extra validation rules
        extra_kwargs = {
            'email': {
                'required': True,
                'allow_blank': False
            },
            'username': {
                'required': True,
                'min_length': 3,
                'max_length': 150
            }
        }
    
    def create(self, validated_data):
        """
        Custom create method to properly hash the password.
        Django's create_user method handles password hashing automatically.
        
        """
        # Extract password and other fields
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']
        # Force role to 'student' for registration form (only students can self-register)
        role = 'student'  # Override any role sent from frontend
        first_name = validated_data.get('first_name', '')
        last_name = validated_data.get('last_name', '')
        
        # Create user with hashed password
        # create_user() automatically hashes the password
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,      # This will be hashed automatically
            role=role,
            first_name=first_name,
            last_name=last_name
        )
        
        return user
    
    def validate_email(self, value):
        """
        Custom validation for email field.
        Ensures email is unique across all users.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists"
            )
        return value
    
    def validate_role(self, value):
        """
        Custom validation for role field.
        Ensures role is one of the allowed choices.
        
        """
        allowed_roles = ['student', 'teacher', 'admin']
        if value not in allowed_roles:
            raise serializers.ValidationError(
                f"Role must be one of: {', '.join(allowed_roles)}"
            )
        return value