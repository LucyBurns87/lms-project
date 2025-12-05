"""
URL configuration for the Users application.
Defines API endpoints for user registration, authentication, and profile management.

URL Patterns:
    /api/users/register/    - POST: Create new user account
    /api/users/login/       - POST: User authentication (alternative to JWT)
    /api/users/profile/     - GET/PUT/PATCH: View/update user profile

Note:
    JWT token endpoints are defined in the main urls.py:
        /api/token/         - POST: Obtain JWT access and refresh tokens
        /api/token/refresh/ - POST: Refresh JWT access token

Views:
    RegisterView: Handles new user registration
    LoginView: Alternative login endpoint (JWT tokens preferred)
    UserProfileView: Manages user profile viewing and updates
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, UserProfileView

router = DefaultRouter()

# Future: Register UserViewSet for admin user management
# router.register(r'', UserViewSet, basename='user')
# This would create:
#   GET    /api/users/        -> List all users (admin only)
#   GET    /api/users/{id}/   -> Get user details
#   PUT    /api/users/{id}/   -> Update user
#   DELETE /api/users/{id}/   -> Delete user

# Define URL patterns for authentication and profile endpoints
urlpatterns = [
    # User Registration Endpoint
    # POST /api/users/register/
    # Body: {username, email, password, role, first_name, last_name}
    # Returns: Created user data (without password)
    # Public access - no authentication required
    path(
        'register/',
        RegisterView.as_view(),
        name='register'
    ),
    
    # User Login Endpoint (Alternative to JWT)
    # POST /api/users/login/
    # Body: {username, password}
    # Returns: User data and authentication token
    # Note: JWT token endpoint (/api/token/) is preferred
    # Public access - no authentication required
    path(
        'login/',
        LoginView.as_view(),
        name='login'
    ),
    
    # User Profile Endpoint
    # GET    /api/users/profile/  -> Get current user's profile
    # PUT    /api/users/profile/  -> Update entire profile
    # PATCH  /api/users/profile/  -> Partial profile update
    # Authentication required - uses JWT token from request header
    path(
        'profile/',
        UserProfileView.as_view(),
        name='profile'
    ),
    
    # Include router URLs (empty for now, prepared for future user management)
    path('', include(router.urls)),
]
