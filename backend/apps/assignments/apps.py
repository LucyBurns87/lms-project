"""
Application configuration for the Assignments app.
This app handles assignment creation, submission, and grading functionality.
"""

from django.apps import AppConfig


class AssignmentsConfig(AppConfig):
    """
    Configuration class for the Assignments application.
    
    This app manages:
    - Assignment creation by teachers
    - Student assignment submissions
    - Grading and feedback system
    - File uploads for submissions
    
    Attributes:
        default_auto_field (str): Specifies the type of auto-created primary key field.
                                  BigAutoField supports larger integer values (up to 2^63-1).
        name (str): Full Python path to the application.
                   Used by Django to identify and load the app.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.assignments'
    
    # Optional: Verbose name shown in Django admin
    verbose_name = 'Assignment Management'
    
    def ready(self):
        """
        Override this method to perform initialization tasks when Django starts.
        Common uses:
        - Register signals
        - Import signal handlers
        - Perform startup checks
        
        Example:
            import apps.assignments.signals
        """
        pass