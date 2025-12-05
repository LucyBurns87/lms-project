"""
Admin configuration for Assignment and Submission models.
Customizes how assignments and submissions appear in Django admin panel.
"""

from django.contrib import admin
from .models import Assignment, Submission


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    """
    Admin interface for Assignment model.
    Displays assignment title, associated course, and due date.
    Filters assignments for teachers to show only their own courses.
    """
    # Display these fields in the admin list view
    list_display = ('title', 'course', 'due_date')
    
    def get_queryset(self, request):
        """
        Override queryset to filter assignments based on user role.
        Teachers only see assignments from courses they created.
        Admins see all assignments.
        
        Args:
            request: HTTP request object containing user information
            
        Returns:
            QuerySet: Filtered assignments based on user role
        """
        # Get the base queryset
        qs = super().get_queryset(request)
        
        # If user is a teacher, only show assignments from their courses
        if hasattr(request.user, 'role') and request.user.role == 'teacher':
            return qs.filter(course__created_by=request.user)
        
        # Admins and superusers see all assignments
        return qs


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    """
    Admin interface for Submission model.
    Displays submission details including assignment, student, grade, and timestamp.
    Provides filters for easier navigation through submissions.
    """
    # Display these fields in the admin list view
    list_display = ('assignment', 'student', 'grade', 'submitted_at')
    
    # Add filters in the right sidebar for easier navigation
    list_filter = ('assignment', 'grade')
    
    # Optional: Add search functionality
    # search_fields = ('student__username', 'assignment__title')
    
    # Optional: Make some fields read-only
    # readonly_fields = ('submitted_at',)