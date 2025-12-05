from django.contrib.auth.models import AbstractUser
from django.db import models

"""
Models for the Assignments application.
Defines Assignment and Submission models for managing coursework.
"""

from django.conf import settings


class Assignment(models.Model):
    """
    Represents an assignment created by a teacher for a specific course.
    
    assignments: Access all assignments from a Course object
    Example: course.assignments.all()
    
    Methods:
        __str__: Returns human-readable string representation
    """
    # Link to the course this assignment belongs to
    course = models.ForeignKey(
        "courses.Course", 
        on_delete=models.CASCADE,  # Delete assignment if course is deleted
        related_name="assignments"  # Access via: course.assignments.all()
    )
    
    # Assignment title (required)
    title = models.CharField(max_length=200)
    
    # Detailed assignment description (optional)
    description = models.TextField(blank=True)
    
    # Submission deadline (optional)
    due_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        """
        Metadata options for the Assignment model.
        """
        ordering = ['-due_date']  # Most recent due dates first
        verbose_name = "Assignment"
        verbose_name_plural = "Assignments"

    def __str__(self):
        """
        String representation of the assignment.
        
        Returns:
            str: Format - "Assignment Title (Course Name)"
        """
        return f"{self.title} ({self.course.title})"
    
    def is_overdue(self):
        """
        Check if the assignment deadline has passed.
        
        Returns:
            bool: True if assignment is overdue, False otherwise
        """
        from django.utils import timezone
        if self.due_date:
            return timezone.now() > self.due_date
        return False


class Submission(models.Model):
    """
    Represents a student's submission for an assignment.
    
    submissions: Access all submissions for an Assignment
                    Example: assignment.submissions.all()
    submissions: Access all submissions by a User
                    Example: user.submissions.all()
    
    Methods:
        __str__: Returns human-readable string representation
    """
    # Link to the assignment being submitted
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,  # Delete submission if assignment is deleted
        related_name="submissions"  # Access via: assignment.submissions.all()
    )
    
    # Link to the student who made the submission
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Reference to custom User model
        on_delete=models.CASCADE,  # Delete submission if student is deleted
        related_name="submissions"  # Access via: student.submissions.all()
    )
    
    # The student's work/answer (required)
    content = models.TextField()
    
    # Teacher's grade (optional until graded)
    grade = models.IntegerField(
        null=True,
        blank=True,
        help_text="Score out of 100"
    )
    
    # Teacher's feedback comments (optional)
    feedback = models.TextField(
        blank=True,
        help_text="Teacher's comments on the submission"
    )
    
    # Auto-generated timestamp when submission is created
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        """
        Metadata options for the Submission model.
        """
        ordering = ['-submitted_at']  # Most recent submissions first
        verbose_name = "Submission"
        verbose_name_plural = "Submissions"
        # Ensure one submission per student per assignment
        unique_together = [['assignment', 'student']]

    def __str__(self):
        """
        String representation of the submission.
        
        Returns:
            str: Format - "StudentName - Assignment Title"
        """
        return f"{self.student.username} - {self.assignment.title}"
    
    def is_graded(self):
        """
        Check if the submission has been graded.
        
        Returns:
            bool: True if grade has been assigned, False otherwise
        """
        return self.grade is not None
    
    def is_late(self):
        """
        Check if submission was submitted after the due date.
        
        Returns:
            bool: True if submitted late, False otherwise
        """
        if self.assignment.due_date:
            return self.submitted_at > self.assignment.due_date
        return False