import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  MessageSquare,
  PieChart,
  Users,
  Settings,
  Award,
  FileText,
  Video,
  Megaphone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { to: '/dashboard', icon: PieChart, label: 'Dashboard' },
          { to: '/courses', icon: BookOpen, label: 'My Courses' },
          { to: '/assignments', icon: FileText, label: 'Assignments' },
          { to: '/schedule', icon: Calendar, label: 'Schedule' },
          { to: '/discussions', icon: MessageSquare, label: 'Discussions' },
          { to: '/progress', icon: Award, label: 'Progress' },
        ];
      case 'teacher':
        return [
          { to: '/dashboard', icon: PieChart, label: 'Dashboard' },
          { to: '/courses', icon: BookOpen, label: 'My Courses' },
          { to: '/students', icon: Users, label: 'Students' },
          { to: '/assignments', icon: FileText, label: 'Assignments' },
          { to: '/live-classes', icon: Video, label: 'Live Classes' },
          { to: '/discussions', icon: MessageSquare, label: 'Discussions' },
          { to: '/announcements', icon: Megaphone, label: 'Announcements' },
        ];
      case 'admin':
        return [
          { to: '/dashboard', icon: PieChart, label: 'Dashboard' },
          { to: '/users', icon: Users, label: 'User Management' },
          { to: '/courses', icon: BookOpen, label: 'Course Management' },
          { to: '/announcements', icon: Megaphone, label: 'Announcements' },
          { to: '/reports', icon: FileText, label: 'Reports' },
          { to: '/settings', icon: Settings, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="bg-gray-50 w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;