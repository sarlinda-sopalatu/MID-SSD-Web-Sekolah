import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import ClassesPage from './pages/ClassesPage';
import SubjectsPage from './pages/SubjectsPage';
import JournalsPage from './pages/JournalsPage';
import BkPage from './pages/BkPage';
import AttendancePage from './pages/AttendancePage';
import GradesPage from './pages/GradesPage';
import SchedulesPage from './pages/SchedulesPage';
import UsersPage from './pages/UsersPage';
import LogsPage from './pages/LogsPage';
import ProfilePage from './pages/ProfilePage';
import ChildViewPage from './pages/ChildViewPage';
import AccountPage from './pages/AccountPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
          <main className="flex-1 overflow-y-auto bg-slate-50">
            <div className="p-6 max-w-screen-2xl mx-auto">
            <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/journals" element={<JournalsPage />} />
            <Route path="/bk" element={<BkPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/child" element={<ChildViewPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
            </div>
          </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
