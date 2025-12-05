from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admins to access certain views.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class IsTeacher(permissions.BasePermission):
    """
    Custom permission to only allow teachers to access certain views.
    """

    def has_permission(self, request, view):
        return request.user and request.user.role == 'teacher'

class IsStudent(permissions.BasePermission):
    """
    Custom permission to only allow students to access certain views.
    """

    def has_permission(self, request, view):
        return request.user and request.user.role == 'student'

class IsAdminOrTeacher(permissions.BasePermission):
    """
    Custom permission to only allow admins or teachers to access certain views.
    """

    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.role == 'teacher')