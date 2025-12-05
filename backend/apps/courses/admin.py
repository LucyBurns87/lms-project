"""
Admin configuration for Course and Enrollment models.
Manages course creation, enrollment tracking, and teacher permissions.
"""

from django.contrib import admin
from .models import Course, Enrollment


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """
    Admin interface for Course model.
    Displays course information and filters courses for teachers.
    Teachers only see courses they created.
    """
    # Display these fields in the admin list view
    list_display = ('title', 'created_by', 'date_created')
    
    # Enable search by course title
    search_fields = ('title',)
    
    # Add filters in the sidebar
    list_filter = ('date_created', 'created_by')
    
    # Make date_created read-only since it's auto-generated
    readonly_fields = ('date_created',)
    
    def get_queryset(self, request):
        """
        Filter courses based on user role.
        Teachers only see their own courses.
        Admins see all courses.
        
        Args:
            request: HTTP request object containing user information
            
        Returns:
            QuerySet: Filtered courses based on user role
        """
        # Get the base queryset
        qs = super().get_queryset(request)
        
        # If user is a teacher, only show their courses
        if hasattr(request.user, 'role') and request.user.role == 'teacher':
            return qs.filter(created_by=request.user)
        
        # Admins see all courses
        return qs


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    """
    Admin interface for Enrollment model.
    Tracks which students are enrolled in which courses.
    Provides filtering by course for easier management.
    """
    # Display these fields in the admin list view
    list_display = ('student', 'course', 'date_enrolled')
    
    # Add filter by course in the sidebar
    list_filter = ('course', 'date_enrolled')
    
    # Enable search by student username
    search_fields = ('student__username', 'course__title')
    
    # Make date_enrolled read-only since it's auto-generated
    readonly_fields = ('date_enrolled',)
    
    # Optional: Prevent duplicate enrollments in the admin
    # def has_add_permission(self, request):
    #     """Custom logic to prevent duplicate enrollments"""
    #     return super().has_add_permission(request)