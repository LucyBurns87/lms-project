from django.test import TestCase
from .models import Course, Enrollment
from django.contrib.auth import get_user_model

User = get_user_model()

class CourseModelTests(TestCase):

    def setUp(self):
        self.teacher = User.objects.create_user(
            username='teacher',
            password='password',
            role='teacher'
        )
        self.course = Course.objects.create(
            title='Test Course',
            description='A course for testing purposes.',
            teacher=self.teacher
        )

    def test_course_creation(self):
        self.assertEqual(self.course.title, 'Test Course')
        self.assertEqual(self.course.description, 'A course for testing purposes.')
        self.assertEqual(self.course.teacher, self.teacher)

class EnrollmentModelTests(TestCase):

    def setUp(self):
        self.student = User.objects.create_user(
            username='student',
            password='password',
            role='student'
        )
        self.teacher = User.objects.create_user(
            username='teacher',
            password='password',
            role='teacher'
        )
        self.course = Course.objects.create(
            title='Test Course',
            description='A course for testing purposes.',
            teacher=self.teacher
        )
        self.enrollment = Enrollment.objects.create(
            student=self.student,
            course=self.course
        )

    def test_enrollment_creation(self):
        self.assertEqual(self.enrollment.student, self.student)
        self.assertEqual(self.enrollment.course, self.course)

    def test_enrollment_count(self):
        self.assertEqual(self.course.enrollment_set.count(), 1)