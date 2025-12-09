from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Submission
from django.contrib.auth import get_user_model
import traceback
import json
from datetime import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def simple_submit(request):
    """Ultra simple submission endpoint for testing"""
    log_file = 'submission_log.txt'
    
    # Log the request
    with open(log_file, 'a') as f:
        f.write(f"\n{'='*60}\n")
        f.write(f"NEW REQUEST: {datetime.now()}\n")
        f.write(f"User: {request.user} (authenticated: {request.user.is_authenticated})\n")
        f.write(f"Method: {request.method}\n")
        f.write(f"Content-Type: {request.content_type}\n")
        f.write(f"Data: {request.data}\n")
        f.write(f"{'='*60}\n")
    
    try:
        assignment_id = request.data.get('assignment')
        content = request.data.get('content')
        
        with open(log_file, 'a') as f:
            f.write(f"Parsed - assignment_id: {assignment_id}, content length: {len(content) if content else 0}\n")
        
        if not assignment_id or not content:
            with open(log_file, 'a') as f:
                f.write(f"VALIDATION FAILED: Missing assignment_id or content\n")
            return Response(
                {"error": "assignment and content are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        with open(log_file, 'a') as f:
            f.write(f"Creating submission...\n")
        
        submission = Submission.objects.create(
            assignment_id=assignment_id,
            student=request.user,
            content=content
        )
        
        with open(log_file, 'a') as f:
            f.write(f"SUCCESS! Created submission ID: {submission.id}\n")
        
        return Response({
            "id": submission.id,
            "message": "Submission created successfully!",
            "assignment": assignment_id,
            "student": request.user.username
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        error_msg = str(e)
        error_trace = traceback.format_exc()
        
        # Write detailed error
        with open(log_file, 'a') as f:
            f.write(f"ERROR OCCURRED!\n")
            f.write(f"Error: {error_msg}\n\n")
            f.write(f"Traceback:\n{error_trace}\n\n")
            f.write(f"User: {request.user}\n")
            f.write(f"Data: {request.data}\n")
        
        return Response(
            {"error": error_msg, "detail": "Check submission_log.txt for details"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )