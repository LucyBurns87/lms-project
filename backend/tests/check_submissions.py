# check_submissions.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lms_backend.settings')
django.setup()

from apps.assignments.models import Submission

submissions = Submission.objects.all()
print(f"Total submissions: {submissions.count()}")

if submissions.exists():
    for sub in submissions:
        print(f"\nSubmission ID: {sub.id}")
        print(f"Assignment: {sub.assignment_id}")
        print(f"Student: {sub.student.username}")
        print(f"Content: {sub.content[:50]}...")
        print(f"Submitted at: {sub.submitted_at}")
else:
    print("No submissions found in database")