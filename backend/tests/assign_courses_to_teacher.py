# assign_courses_to_teacher.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lms_backend.settings')
django.setup()

from apps.courses.models import Course
from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("ASSIGNING COURSES TO TEACHER1")
print("=" * 60)

try:
    teacher = User.objects.get(username='teacher1')
    print(f"Teacher1 ID: {teacher.id}\n")
    
    # Find courses without a creator or created by other users
    all_courses = Course.objects.all()
    
    if all_courses.count() == 0:
        print("No courses exist in the database.")
        print("You need to create a course using the 'Create Course' button in the Teacher Dashboard.")
    else:
        print(f"Found {all_courses.count()} course(s):\n")
        
        for course in all_courses:
            old_creator = course.created_by.username if course.created_by else "None"
            course.created_by = teacher
            course.save()
            print(f"✓ Course: {course.title}")
            print(f"  Changed from: {old_creator} → teacher1\n")
        
        print("=" * 60)
        print("SUCCESS! All courses now assigned to teacher1")
        print("=" * 60)
        print("\nRefresh the Teacher Dashboard to see your courses.")
        
except User.DoesNotExist:
    print("ERROR: teacher1 user does not exist!")