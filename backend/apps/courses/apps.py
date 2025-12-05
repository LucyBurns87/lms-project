"""
Application configuration for the Courses app.
This app handles course management and student enrollment.
"""

from django.apps import AppConfig


class CoursesConfig(AppConfig):
    """
    Configuration class for the Courses application.
    
    This app manages:
    - Course creation and management by teachers
    - Course listings and details
    - Student enrollment system
    - Course-student relationships
    
    Attributes:
        default_auto_field (str): Specifies the type of auto-created primary key field.
                                  BigAutoField supports integers up to 9,223,372,036,854,775,807.
        name (str): Full Python path to the application ('apps.courses').
                   Django uses this to locate models, views, and other components.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.courses'
    
    # Optional: Human-readable name for the app
    verbose_name = 'Course Management'
    
    def ready(self):
        """
        Performs initialization when the application is ready.
        Called once Django has loaded all models.
        
        Use this method to:
        - Import and connect signal handlers
        - Register custom checks
        - Perform app-specific initialization
        
        Example:
            # Import signals to connect them
            from . import signals
        """
        pass