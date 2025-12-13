from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

def health_check(request):
    """Health check endpoint for Render deployment monitoring."""
    return JsonResponse({'status': 'healthy', 'service': 'LMS Backend'})

@api_view(['GET'])
def api_root(request):
    """API root endpoint showing available API endpoints."""
    return Response({
        'message': 'LMS Backend API',
        'version': '1.0',
        'endpoints': {
            'authentication': {
                'login': '/api/token/',
                'refresh': '/api/token/refresh/',
            },
            'users': '/api/users/',
            'courses': '/api/courses/',
            'assignments': '/api/assignments/',
            'quizzes': '/api/quizzes/',
        }
    })

def landing_page(request):
    return HttpResponse("""
        <h1>Welcome to the LMS Backend 🚀</h1>
        <p>Available endpoints:</p>
        <ul>
            <li><a href="/admin/">Admin Dashboard</a></li>
            <li><a href="/api/token/">Obtain JWT Token</a></li>
            <li><a href="/api/token/refresh/">Refresh JWT Token</a></li>
            <li><a href="/api/users/">User Management</a></li>
            <li><a href="/api/">Course API</a></li>
        </ul>
    """)
