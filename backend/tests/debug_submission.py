"""
Debug script to test submission permissions
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lms_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.users.permissions import IsStudent

User = get_user_model()

# Get LucyAC
lucy = User.objects.get(username='LucyAC')

print("=" * 50)
print("USER DEBUG INFO")
print("=" * 50)
print(f"Username: {lucy.username}")
print(f"Role: '{lucy.role}'")
print(f"Role type: {type(lucy.role)}")
print(f"Is authenticated: {lucy.is_authenticated}")
print(f"Role == 'student': {lucy.role == 'student'}")
print(f"Role repr: {repr(lucy.role)}")

# Test permission directly
class FakeRequest:
    def __init__(self, user):
        self.user = user

fake_request = FakeRequest(lucy)
permission = IsStudent()
has_perm = permission.has_permission(fake_request, None)

print("\n" + "=" * 50)
print("PERMISSION CHECK")
print("=" * 50)
print(f"IsStudent.has_permission(): {has_perm}")

# Check for hidden characters
print("\n" + "=" * 50)
print("ROLE BYTES")
print("=" * 50)
print(f"Role bytes: {lucy.role.encode('utf-8')}")
print(f"Expected bytes: {b'student'}")
print(f"Match: {lucy.role.encode('utf-8') == b'student'}")