"""
Admin configuration for custom User model.
Manages user accounts and role assignments in the LMS.
"""

from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """
    Admin interface for custom User model.
    Displays user information including username, email, role, and account status.
    Provides filtering and search capabilities for user management.
    """
    # Display these fields in the admin list view
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff', 'date_joined')
    
    # Add filters in the right sidebar
    list_filter = ('role', 'is_active', 'is_staff', 'date_joined')
    
    # Enable search by username and email
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    # Group fields in the edit form for better organization
    fieldsets = (
        ('Personal Information', {
            'fields': ('username', 'email', 'first_name', 'last_name')
        }),
        ('Role & Permissions', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)  # Collapsible section
        }),
    )
    
    # Make date fields read-only since they're auto-generated
    readonly_fields = ('last_login', 'date_joined')
    
    # Optimize database queries when displaying related objects
    # list_select_related = ('groups',)
    
    def get_queryset(self, request):
        """
        Optimize queryset with select_related for better performance.
        
        Args:
            request: HTTP request object
            
        Returns:
            QuerySet: Optimized user queryset
        """
        qs = super().get_queryset(request)
        # Add any query optimizations here if needed
        return qs