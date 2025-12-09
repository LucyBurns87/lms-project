# test_enrollments_api.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lms_backend.settings')
django.setup()

from apps.courses.models import Course, Enrollment
from apps.courses.serializers import EnrollmentSerializer

print("=" * 60)
print("ENROLLMENT API DATA")
print("=" * 60)

# Get HTML course
course = Course.objects.get(id=1)
print(f"\nCourse: {course.title} (ID: {course.id})")

# Get enrollments for this course
enrollments = Enrollment.objects.filter(course_id=1)
print(f"Found {enrollments.count()} enrollment(s)\n")

# Serialize the data (like the API does)
serializer = EnrollmentSerializer(enrollments, many=True)
print("Serialized data (what the frontend receives):")
print("-" * 60)

import json
print(json.dumps(serializer.data, indent=2, default=str))