// StudentDashboard.tsx (Dynamic with Firebase)
import { collection, getDocs } from "firebase/firestore";
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Play,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase"; // Adjust the import path as necessary

interface Course {
  id: string;
  title: string;
  teacher: string;
  progress: number;
  nextClass: string;
  thumbnail: string;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: string;
}

interface ClassItem {
  id: string;
  title: string;
  time: string;
  date: string;
  room: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<ClassItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const coursesSnap = await getDocs(collection(db, "courses"));
      const assignmentsSnap = await getDocs(collection(db, "assignments"));
      const classesSnap = await getDocs(collection(db, "classes"));

      setEnrolledCourses(
        coursesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Course))
      );
      setRecentAssignments(
        assignmentsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Assignment))
      );
      setUpcomingClasses(
        classesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ClassItem))
      );
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 px-4 py-6 md:px-8 lg:px-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back! Here's your learning overview.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Enrolled Courses",
            value: enrolledCourses.length,
            icon: <BookOpen className="h-6 w-6 text-blue-600" />,
            bg: "bg-blue-100",
          },
          {
            title: "Hours Studied",
            value: 84,
            icon: <Clock className="h-6 w-6 text-green-600" />,
            bg: "bg-green-100",
          },
          {
            title: "Certificates",
            value: 3,
            icon: <Award className="h-6 w-6 text-purple-600" />,
            bg: "bg-purple-100",
          },
          {
            title: "Average Score",
            value: "88%",
            icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
            bg: "bg-orange-100",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow border flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bg}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">My Courses</h2>
          </div>
          <div className="space-y-4 px-6 py-4">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-xs text-gray-500">{course.teacher}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{course.progress}%</span>
                  </div>
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md text-white"
                  onClick={() => navigate(`/video/${course.id}`)}
                >
                  <Play className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Classes</h2>
          </div>
          <div className="p-4 space-y-4">
            {upcomingClasses.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500">
                    {item.time} • {item.date}
                  </p>
                  <p className="text-xs text-gray-400">{item.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Recent Assignments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Assignment</th>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Due Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentAssignments.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>{a.title}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{a.course}</td>
                  <td className="px-6 py-4 text-gray-700">{a.dueDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${a.status === "submitted"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline">
                      {a.status === "submitted" ? "View" : "Submit"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
