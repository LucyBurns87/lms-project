"""
Script to fix user roles in the database.
Run this with: python fix_student_role.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lms_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def fix_user_roles():
    print("=" * 50)
    print("CHECKING USER ROLES")
    print("=" * 50)
    
    all_users = User.objects.all()
    
    if not all_users.exists():
        print("No users found in database!")
        return
    
    print(f"\nFound {all_users.count()} users:\n")
    
    fixed_count = 0
    
    for user in all_users:
        print(f"Username: {user.username}")
        print(f"  Current Role: '{user.role}'")
        print(f"  Email: {user.email}")
        print(f"  Is Staff: {user.is_staff}")
        print(f"  Is Superuser: {user.is_superuser}")
        
        # Fix logic
        if user.is_superuser and user.role != 'admin':
            user.role = 'admin'
            user.save()
            print(f"  ✓ FIXED: Set to 'admin' (superuser)")
            fixed_count += 1
        elif user.role == '' or user.role is None:
            user.role = 'student'
            user.save()
            print(f"  ✓ FIXED: Set to 'student' (was empty)")
            fixed_count += 1
        elif user.role not in ['student', 'teacher', 'admin']:
            user.role = 'student'
            user.save()
            print(f"  ✓ FIXED: Set to 'student' (invalid role)")
            fixed_count += 1
        else:
            print(f"  ✓ OK: Role is valid")
        
        print()
    
    print("=" * 50)
    print(f"SUMMARY: Fixed {fixed_count} users")
    print("=" * 50)
    
    if fixed_count > 0:
        print("\nNEXT STEPS:")
        print("1. Restart Django server (Ctrl+C then 'python manage.py runserver')")
        print("2. Clear browser localStorage in DevTools Console:")
        print("   localStorage.clear(); location.reload();")
        print("3. Log in again")

if __name__ == '__main__':
    fix_user_roles()