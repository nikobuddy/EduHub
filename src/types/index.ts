export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  teacher_id: string;
  teacher_name: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  students_count: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url?: string;
  content: string;
  order: number;
  duration: number;
  created_at: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  content: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  course_id?: string;
  created_at: string;
}

export interface Progress {
  id: string;
  student_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  progress_percentage: number;
  completed_at?: string;
}