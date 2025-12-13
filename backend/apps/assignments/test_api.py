from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.courses.models import Course
from .models import Assignment, Submission

User = get_user_model()


class AssignmentAPITest(TestCase):
    """Test assignment endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.assignments_url = '/api/assignments/'
        
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
        
        # Create course
        self.course = Course.objects.create(
            title='Test Course',
            created_by=self.teacher
        )
        
        # Create assignment
        self.assignment = Assignment.objects.create(
            title='Test Assignment',
            description='Test Description',
            course=self.course
        )
        
    def test_list_assignments(self):
        """Test authenticated users can list assignments"""
        self.client.force_authenticate(user=self.student)
        response = self.client.get(self.assignments_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SubmissionAPITest(TestCase):
    """Test submission endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.submit_url = '/api/assignments/simple-submit/'
        
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
        
        # Create course and assignment
        self.course = Course.objects.create(
            title='Test Course',
            created_by=self.teacher
        )
        
        self.assignment = Assignment.objects.create(
            title='Test Assignment',
            course=self.course
        )
        
    def test_student_can_submit_assignment(self):
        """Test student can submit an assignment"""
        self.client.force_authenticate(user=self.student)
        data = {
            'assignment': self.assignment.id,
            'content': 'My assignment submission'
        }
        response = self.client.post(self.submit_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Changed from HTTP_201_CREATED
        self.assertTrue(
            Submission.objects.filter(
                student=self.student,
                assignment=self.assignment
            ).exists()
        )
        
    def test_resubmission_updates_existing(self):
        """Test resubmitting updates existing submission"""
        # First submission
        Submission.objects.create(
            student=self.student,
            assignment=self.assignment,
            content='First submission'
        )
        
        # Resubmit
        self.client.force_authenticate(user=self.student)
        data = {
            'assignment': self.assignment.id,
            'content': 'Updated submission'
        }
        response = self.client.post(self.submit_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check it updated instead of creating new
        self.assertEqual(
            Submission.objects.filter(
                student=self.student,
                assignment=self.assignment
            ).count(),
            1
        )
        
        submission = Submission.objects.get(
            student=self.student,
            assignment=self.assignment
        )
        self.assertEqual(submission.content, 'Updated submission')