"""
Custom User model for the LMS application.
Extends Django's AbstractUser to add role-based functionality.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model with role-based permissions.
    
    Extends Django's AbstractUser to include a role field for
    differentiating between Students, Teachers, and Admins.
      
    Role Choices:
        student: Can enroll in courses, submit assignments
        teacher: Can create courses and assignments, grade submissions
        admin: Full system access and management capabilities
    
    Related Names:
        courses_created: All courses created by this user (if teacher)
        enrollments: All course enrollments for this user (if student)
        submissions: All assignment submissions by this user (if student)
    
    Methods:
        __str__: Returns the username
    """
    
    # Role field with predefined choices
    role = models.CharField(
        max_length=10,
        choices=[
            ('student', 'Student'),   # Can enroll and submit assignments
            ('teacher', 'Teacher'),   # Can create courses and grade
            ('admin', 'Admin'),       # Full system access
        ],
        default='student',
        help_text="User's role in the Learning Management System"
    )

    class Meta:
        """
        Metadata options for the User model.
        """
        db_table = 'users_user'  # Database table name
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ['username']  # Default ordering by username

    def __str__(self):
        """
        String representation of the user.
        
        Returns:
            str: The username
        """
        return self.username
    
    def is_student(self):
        """
        Check if user is a student.
        
        Returns:
            bool: True if user role is 'student'
        """
        return self.role == 'student'
    
    def is_teacher(self):
        """
        Check if user is a teacher.
        
        Returns:
            bool: True if user role is 'teacher'
        """
        return self.role == 'teacher'
    
    def is_admin_role(self):
        """
        Check if user is an admin (by role, not superuser status).
        
        Returns:
            bool: True if user role is 'admin'
        """
        return self.role == 'admin'
    
    def get_full_name(self):
        """
        Get user's full name.
        
        Returns:
            str: First name + Last name, or username if names not set
        """
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.username