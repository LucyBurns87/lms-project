# check_teacher.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lms_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

try:
    teacher = User.objects.get(username='teacher1')
    print("=" * 50)
    print("TEACHER USER INFO")
    print("=" * 50)
    print(f"Username: {teacher.username}")
    print(f"Email: {teacher.email}")
    print(f"Role: '{teacher.role}'")
    print(f"Role type: {type(teacher.role)}")
    print(f"Is active: {teacher.is_active}")
    print(f"Is staff: {teacher.is_staff}")
    print(f"Role == 'teacher': {teacher.role == 'teacher'}")
    print("=" * 50)
except User.DoesNotExist:
    print("Teacher1 user does not exist!")
    print("\nAvailable users:")
    for user in User.objects.all():
        print(f"  - {user.username} (role: {user.role})")