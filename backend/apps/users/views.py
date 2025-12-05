"""
Views for the Users application.
Handles user registration, authentication, and profile management.

Views:
    RegisterView: User registration endpoint
    LoginView: Alternative login endpoint (JWT preferred)
    UserProfileView: User profile viewing and updating
"""

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from .serializers import UserSerializer, RegisterSerializer
from django.contrib.auth import get_user_model

# Get the custom User model
User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    Creates new user accounts with hashed passwords.
    
    Endpoint:
        POST /api/users/register/
    
    Request Body:
        {
            "username": "john_doe",
            "email": "john@example.com",
            "password": "securepass123",
            "role": "student",           // Optional, defaults to 'student'
            "first_name": "John",        // Optional
            "last_name": "Doe"           // Optional
        }
    
    Response (201 Created):
        {
            "id": 1,
            "username": "john_doe",
            "email": "john@example.com",
            "role": "student",
            "first_name": "John",
            "last_name": "Doe"
        }
    
    Permissions:
        - Public access (no authentication required)
    
    Validation:
        - Username must be unique
        - Email must be unique and valid format
        - Password must be at least 8 characters
        - Role must be one of: student, teacher, admin
    """
    # Use all User objects as base queryset
    queryset = User.objects.all()
    
    # Use RegisterSerializer for validation and creation
    serializer_class = RegisterSerializer
    
    # Allow unauthenticated access for registration
    permission_classes = [AllowAny]


class LoginView(APIView):
    """
    Alternative login endpoint (JWT token endpoint is preferred).
    Authenticates user and returns user data.
    
    """
    # Allow unauthenticated access for login
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Authenticate user with username and password.
        
        Args:
            request: HTTP request containing username and password
        
        Returns:
            Response: User data if authenticated, error message if not
        """
        # Extract credentials from request
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate user
        user = authenticate(username=username, password=password)

        if user is not None:
            # Authentication successful - return user data
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Authentication failed - return error
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for viewing and updating user profile.
    Users can only access their own profile.
    
    Endpoints:
        GET   /api/users/profile/     - Get current user's profile
        PUT   /api/users/profile/     - Update entire profile
        PATCH /api/users/profile/     - Partial profile update
    
    Request Headers:
        Authorization: Bearer {jwt_access_token}
    
    GET Response (200 OK):
        {
            "id": 1,
            "username": "john_doe",
            "email": "john@example.com",
            "role": "student",
            "first_name": "John",
            "last_name": "Doe"
        }
    
    PATCH Request Body (example):
        {
            "first_name": "Johnny",
            "email": "johnny@example.com"
        }
    
    PATCH Response (200 OK):
        {
            "id": 1,
            "username": "john_doe",
            "email": "johnny@example.com",
            "role": "student",
            "first_name": "Johnny",
            "last_name": "Doe"
        }
    
    Permissions:
        - Authenticated users only
        - Users can only access/update their own profile
    
    Security:
        - Username cannot be changed (read-only in serializer)
        - Password updates should use separate endpoint
        - Role changes should be restricted (admin only)
    """
    # Serializer for profile data
    serializer_class = UserSerializer
    
    # Require authentication
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Override to return the authenticated user's profile.
        Ensures users can only access their own profile.
        
        Returns:
            User: The authenticated user object
        
        Security:
            By returning request.user, we ensure users can't access
            other users' profiles even if they try to modify the URL.
        """
        # Return the currently authenticated user
        # This prevents users from accessing other users' profiles
        return self.request.user