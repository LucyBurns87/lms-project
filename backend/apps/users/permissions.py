from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsStudent(BasePermission):
    """Allow access only to students."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'


class IsTeacher(BasePermission):
    """Allow access only to teachers."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'teacher'


class IsAdmin(BasePermission):
    """Allow access only to admins."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsTeacherOrAdmin(BasePermission):
    """Allow teachers and admins (e.g., for course creation)."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['teacher', 'admin']


class ReadOnly(BasePermission):
    """Allow read-only access for everyone, write access restricted."""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ['teacher', 'admin']
