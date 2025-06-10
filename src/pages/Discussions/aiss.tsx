// import { collection, getDocs, query, where } from 'firebase/firestore';
// import {
//     Calendar,
//     CheckCircle,
//     Clock,
//     Download,
//     FileText,
//     Filter,
//     Plus,
//     Search,
//     Upload
// } from 'lucide-react';
// import React, { useEffect, useState } from 'react';
// import { db } from '../../firebase/firebase';
// import { useAuth } from '../Auth/useAuth'; // update path as needed

// const assignments = [
//     {
//         id: 1,
//         title: 'Calculus Problem Set 5',
//         course: 'Advanced Mathematics',
//         teacher: 'Dr. Sarah Johnson',
//         description: 'Solve integration problems using substitution and integration by parts methods.',
//         dueDate: '2025-01-18',
//         dueTime: '11:59 PM',
//         maxScore: 100,
//         submittedAt: null,
//         score: null,
//         feedback: null,
//         status: 'pending',
//         priority: 'high',
//         attachments: ['problem_set_5.pdf'],
//         estimatedTime: '3-4 hours',
//         category: 'homework'
//     },
//     {
//         id: 2,
//         title: 'Programming Assignment 3: Binary Trees',
//         course: 'Computer Science Fundamentals',
//         teacher: 'Prof. Mike Chen',
//         description: 'Implement binary search tree operations including insertion, deletion, and traversal.',
//         dueDate: '2025-01-20',
//         dueTime: '11:59 PM',
//         maxScore: 150,
//         submittedAt: '2025-01-19 10:30 AM',
//         score: 142,
//         feedback: 'Excellent implementation! Minor optimization suggestions provided in comments.',
//         status: 'graded',
//         priority: 'medium',
//         attachments: ['binary_tree_template.py', 'test_cases.txt'],
//         estimatedTime: '5-6 hours',
//         category: 'project'
//     },
//     {
//         id: 3,
//         title: 'Lab Report: Wave Interference',
//         course: 'Physics Laboratory',
//         teacher: 'Dr. Emily Davis',
//         description: 'Analyze experimental data from the wave interference lab and write a comprehensive report.',
//         dueDate: '2025-01-22',
//         dueTime: '11:59 PM',
//         maxScore: 80,
//         submittedAt: '2025-01-21 08:15 PM',
//         score: null,
//         feedback: null,
//         status: 'submitted',
//         priority: 'medium',
//         attachments: ['lab_data.xlsx', 'report_template.docx'],
//         estimatedTime: '2-3 hours',
//         category: 'lab-report'
//     },
//     {
//         id: 4,
//         title: 'Statistics Project: Data Analysis',
//         course: 'Statistics & Probability',
//         teacher: 'Prof. Alex Wilson',
//         description: 'Perform statistical analysis on the provided dataset and present findings.',
//         dueDate: '2025-01-25',
//         dueTime: '11:59 PM',
//         maxScore: 120,
//         submittedAt: null,
//         score: null,
//         feedback: null,
//         status: 'pending',
//         priority: 'low',
//         attachments: ['dataset.csv', 'analysis_guidelines.pdf'],
//         estimatedTime: '4-5 hours',
//         category: 'project'
//     },
//     {
//         id: 5,
//         title: 'Midterm Exam Review',
//         course: 'Advanced Mathematics',
//         teacher: 'Dr. Sarah Johnson',
//         description: 'Complete practice problems covering all topics from chapters 1-8.',
//         dueDate: '2025-01-16',
//         dueTime: '11:59 PM',
//         maxScore: 50,
//         submittedAt: '2025-01-15 09:45 PM',
//         score: 47,
//         feedback: 'Good work overall. Review integration techniques for better accuracy.',
//         status: 'graded',
//         priority: 'high',
//         attachments: ['review_problems.pdf'],
//         estimatedTime: '2 hours',
//         category: 'review'
//     }
// ];

// const Assignments: React.FC = () => {
//     const { user } = useAuth();
//     const [assignments, setAssignments] = useState<Assignment[]>([]);
//     const [selectedTab, setSelectedTab] = useState<'pending' | 'submitted' | 'graded'>('pending');
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         const fetchAssignments = async () => {
//             if (!user) return;

//             const q = query(collection(db, 'assignments'), where('uid', '==', user.uid));
//             const snapshot = await getDocs(q);
//             const fetchedAssignments = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             })) as Assignment[];

//             setAssignments(fetchedAssignments);
//         };

//         fetchAssignments();
//     }, [user]);

//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case 'pending': return 'bg-yellow-100 text-yellow-800';
//             case 'submitted': return 'bg-blue-100 text-blue-800';
//             case 'graded': return 'bg-green-100 text-green-800';
//             default: return 'bg-gray-100 text-gray-800';
//         }
//     };

//     const getPriorityColor = (priority: string) => {
//         switch (priority) {
//             case 'high': return 'border-red-300 bg-red-50';
//             case 'medium': return 'border-yellow-300 bg-yellow-50';
//             case 'low': return 'border-green-300 bg-green-50';
//             default: return 'border-gray-300 bg-gray-50';
//         }
//     };

//     const getCategoryIcon = (category: string) => {
//         switch (category) {
//             case 'homework': return <FileText className="h-4 w-4" />;
//             case 'project': return <Upload className="h-4 w-4" />;
//             case 'lab-report': return <FileText className="h-4 w-4" />;
//             case 'review': return <CheckCircle className="h-4 w-4" />;
//             default: return <FileText className="h-4 w-4" />;
//         }
//     };

//     const getDaysUntilDue = (dueDate: string) => {
//         const due = new Date(dueDate);
//         const now = new Date();
//         const diffTime = due.getTime() - now.getTime();
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         return diffDays;
//     };

//     const filteredAssignments = assignments.filter(assignment => {
//         const matchesTab = assignment.status === selectedTab;
//         const matchesSearch =
//             assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
//         return matchesTab && matchesSearch;
//     });

//     const pendingCount = assignments.filter(a => a.status === 'pending').length;
//     const submittedCount = assignments.filter(a => a.status === 'submitted').length;
//     const gradedCount = assignments.filter(a => a.status === 'graded').length;

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
//                 <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//                     <Plus className="h-4 w-4" />
//                     <span>Submit Assignment</span>
//                 </button>
//             </div>

//             {/* Assignment Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <StatCard title="Total Assignments" value={assignments.length} icon={<FileText />} color="blue" />
//                 <StatCard title="Pending" value={pendingCount} icon={<Clock />} color="yellow" />
//                 <StatCard title="Submitted" value={submittedCount} icon={<Upload />} color="blue" />
//                 <StatCard title="Graded" value={gradedCount} icon={<CheckCircle />} color="green" />
//             </div>

//             {/* Search and Filters */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
//                     <div className="flex-1 max-w-md">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                             <input
//                                 type="text"
//                                 placeholder="Search assignments..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <select className="px-4 py-2 border border-gray-300 rounded-lg">
//                             <option>All Courses</option>
//                             {[...new Set(assignments.map(a => a.course))].map(course => (
//                                 <option key={course}>{course}</option>
//                             ))}
//                         </select>
//                         <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//                             <Filter className="h-4 w-4" />
//                             <span>Filter</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Tabs */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//                 <nav className="flex space-x-8 px-6 border-b border-gray-200">
//                     {(['pending', 'submitted', 'graded'] as const).map(tab => (
//                         <button
//                             key={tab}
//                             onClick={() => setSelectedTab(tab)}
//                             className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === tab
//                                 ? 'border-blue-500 text-blue-600'
//                                 : 'border-transparent text-gray-500 hover:text-gray-700'}`}
//                         >
//                             {tab.charAt(0).toUpperCase() + tab.slice(1)} ({assignments.filter(a => a.status === tab).length})
//                         </button>
//                     ))}
//                 </nav>
//                 <div className="p-6">
//                     {filteredAssignments.length > 0 ? (
//                         filteredAssignments.map(assignment => {
//                             const daysUntilDue = getDaysUntilDue(assignment.dueDate);
//                             const isOverdue = daysUntilDue < 0 && assignment.status === 'pending';
//                             const isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0 && assignment.status === 'pending';

//                             return (
//                                 <div
//                                     key={assignment.id}
//                                     className={`border-l-4 rounded-lg p-6 mb-4 ${getPriorityColor(assignment.priority)} ${isOverdue ? 'border-red-500' : isDueSoon ? 'border-orange-500' : ''}`}
//                                 >
//                                     {/* Top section */}
//                                     <div className="flex justify-between items-start mb-4">
//                                         <div className="flex items-start space-x-3">
//                                             <div className="p-2 bg-white rounded-lg">{getCategoryIcon(assignment.category)}</div>
//                                             <div>
//                                                 <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
//                                                 <p className="text-sm text-gray-600">{assignment.course} • {assignment.teacher}</p>
//                                                 <p className="text-sm text-gray-700 mt-2">{assignment.description}</p>
//                                             </div>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
//                                                 {assignment.status}
//                                             </span>
//                                             {isOverdue && <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Overdue</span>}
//                                             {isDueSoon && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">Due Soon</span>}
//                                         </div>
//                                     </div>

//                                     {/* Metadata */}
//                                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
//                                         <div className="flex items-center space-x-2"><Calendar className="h-4 w-4" /><span>Due: {assignment.dueDate} at {assignment.dueTime}</span></div>
//                                         <div className="flex items-center space-x-2"><Clock className="h-4 w-4" /><span>Est. Time: {assignment.estimatedTime}</span></div>
//                                         <div className="flex items-center space-x-2"><FileText className="h-4 w-4" /><span>Max Score: {assignment.maxScore} points</span></div>
//                                         {assignment.score !== null && (
//                                             <div className="flex items-center space-x-2"><CheckCircle className="h-4 w-4" /><span>Score: {assignment.score}/{assignment.maxScore}</span></div>
//                                         )}
//                                     </div>

//                                     {/* Attachments */}
//                                     {assignment.attachments?.length > 0 && (
//                                         <div className="mb-4">
//                                             <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
//                                             <div className="flex flex-wrap gap-2">
//                                                 {assignment.attachments.map((file, i) => (
//                                                     <button key={i} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">
//                                                         <Download className="h-3 w-3" /><span>{file}</span>
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* Feedback */}
//                                     {assignment.feedback && (
//                                         <div className="mb-4 p-4 bg-blue-50 rounded-lg">
//                                             <p className="text-sm font-medium text-blue-900 mb-1">Teacher Feedback:</p>
//                                             <p className="text-sm text-blue-800">{assignment.feedback}</p>
//                                         </div>
//                                     )}

//                                     {/* Bottom bar */}
//                                     <div className="flex items-center justify-between text-sm text-gray-500">
//                                         <span>
//                                             {assignment.submittedAt ? (
//                                                 <>Submitted: {assignment.submittedAt}</>
//                                             ) : daysUntilDue === 0 ? 'Due today' : daysUntilDue > 0 ? `${daysUntilDue} days remaining` : `${Math.abs(daysUntilDue)} days overdue`}
//                                         </span>
//                                         <div className="flex space-x-2">
//                                             {assignment.status === 'pending' && (
//                                                 <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Submit Assignment</button>
//                                             )}
//                                             <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">View Details</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })
//                     ) : (
//                         <p className="text-center text-gray-500">No assignments found for this tab.</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Reusable Stat Card component
// const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
//     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between">
//             <div>
//                 <p className="text-sm font-medium text-gray-600">{title}</p>
//                 <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
//             </div>
//             <div className={`p-3 bg-${color}-100 rounded-lg`}>
//                 {icon}
//             </div>
//         </div>
//     </div>
// );

// export default Assignments;
