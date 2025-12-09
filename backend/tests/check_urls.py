# check_urls.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lms_backend.settings')
django.setup()

from apps.courses.models import Course
from apps.assignments.models import Assignment
from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("ALL COURSES")
print("=" * 60)
for course in Course.objects.all():
    print(f"\nCourse ID: {course.id}")
    print(f"Title: {course.title}")
    print(f"Created by: {course.created_by.username if course.created_by else 'NONE (NULL)'}")
    print(f"Created by ID: {course.created_by.id if course.created_by else 'N/A'}")
    
    assignments = course.assignments.all()
    print(f"Assignments: {assignments.count()}")
    for assignment in assignments:
        print(f"  - {assignment.title}")

print("\n" + "=" * 60)
print("TEACHER1 INFO")
print("=" * 60)
try:
    teacher = User.objects.get(username='teacher1')
    print(f"Username: teacher1")
    print(f"User ID: {teacher.id}")
    print(f"Role: {teacher.role}")
    
    # Check if any courses have this user as creator
    teacher_courses = Course.objects.filter(created_by=teacher)
    print(f"\nCourses created by teacher1: {teacher_courses.count()}")
    for course in teacher_courses:
        print(f"  - {course.title} (ID: {course.id})")
except User.DoesNotExist:
    print("teacher1 not found")