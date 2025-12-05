from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserModelTests(TestCase):

    def test_create_user_with_valid_email_successful(self):
        email = 'test@example.com'
        password = 'Testpass123'
        user = User.objects.create_user(email=email, password=password)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_create_user_with_invalid_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email=None, password='Testpass123')

    def test_create_superuser(self):
        email = 'admin@example.com'
        password = 'Adminpass123'
        superuser = User.objects.create_superuser(email=email, password=password)
        self.assertEqual(superuser.email, email)
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_staff)

    def test_user_str_method(self):
        user = User(email='test@example.com')
        self.assertEqual(str(user), user.email)