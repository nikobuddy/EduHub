import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import AdminUpload from './pages/Dashboard/AdminUploads';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import TeacherDashboard from './pages/Dashboard/TeacherDashboard';
import Assignments from './pages/Discussions/Assignments';
import Courses from './pages/Discussions/Courses';
import Discussions from './pages/Discussions/Discussions';
import Progress from './pages/Discussions/Progress';
import VideoPlayerPage from './pages/Discussions/VideoPlayerPage';
import Schedule from './pages/Schedule/Schedule';
import AdminUploads from './pages/Dashboard/AdminUpload';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <StudentDashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path="/admins" element={<AdminUpload />} />
          <Route path="/adminss" element={<AdminUploads />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardRouter />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/video/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <VideoPlayerPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Courses />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <Layout>
                  <Assignments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Layout>
                  <Schedule />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/discussions"
            element={
              <ProtectedRoute>
                <Layout>
                  <Discussions />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <Progress />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Students</h2>
                    <p className="text-gray-600">Student management coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
                    <p className="text-gray-600">User management coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Announcements</h2>
                    <p className="text-gray-600">Announcement system coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/live-classes"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Classes</h2>
                    <p className="text-gray-600">Live class management coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
                    <p className="text-gray-600">Reporting system coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                    <p className="text-gray-600">System settings coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard\" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;