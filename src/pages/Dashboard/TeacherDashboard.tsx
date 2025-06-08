import { collection, getDocs } from 'firebase/firestore';
import { BookOpen, FileText, TrendingUp, Users, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase'; // your Firebase config file

const TeacherDashboard: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const courseSnap = await getDocs(collection(db, 'courses'));
      const submissionSnap = await getDocs(collection(db, 'submissions'));
      const classSnap = await getDocs(collection(db, 'classes'));

      setCourses(courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setSubmissions(submissionSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setClasses(classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const totalStudents = courses.reduce((sum, course) => sum + (course.students || 0), 0);
  const avgCompletion = Math.round(
    courses.reduce((sum, course) => sum + (course.completion || 0), 0) / (courses.length || 1)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-sm text-gray-500">Manage your courses and track student progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="h-6 w-6 text-blue-600" />} label="Total Students" value={totalStudents} color="blue" />
        <StatCard icon={<BookOpen className="h-6 w-6 text-green-600" />} label="Active Courses" value={courses.length} color="green" />
        <StatCard icon={<FileText className="h-6 w-6 text-orange-600" />} label="Pending Reviews" value={submissions.filter(s => s.status !== 'graded').length} color="orange" />
        <StatCard icon={<TrendingUp className="h-6 w-6 text-purple-600" />} label="Avg. Completion" value={`${avgCompletion}%`} color="purple" />
      </div>

      {/* Courses and Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CoursesCard courses={courses} />
        <ClassesCard classes={classes} />
      </div>

      {/* Submissions Table */}
      <SubmissionsTable submissions={submissions} />
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 bg-${color}-100 rounded-lg`}>{icon}</div>
    </div>
  </div>
);

const CoursesCard = ({ courses }: any) => (
  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="p-6 border-b border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
    </div>
    <div className="p-6 space-y-4">
      {courses.map((course: any) => (
        <div key={course.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
          <img src={course.thumbnail} className="w-16 h-16 rounded-lg object-cover" />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.students} students enrolled</p>
            <div className="mt-2 flex items-center space-x-4">
              <span className="text-sm text-gray-600">Avg. Completion:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${course.completion}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{course.completion}%</span>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Manage</button>
        </div>
      ))}
    </div>
  </div>
);

const ClassesCard = ({ classes }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="p-6 border-b border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900">Today's Classes</h2>
    </div>
    <div className="p-6 space-y-4">
      {classes.map((classItem: any) => (
        <div key={classItem.id} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{classItem.course}</h4>
            <span className="text-sm text-blue-600 font-medium">{classItem.time}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{classItem.students} students</span>
            <span>{classItem.room}</span>
          </div>
          <button className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 text-sm">
            <Video className="h-4 w-4" />
            <span>Start Class</span>
          </button>
        </div>
      ))}
    </div>
  </div>
);

const SubmissionsTable = ({ submissions }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="p-6 border-b border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {['Student', 'Assignment', 'Course', 'Submitted', 'Status', 'Actions'].map(header => (
              <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.map((s: any) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.student}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{s.assignment}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{s.course}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{s.submitted}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${s.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {s.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900">{s.status === 'graded' ? 'View' : 'Grade'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TeacherDashboard;
