"""
Views for the Assignments application.
Handles API endpoints for assignment and submission management.

ViewSets:
    AssignmentViewSet: CRUD operations for assignments
    SubmissionViewSet: CRUD operations for submissions with role-based filtering
"""

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer
from apps.users.permissions import IsTeacher, IsStudent, IsTeacherOrAdmin


class AssignmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing assignments.
    Provides CRUD operations with role-based permissions.
    """
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

    def get_permissions(self):
        """Determine permissions based on the action."""
       # TEMPORARY - Allow all authenticated users for testing
        return [IsAuthenticated()]


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing assignment submissions.
    """
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']  # ADD THIS LINE

    def get_permissions(self):
        """Determine permissions based on the action."""
        return []  # No permissions for testing
    
    def get_queryset(self):
        """Filter submissions based on user role."""
        # Simplified for testing
        return Submission.objects.all()

    def perform_create(self, serializer):
        """Automatically set the student when creating a submission."""
        serializer.save(student=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Explicitly handle POST requests."""
        print("\n" + "="*60)
        print("CREATE METHOD CALLED")
        print(f"User: {request.user}")
        print(f"Authenticated: {request.user.is_authenticated}")
        print(f"Role: {request.user.role if hasattr(request.user, 'role') else 'NO ROLE'}")
        print(f"Data: {request.data}")
        print("="*60 + "\n")
        return super().create(request, *args, **kwargs)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def test_submission(request):
    """Test endpoint to verify POST works"""
    print("\n" + "="*60)
    print("TEST ENDPOINT HIT!")
    print(f"Method: {request.method}")
    print(f"User: {request.user}")
    print(f"Data: {request.data}")
    print("="*60 + "\n")
    return Response({"status": "test endpoint works", "method": request.method})