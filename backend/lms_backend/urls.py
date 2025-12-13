"""
Main URL configuration for the LMS Backend.
Defines the root URL routing for the entire application.

URL Structure:
    /                           - Redirects to admin panel
    /admin/                     - Django admin interface
    /api/token/                 - JWT authentication (login)
    /api/token/refresh/         - JWT token refresh
    /api/users/                 - User management endpoints
    /api/courses/               - Course management endpoints
    /api/assignments/           - Assignment management endpoints
    /api/quizzes/               - Quiz management endpoints (future)

Authentication:
    - JWT (JSON Web Tokens) for API authentication
    - Session authentication for Django admin
"""

from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from .views import health_check, api_root
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Define URL patterns for the entire application
urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('api/', api_root, name='api_root'),
    # Root URL - Redirect to admin panel
    # GET / -> Redirects to /admin/
    # permanent=False means this is a temporary redirect (302)
    # This allows changing the redirect target in the future
    path(
        '', 
        RedirectView.as_view(url='/admin/', permanent=False), 
        name='home'
    ),
    
    # Django Admin Interface
    # GET  /admin/           -> Admin dashboard
    # Built-in Django admin for managing database records
    # Accessible to staff users (is_staff=True)
    path('admin/', admin.site.urls),
    
    # JWT Authentication Endpoints
    # POST /api/token/
    # Body: {"username": "...", "password": "..."}
    # Returns: {"access": "jwt_token", "refresh": "refresh_token"}
    # Use access token in Authorization header: Bearer {access_token}
    path(
        'api/token/', 
        TokenObtainPairView.as_view(), 
        name='token_obtain_pair'
    ),
    
    # JWT Token Refresh Endpoint
    # POST /api/token/refresh/
    # Body: {"refresh": "refresh_token"}
    # Returns: {"access": "new_access_token"}
    # Use when access token expires (typically after 5-15 minutes)
    path(
        'api/token/refresh/', 
        TokenRefreshView.as_view(), 
        name='token_refresh'
    ),
    
    # User Management API
    # Includes:
    #   POST   /api/users/register/   -> User registration
    #   POST   /api/users/login/      -> Alternative login
    #   GET    /api/users/profile/    -> Get user profile
    #   PATCH  /api/users/profile/    -> Update profile
    path('api/users/', include('apps.users.urls')),
    
    # Course Management API
    # Includes:
    #   GET    /api/courses/                  -> List courses
    #   POST   /api/courses/                  -> Create course
    #   GET    /api/courses/{id}/             -> Course details
    #   POST   /api/courses/{id}/enroll/      -> Enroll in course
    #   GET    /api/courses/enrollments/      -> List enrollments
    path('api/courses/', include('apps.courses.urls')),
    
    # Assignment Management API
    # Includes:
    #   GET    /api/assignments/              -> List assignments
    #   POST   /api/assignments/              -> Create assignment
    #   GET    /api/assignments/{id}/         -> Assignment details
    #   POST   /api/assignments/submissions/  -> Submit assignment
    #   PATCH  /api/assignments/submissions/{id}/ -> Grade submission
    path('api/assignments/', include('apps.assignments.urls')),
    
    # Quiz Management API (Future Implementation)
    # Prepared for quiz functionality
    # Will include quiz creation, taking, and grading endpoints
    path('api/quizzes/', include('apps.quizzes.urls')),
]

# API Authentication Flow:
# 1. User registers: POST /api/users/register/
# 2. User logs in: POST /api/token/ -> receives access & refresh tokens
# 3. User makes authenticated requests with header:
#    Authorization: Bearer {access_token}
# 4. When access token expires, refresh it:
#    POST /api/token/refresh/ with refresh token
# 5. Continue making authenticated requests with new access token

# Common HTTP Status Codes:
# - 200 OK: Successful GET, PUT, PATCH
# - 201 Created: Successful POST (resource created)
# - 204 No Content: Successful DELETE
# - 400 Bad Request: Invalid data
# - 401 Unauthorized: Missing or invalid authentication
# - 403 Forbidden: Authenticated but no permission
# - 404 Not Found: Resource doesn't exist
# - 500 Internal Server Error: Server-side error