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
    
    Permissions:
        - List/Retrieve: Any authenticated user
        - Create/Update/Delete: Teachers and Admins only
    """
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

    def get_permissions(self):
        """Determine permissions based on the action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only teachers and admins can modify assignments
            return [IsAuthenticated(), IsTeacherOrAdmin()]
        # Anyone authenticated can view assignments
        return [IsAuthenticated()]


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing assignment submissions.
    
    Permissions:
        - Create: Students only (auto-assigned to current user)
        - View: Students see their own, Teachers/Admins see all
        - Update/Delete: Teachers/Admins only (for grading)
    """
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]  # Base requirement

    def get_permissions(self):
        """Determine permissions based on the action."""
        if self.action == 'create':
            # Only students can create submissions
            return [IsAuthenticated(), IsStudent()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Only teachers/admins can update or delete (for grading)
            return [IsAuthenticated(), IsTeacherOrAdmin()]
        # List and retrieve use get_queryset filtering
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filter submissions based on user role."""
        user = self.request.user
        
        # Teachers and admins can see all submissions
        if hasattr(user, 'role') and user.role in ['teacher', 'admin']:
            return Submission.objects.all()
        
        # Students only see their own submissions
        return Submission.objects.filter(student=user)

    def perform_create(self, serializer):
        """Automatically set the student when creating a submission."""
        serializer.save(student=self.request.user)


# Remove test endpoints for production
# @api_view(['POST', 'GET'])
# @permission_classes([IsAuthenticated])
# def test_submission(request):
#     """Test endpoint - REMOVE IN PRODUCTION"""
#     return Response({"status": "test endpoint works", "method": request.method})