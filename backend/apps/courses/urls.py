from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, EnrollmentViewSet

"""
URL configuration for the Courses application.
Defines API endpoints for courses and enrollments.

URL Patterns:
    /api/courses/                           - List/Create courses
    /api/courses/{id}/                      - Retrieve/Update/Delete course
    /api/courses/{id}/enroll/              - Custom action: Enroll in course
    /api/courses/enrollments/              - List/Create enrollments
    /api/courses/enrollments/{id}/         - Retrieve/Update/Delete enrollment
    /api/courses/enrollments/my_enrollments/ - Custom action: Get user's enrollments

ViewSets:
    CourseViewSet: Handles CRUD operations and enrollment logic for courses
    EnrollmentViewSet: Handles CRUD operations for course enrollments
"""


# Initialize Django REST Framework router
# DefaultRouter provides:
# - Automatic URL pattern generation
# - API root view at the base URL
# - Trailing slash handling
router = DefaultRouter()

# Register CourseViewSet at the root of /api/courses/
# Empty prefix ('') because main urls.py already specifies /api/courses/
# 
# Generated endpoints:
#   GET    /api/courses/              -> List all courses
#   POST   /api/courses/              -> Create new course (teacher/admin only)
#   GET    /api/courses/{id}/         -> Get course details
#   PUT    /api/courses/{id}/         -> Update course (teacher/admin)
#   PATCH  /api/courses/{id}/         -> Partial update course
#   DELETE /api/courses/{id}/         -> Delete course (teacher/admin)
#
# Custom actions (defined in CourseViewSet with @action decorator):
#   POST   /api/courses/{id}/enroll/  -> Enroll student in course
router.register(
    r'',                # Empty prefix - base URL is /api/courses/
    CourseViewSet,      # ViewSet handling course operations
    basename='course'   # Name prefix for URL reversing (e.g., 'course-list', 'course-detail')
)

# Register EnrollmentViewSet under 'enrollments' prefix
# Creates URLs under /api/courses/enrollments/
#
# Generated endpoints:
#   GET    /api/courses/enrollments/              -> List enrollments
#   POST   /api/courses/enrollments/              -> Create enrollment
#   GET    /api/courses/enrollments/{id}/         -> Get enrollment details
#   PUT    /api/courses/enrollments/{id}/         -> Update enrollment
#   PATCH  /api/courses/enrollments/{id}/         -> Partial update
#   DELETE /api/courses/enrollments/{id}/         -> Delete enrollment (unenroll)
#
# Custom actions:
#   GET    /api/courses/enrollments/my_enrollments/ -> Get current user's enrollments
router.register(
    r'enrollments',         # URL prefix for enrollment endpoints
    EnrollmentViewSet,      # ViewSet handling enrollment operations
    basename='enrollment'   # Name prefix for URL reversing
)

# Include all router-generated URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Add all ViewSet URLs to urlpatterns
]

# URL Naming Convention (for reverse lookups):
# - course-list        -> /api/courses/
# - course-detail      -> /api/courses/{id}/
# - course-enroll      -> /api/courses/{id}/enroll/
# - enrollment-list    -> /api/courses/enrollments/
# - enrollment-detail  -> /api/courses/enrollments/{id}/
#
# Usage in code:
#   from django.urls import reverse
#   url = reverse('course-detail', args=[course_id])