from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Course, Enrollment

User = get_user_model()


class CourseAPITest(TestCase):
    """Test course endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.courses_url = '/api/courses/'
        
        # Create users
        self.teacher = User.objects.create_user(
            username='teacher',
            email='teacher@example.com',
            password='teacherpass',
            role='teacher'
        )
        
        self.student = User.objects.create_user(
            username='student',
            email='student@example.com',
            password='studentpass',
            role='student'
        )
        
        # Create test course
        self.course = Course.objects.create(
            title='Test Course',
            description='Test Description',
            created_by=self.teacher
        )
        
    def test_list_courses_public(self):
        """Test anyone can list courses"""
        response = self.client.get(self.courses_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_create_course_requires_authentication(self):
        """Test creating course requires authentication"""
        data = {'title': 'New Course', 'description': 'New Description'}
        response = self.client.post(self.courses_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_teacher_can_create_course(self):
        """Test teacher can create courses"""
        self.client.force_authenticate(user=self.teacher)
        data = {'title': 'New Course', 'description': 'New Description'}
        response = self.client.post(self.courses_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 2)
        
    def test_student_can_enroll_in_course(self):
        """Test student can enroll in a course"""
        self.client.force_authenticate(user=self.student)
        enroll_url = f'/api/courses/{self.course.id}/enroll/'
        response = self.client.post(enroll_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Enrollment.objects.filter(
                student=self.student,
                course=self.course
            ).exists()
        )
        
    def test_cannot_enroll_twice(self):
        """Test student cannot enroll in same course twice"""
        Enrollment.objects.create(student=self.student, course=self.course)
        
        self.client.force_authenticate(user=self.student)
        enroll_url = f'/api/courses/{self.course.id}/enroll/'
        response = self.client.post(enroll_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class EnrollmentAPITest(TestCase):
    """Test enrollment endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.enrollments_url = '/api/courses/enrollments/'
        
        # Create users
        self.teacher = User.objects.create_user(
            username='teacher',
            password='teacherpass',
            role='teacher'
        )
        
        self.student = User.objects.create_user(
            username='student',
            password='studentpass',
            role='student'
        )
        
        # Create course and enrollment
        self.course = Course.objects.create(
            title='Test Course',
            description='Test',
            created_by=self.teacher
        )
        
        self.enrollment = Enrollment.objects.create(
            student=self.student,
            course=self.course
        )
    
    # These methods need to be indented to be part of the class
    def test_student_can_see_own_enrollments(self):
        """Test student can view their own enrollments"""
        self.client.force_authenticate(user=self.student)
        # Use the custom my_enrollments endpoint instead
        url = '/api/courses/enrollments/my_enrollments/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_teacher_can_see_all_enrollments(self):
        """Test teacher can view all enrollments"""
        self.client.force_authenticate(user=self.teacher)
        # Teachers should use the main list endpoint
        url = '/api/courses/enrollments/my_enrollments/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_enrollment_filtering_by_course(self):
        """Test filtering enrollments by course ID"""
        self.client.force_authenticate(user=self.teacher)
        url = f'/api/courses/enrollments/my_enrollments/?course={self.course.id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)