from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssignmentViewSet, SubmissionViewSet, test_submission
from .simple_views import simple_submit

"""
URL configuration for the Assignments application.
"""

router = DefaultRouter()

# Register AssignmentViewSet
router.register(
    r'',
    AssignmentViewSet,
    basename='assignment'
)

# Register SubmissionViewSet
router.register(
    r'submissions',
    SubmissionViewSet,
    basename='submission'
)

# URL patterns - add direct path BEFORE router
urlpatterns = [
    path('test-submission/', test_submission, name='test-submission'),
    path('simple-submit/', simple_submit, name='simple-submit'),  # NEW
    path('submissions/', SubmissionViewSet.as_view({'get': 'list', 'post': 'create'}), name='submission-create'),
    path('', include(router.urls)),
]