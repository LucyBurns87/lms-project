# check_enrollments.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lms_backend.settings')
django.setup()

from apps.courses.models import Course, Enrollment
from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("COURSES")
print("=" * 60)
for course in Course.objects.all():
    print(f"\nCourse ID: {course.id}")
    print(f"Title: {course.title}")
    print(f"Created by: {course.created_by.username} (role: {course.created_by.role})")
    
    enrollments = course.enrollments.all()
    print(f"Enrollments: {enrollments.count()}")
    for enrollment in enrollments:
        print(f"  - {enrollment.student.username} (enrolled: {enrollment.date_enrolled})")

print("\n" + "=" * 60)
print("ENROLLMENTS BY STUDENT")
print("=" * 60)
try:
    lucy = User.objects.get(username='LucyAC')
    lucy_enrollments = lucy.enrollments.all()
    print(f"\nLucyAC enrollments: {lucy_enrollments.count()}")
    for enrollment in lucy_enrollments:
        print(f"  - Course: {enrollment.course.title} (ID: {enrollment.course.id})")
        print(f"    Created by: {enrollment.course.created_by.username}")
except User.DoesNotExist:
    print("LucyAC not found")

print("\n" + "=" * 60)
print("TEACHER1 COURSES")
print("=" * 60)
try:
    teacher = User.objects.get(username='teacher1')
    teacher_courses = Course.objects.filter(created_by=teacher)
    print(f"\nteacher1 courses: {teacher_courses.count()}")
    for course in teacher_courses:
        print(f"  - {course.title} (ID: {course.id})")
        print(f"    Enrollments: {course.enrollments.count()}")
except User.DoesNotExist:
    print("teacher1 not found")