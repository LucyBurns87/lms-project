from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import User
from apps.courses.models import Course

class APITests(APITestCase):

    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass'
        )
        self.teacher_user = User.objects.create_user(
            username='teacher',
            email='teacher@example.com',
            password='teacherpass',
            role='teacher'
        )
        self.student_user = User.objects.create_user(
            username='student',
            email='student@example.com',
            password='studentpass',
            role='student'
        )
        self.course = Course.objects.create(
            title='Test Course',
            description='This is a test course.',
            created_by=self.teacher_user
        )

    def test_admin_can_create_course(self):
        self.client.login(username='admin', password='adminpass')
        response = self.client.post(reverse('course-list'), {
            'title': 'New Course',
            'description': 'This is a new course.',
            'created_by': self.teacher_user.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_teacher_can_create_course(self):
        self.client.login(username='teacher', password='teacherpass')
        response = self.client.post(reverse('course-list'), {
            'title': 'Another Course',
            'description': 'This is another course.',
            'created_by': self.teacher_user.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_student_cannot_create_course(self):
        self.client.login(username='student', password='studentpass')
        response = self.client.post(reverse('course-list'), {
            'title': 'Unauthorized Course',
            'description': 'This should not be allowed.',
            'created_by': self.teacher_user.id
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_course_list(self):
        response = self.client.get(reverse('course-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_course_detail(self):
        response = self.client.get(reverse('course-detail', args=[self.course.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.course.title)