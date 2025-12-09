# check_teacher_enrollments.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lms_backend.settings')
django.setup()

from apps.courses.models import Course, Enrollment
from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 60)
print("TEACHER1 COURSES AND ENROLLMENTS")
print("=" * 60)

try:
    teacher = User.objects.get(username='teacher1')
    teacher_courses = Course.objects.filter(created_by=teacher)
    
    print(f"\nTeacher1 has {teacher_courses.count()} course(s):\n")
    
    for course in teacher_courses:
        print(f"Course: {course.title} (ID: {course.id})")
        enrollments = course.enrollments.all()
        print(f"Enrollments: {enrollments.count()}")
        
        if enrollments.exists():
            for enrollment in enrollments:
                print(f"  ✓ {enrollment.student.username} - enrolled on {enrollment.date_enrolled}")
        else:
            print(f"  ✗ No students enrolled")
        print()
    
    # Check LucyAC's enrollments
    print("=" * 60)
    print("LUCYAC ENROLLMENTS")
    print("=" * 60)
    try:
        lucy = User.objects.get(username='LucyAC')
        lucy_enrollments = lucy.enrollments.all()
        print(f"\nLucyAC is enrolled in {lucy_enrollments.count()} course(s):\n")
        
        for enrollment in lucy_enrollments:
            course = enrollment.course
            print(f"Course: {course.title} (ID: {course.id})")
            print(f"  Created by: {course.created_by.username}")
            print(f"  Enrolled on: {enrollment.date_enrolled}")
            print()
            
    except User.DoesNotExist:
        print("LucyAC not found!")
        
except User.DoesNotExist:
    print("teacher1 not found!")