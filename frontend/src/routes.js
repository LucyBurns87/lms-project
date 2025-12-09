/**
 * Application routing with role-based access
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './components/auth/LoginForm';
import Register from './components/auth/RegisterForm';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseList from './components/courses/CourseList';
import CourseDetail from './components/courses/CourseDetail';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Assignment Pages
import AssignmentList from './components/assignments/AssignmentList';
import AssignmentDetail from './pages/AssignmentDetail';
import CreateAssignment from './pages/CreateAssignment';
import EditAssignment from './pages/EditAssignment';

// Submission Pages
import SubmissionList from './pages/SubmissionList';
import SubmissionDetail from './pages/SubmissionDetail';

// Profile Pages
import Profile from './pages/Profile';
import MyEnrollments from './components/profile/MyEnrollments';

import useAuth from './hooks/useAuth';
import TeacherLoginForm from './components/auth/TeacherLoginForm';


const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  if (user.role === 'teacher') {
    return <Navigate to="/teacher/dashboard" replace />;
  } else if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/student/dashboard" replace />;
  }
};


<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardRedirect />
    </ProtectedRoute>
  }
  />

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/teacher-login" element={<TeacherLoginForm />} />

      {/* Protected Routes - Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Course Routes - All authenticated users */}
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CourseList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        }
      />

      {/* Assignment Routes */}
      <Route
        path="/assignments"
        element={
          <ProtectedRoute>
            <AssignmentList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assignments/:id"
        element={
          <ProtectedRoute>
            <AssignmentDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assignments/create"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CreateAssignment />
          </ProtectedRoute>
        }
      />

      {/* Submission Routes */}
      <Route
        path="/submissions"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <SubmissionList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/submissions/:id"
        element={
          <ProtectedRoute>
            <SubmissionDetail />
          </ProtectedRoute>
        }
      />

      {/* Profile Route - All authenticated users */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
{/* Assignment Routes */}
      <Route
        path="/assignments/create"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CreateAssignment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assignments/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <EditAssignment />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/my-enrollments"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <MyEnrollments />
          </ProtectedRoute>
        }
      />

      {/* Error Pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />




    </Routes>
  );
};

export default AppRoutes;