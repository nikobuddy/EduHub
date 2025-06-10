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
import {
  collection,
  doc,
  getDocs,
  setDoc
} from "firebase/firestore";
import { getAllUserCourses, getUserEnrolledCourses } from "../Discussions/firebaseService";

import { courses as allCourses } from "../Discussions/courseData";
import { db } from "../../firebase/firebase";
import { useAuth } from "../Auth/useAuth";
import { useNavigate } from "react-router-dom";

interface Course {
  id: number;
  title: string;
  description: string;
  teacher: string;
  category: string;
  level: string;
  duration: string;
  totalLessons: number;
  completedLessons: number;
  students: number;
  rating: number;
  progress: number;
  thumbnail: string;
  isEnrolled: boolean;
  nextLesson: string;
  lastAccessed: string | null;
  videoUrl: string;
  hoursStudied: number;
  completed: boolean;
  score: number;
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

interface Submission {
  driveLink: string;
  submittedAt: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<ClassItem[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({});
  const [showInputFor, setShowInputFor] = useState<string | null>(null);
  const [driveLinkInput, setDriveLinkInput] = useState("");

  // Stats
  const [totalHours, setTotalHours] = useState(0);
  const [certCount, setCertCount] = useState(0);
  const [averageScore, setAverageScore] = useState("0%");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Get enrolled course IDs and their progress
        const enrolledIds = await getUserEnrolledCourses();
        const userCourses = await getAllUserCourses();
        
        // Filter and map enrolled courses with user progress
        const enrolled = allCourses
          .filter(course => enrolledIds.includes(course.id))
          .map(course => {
            const userProgress = userCourses.find(uc => uc.courseId === course.id.toString());
            return {
              ...course,
              isEnrolled: true,
              progress: userProgress?.progress || 0,
              completedLessons: userProgress?.completedLessons || 0,
              hoursStudied: userProgress?.hoursStudied || 0,
              completed: userProgress?.completed || false,
              score: userProgress?.score || 0,
              lastAccessed: userProgress?.lastAccessed || null
            };
          });

        setEnrolledCourses(enrolled);

        // Calculate stats
        const totalHours = enrolled.reduce((sum, c) => sum + (c.hoursStudied || 0), 0);
        const certCount = enrolled.filter(c => c.completed).length;
        const avgScore =
          enrolled.length > 0
            ? (enrolled.reduce((sum, c) => sum + (c.score || 0), 0) / enrolled.length).toFixed(1) + "%"
            : "0%";

        setTotalHours(totalHours);
        setCertCount(certCount);
        setAverageScore(avgScore);

        // Fetch assignments and classes
        const assignmentsSnap = await getDocs(collection(db, "assignments"));
        setRecentAssignments(assignmentsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Assignment)));

        const classesSnap = await getDocs(collection(db, "classes"));
        setUpcomingClasses(classesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ClassItem)));

        const userSubmissionsSnap = await getDocs(collection(db, `submissions/${user.uid}/assignments`));
        const subs: Record<string, Submission> = {};
        userSubmissionsSnap.forEach((doc) => {
          subs[doc.id] = doc.data() as Submission;
        });
        setSubmissions(subs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);
  
  const handleSubmitDriveLink = async (assignmentId: string) => {
    if (!user || !driveLinkInput.trim()) return;

    const submissionRef = doc(db, `submissions/${user.uid}/assignments`, assignmentId);
    const submissionData = {
      driveLink: driveLinkInput.trim(),
      submittedAt: new Date().toISOString(),
    };
    await setDoc(submissionRef, submissionData);

    setSubmissions((prev) => ({
      ...prev,
      [assignmentId]: submissionData,
    }));
    setShowInputFor(null);
    setDriveLinkInput("");
  };

  return (
    <div className="space-y-8 px-4 py-6 md:px-8 lg:px-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back! Here's your learning overview.</p>
      </div>

      {/* Stats */}
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
            value: totalHours,
            icon: <Clock className="h-6 w-6 text-green-600" />,
            bg: "bg-green-100",
          },
          {
            title: "Certificates",
            value: certCount,
            icon: <Award className="h-6 w-6 text-purple-600" />,
            bg: "bg-purple-100",
          },
          {
            title: "Average Score",
            value: averageScore,
            icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
            bg: "bg-orange-100",
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow border flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bg}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Courses and Classes */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">My Courses</h2>
          </div>
          <div className="space-y-4 px-6 py-4">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
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
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't enrolled in any courses yet.</p>
                <button
                  onClick={() => navigate('/courses')}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Classes</h2>
          </div>
          <div className="p-4 space-y-4">
            {upcomingClasses.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.time} • {item.date}</p>
                  <p className="text-xs text-gray-400">{item.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
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
              {recentAssignments.map((a) => {
                const submitted = submissions[a.id];
                return (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span>{a.title}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{a.course}</td>
                    <td className="px-6 py-4 text-gray-700">{a.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${submitted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}>
                        {submitted ? "submitted" : "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {submitted ? (
                        <a href={submitted.driveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View
                        </a>
                      ) : showInputFor === a.id ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            className="border px-2 py-1 rounded text-xs w-48"
                            placeholder="Paste Google Drive Link"
                            value={driveLinkInput}
                            onChange={(e) => setDriveLinkInput(e.target.value)}
                          />
                          <button
                            onClick={() => handleSubmitDriveLink(a.id)}
                            className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                          >
                            Submit
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowInputFor(a.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Submit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
