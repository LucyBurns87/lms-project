from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssignmentViewSet, SubmissionViewSet

"""
URL configuration for the Assignments application.
Defines API endpoints for assignments and submissions.

URL Patterns:
    /api/assignments/                       - List/Create assignments
    /api/assignments/{id}/                  - Retrieve/Update/Delete assignment
    /api/assignments/submissions/           - List/Create submissions
    /api/assignments/submissions/{id}/      - Retrieve/Update/Delete submission

ViewSets:
    AssignmentViewSet: Handles CRUD operations for assignments
    SubmissionViewSet: Handles CRUD operations for submissions
"""



router = DefaultRouter()

# Register AssignmentViewSet with empty prefix since base URL is already /api/assignments/
# This creates:
#   GET    /api/assignments/           -> list all assignments
#   POST   /api/assignments/           -> create new assignment
#   GET    /api/assignments/{id}/      -> retrieve specific assignment
#   PUT    /api/assignments/{id}/      -> update assignment (full)
#   PATCH  /api/assignments/{id}/      -> update assignment (partial)
#   DELETE /api/assignments/{id}/      -> delete assignment
router.register(
    r'',                    # Empty prefix (base path already set in main urls.py)
    AssignmentViewSet,      # ViewSet class handling the logic
    basename='assignment'   # Used for reverse URL lookups
)

# Register SubmissionViewSet with 'submissions' prefix
# This creates:
#   GET    /api/assignments/submissions/           -> list all submissions
#   POST   /api/assignments/submissions/           -> create new submission
#   GET    /api/assignments/submissions/{id}/      -> retrieve specific submission
#   PUT    /api/assignments/submissions/{id}/      -> update submission (full)
#   PATCH  /api/assignments/submissions/{id}/      -> update submission (partial)
#   DELETE /api/assignments/submissions/{id}/      -> delete submission
router.register(
    r'submissions',         # URL prefix for submission endpoints
    SubmissionViewSet,      # ViewSet class handling submission logic
    basename='submission'   # Used for reverse URL lookups
)

# Include all router-generated URLs in this app's URL configuration
# The router.urls property contains all the generated URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Include all ViewSet URLs
]


