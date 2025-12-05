"""
Models for the Courses application.
Defines Course and Enrollment models for course management.
"""

from django.db import models
from django.conf import settings


class Course(models.Model):
    """
    Represents a course in the Learning Management System.
    
    Attributes:
        title (CharField): Name of the course (max 200 characters).
        description (TextField): Detailed course description and objectives.
        created_by (ForeignKey): Teacher who created the course.
                                Optional - can be null if teacher is deleted.
        date_created (DateTimeField): When the course was created.
                                     Auto-generated timestamp.
    
    Related Names:
        courses_created: Access all courses created by a teacher
                        Example: teacher.courses_created.all()
        enrollments: Access all enrollments for this course
                    Example: course.enrollments.all()
        assignments: Access all assignments for this course
                    Example: course.assignments.all()
    
    Methods:
        __str__: Returns the course title
    """
    # Course title (required)
    title = models.CharField(
        max_length=200,
        help_text="Name of the course"
    )
    
    # Detailed course description (required)
    description = models.TextField(
        help_text="Course objectives, syllabus, and requirements"
    )
    
    # Teacher who created the course (optional - retained if teacher deleted)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,  # Keep course if teacher is deleted
        related_name="courses_created"  # Access via: teacher.courses_created.all()
    )
    
    # Auto-generated creation timestamp
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        """
        Metadata options for the Course model.
        """
        ordering = ['-date_created']  # Newest courses first
        verbose_name = "Course"
        verbose_name_plural = "Courses"

    def __str__(self):
        """
        String representation of the course.
        
        Returns:
            str: The course title
        """
        return self.title
    
    def get_enrolled_students_count(self):
        """
        Get the number of students enrolled in this course.
        
        Returns:
            int: Count of enrolled students
        """
        return self.enrollments.count()
    
    def get_assignments_count(self):
        """
        Get the number of assignments in this course.
        
        Returns:
            int: Count of assignments
        """
        return self.assignments.count()


class Enrollment(models.Model):
    """
    Represents a student's enrollment in a course.
    
    Attributes:
        student (ForeignKey): The student enrolled in the course.
        course (ForeignKey): The course the student is enrolled in.
        date_enrolled (DateTimeField): When the enrollment occurred.
                                      Auto-generated timestamp.
    
    Related Names:
        enrollments: Access all enrollments for a student
                    Example: student.enrollments.all()
        enrollments: Access all enrollments for a course
                    Example: course.enrollments.all()
    
    Constraints:
        unique_together: Prevents duplicate enrollments
                        (one student can't enroll in same course twice)
    
    Methods:
        __str__: Returns formatted enrollment information
    """
    # Student enrolled in the course
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,  # Delete enrollment if student is deleted
        related_name="enrollments"  # Access via: student.enrollments.all()
    )
    
    # Course the student is enrolled in
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,  # Delete enrollment if course is deleted
        related_name="enrollments"  # Access via: course.enrollments.all()
    )
    
    # Auto-generated enrollment timestamp
    date_enrolled = models.DateTimeField(auto_now_add=True)

    class Meta:
        """
        Metadata options for the Enrollment model.
        """
        ordering = ['-date_enrolled']  # Most recent enrollments first
        verbose_name = "Enrollment"
        verbose_name_plural = "Enrollments"
        # Ensure a student can only enroll once per course
        unique_together = ('student', 'course')

    def __str__(self):
        """
        String representation of the enrollment.
        
        Returns:
            str: Format - "StudentName enrolled in CourseName"
        """
        return f"{self.student.username} enrolled in {self.course.title}"