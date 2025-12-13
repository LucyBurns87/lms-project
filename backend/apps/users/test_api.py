from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class AuthenticationAPITest(TestCase):
    """Test user authentication endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/users/register/'
        self.token_url = '/api/token/'
        self.profile_url = '/api/users/profile/'
        
    def test_user_registration(self):
        """Test user can register successfully"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())
        
    def test_user_login(self):
        """Test user can login and receive JWT token"""
        # Create user
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='student'
        )
        
        # Login
        data = {'username': 'testuser', 'password': 'testpass123'}
        response = self.client.post(self.token_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        
    def test_profile_access_requires_authentication(self):
        """Test profile endpoint requires authentication"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_authenticated_user_can_access_profile(self):
        """Test authenticated user can access their profile"""
        # Create user
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='student'
        )
        
        # Authenticate
        self.client.force_authenticate(user=user)
        
        # Access profile
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')