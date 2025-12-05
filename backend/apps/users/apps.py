"""
Application configuration for the Users app.
This app handles custom user authentication and role management.
"""

from django.apps import AppConfig


class UsersConfig(AppConfig):
    """
    Configuration class for the Users application.
    
    This app manages:
    - Custom User model with role-based permissions (Student, Teacher, Admin)
    - User registration and authentication
    - User profile management
    - JWT token-based authentication
    
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
    
    # Optional: Display name in Django admin
    verbose_name = 'User Management'
    
    def ready(self):
        """
        Initialization code that runs when Django starts.
        
        This method is called once per application when Django finishes loading.
        Use it for:
        - Registering signal handlers
        - Running startup checks
        - Importing modules that need to be loaded at startup
        
        """
        pass