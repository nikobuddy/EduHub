# EduHub - Online School Education System

A comprehensive, modern web-based learning management platform built with React, TypeScript, and Tailwind CSS. EduHub provides a complete educational ecosystem for students, teachers, and administrators with role-based access control and intuitive user interfaces.

![EduHub Dashboard](https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## 🌟 Features

### 👥 Multi-Role System
- **Students**: Course enrollment, progress tracking, assignment submission
- **Teachers**: Course creation, student management, grading system
- **Administrators**: User management, content approval, system analytics

### 📚 Core Functionality
- **Authentication**: Secure login/registration with role-based access
- **Course Management**: Video lectures, downloadable resources, quizzes
- **Live Classes**: Integrated scheduling and virtual classroom support
- **Assignment System**: Upload, review, grade, and provide feedback
- **Discussion Forums**: Course-specific Q&A and peer collaboration
- **Progress Tracking**: Real-time analytics and completion certificates
- **Announcements**: System-wide and course-specific notifications

### 🎨 Design & UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with smooth animations
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Dark/Light Mode**: User preference-based theme switching

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eduhub.git
   cd eduhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with enhanced IDE support
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Router** - Client-side routing and navigation
- **Lucide React** - Beautiful, customizable icons

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Database-level security policies
- **Real-time subscriptions** - Live data updates

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing and optimization

## 📁 Project Structure

```
eduhub/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout/         # Layout components (Header, Sidebar)
│   │   └── ProtectedRoute.tsx
│   ├── contexts/           # React context providers
│   │   └── AuthContext.tsx
│   ├── pages/              # Page components
│   │   ├── Auth/           # Authentication pages
│   │   └── Dashboard/      # Role-specific dashboards
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── supabase/               # Database migrations and config
├── package.json
└── README.md
```

## 🔐 Authentication & Roles

### Demo Accounts
For testing purposes, use these demo credentials:

| Role | Email | Password |
|------|-------|----------|
| Student | student@demo.com | any password |
| Teacher | teacher@demo.com | any password |
| Admin | admin@demo.com | any password |

### Role Permissions

#### Students
- View enrolled courses and progress
- Submit assignments and take quizzes
- Participate in discussion forums
- Access course materials and resources

#### Teachers
- Create and manage courses
- Grade assignments and provide feedback
- Conduct live classes
- Monitor student progress
- Post announcements

#### Administrators
- Manage all users and roles
- Approve course content
- System-wide announcements
- Access analytics and reports
- Platform configuration

## 🎯 Key Components

### Dashboard System
Each user role has a customized dashboard:
- **Student Dashboard**: Course progress, upcoming classes, recent assignments
- **Teacher Dashboard**: Course management, student submissions, class schedule
- **Admin Dashboard**: User statistics, system health, pending approvals

### Course Management
- Video lecture integration
- Downloadable resources (PDFs, documents)
- Interactive quizzes and assessments
- Progress tracking and analytics

### Assignment Workflow
1. Teachers create and publish assignments
2. Students submit work with file uploads
3. Teachers review and provide grades/feedback
4. Students receive notifications of graded work

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Code Style
- **ESLint**: Enforces consistent code style
- **Prettier**: Code formatting (recommended)
- **TypeScript**: Strict type checking enabled
- **Component Structure**: Functional components with hooks

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Follow component structure**
   - Create reusable components in `src/components/`
   - Add page components in `src/pages/`
   - Define types in `src/types/`

3. **Update routing**
   - Add new routes in `src/App.tsx`
   - Implement proper role-based access control

## 🗄️ Database Schema

### Core Tables
- **users**: User profiles and authentication
- **courses**: Course information and metadata
- **lessons**: Individual course lessons
- **assignments**: Assignment details and requirements
- **submissions**: Student assignment submissions
- **announcements**: System and course announcements
- **progress**: Student progress tracking

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based access policies
- Secure API endpoints with authentication

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
Ensure all environment variables are configured:
- Database connection strings
- Authentication providers
- File storage configuration
- Email service settings

### Recommended Platforms
- **Vercel**: Optimal for React applications
- **Netlify**: Great for static site deployment
- **Railway**: Full-stack deployment with database
- **Supabase**: Integrated backend and hosting

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style and conventions
- Add TypeScript types for new features
- Include tests for new functionality
- Update documentation as needed
- Ensure responsive design compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

### Getting Help
- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join community discussions for questions
- **Email**: Contact the development team at support@eduhub.com

### Troubleshooting

#### Common Issues
1. **Build Errors**: Ensure all dependencies are installed
2. **Authentication Issues**: Check environment variables
3. **Database Connection**: Verify Supabase configuration
4. **Styling Issues**: Clear browser cache and rebuild

#### Performance Optimization
- Enable code splitting for large applications
- Optimize images and assets
- Implement lazy loading for components
- Use React.memo for expensive components

## 🔮 Roadmap

### Upcoming Features
- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered content recommendations
- [ ] Integration with external LMS platforms
- [ ] Multi-language support
- [ ] Advanced video player with annotations
- [ ] Gamification and achievement system
- [ ] Parent/guardian portal

### Version History
- **v1.0.0**: Initial release with core features
- **v1.1.0**: Enhanced UI/UX and performance improvements
- **v1.2.0**: Advanced assignment system and grading
- **v2.0.0**: Live classes and real-time collaboration

---

**Built with ❤️ by the EduHub Team**

For more information, visit our [website](https://eduhub.com) or follow us on [Twitter](https://twitter.com/eduhub).