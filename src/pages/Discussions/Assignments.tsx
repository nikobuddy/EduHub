import {
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Search,
    Upload
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Timestamp, addDoc, collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '../../firebase/firebase';
import { useAuth } from '../Auth/useAuth';

interface Assignment {
    id: number;
    title: string;
    course: string;
    teacher: string;
    description: string;
    dueDate: string;
    dueTime: string;
    maxScore: number;
    submittedAt: string | null;
    score: number | null;
    feedback: string | null;
    status: 'pending' | 'submitted' | 'graded';
    priority: 'high' | 'medium' | 'low';
    attachments: string[];
    estimatedTime: string;
    category: string;
    link?: string;
}

const staticAssignments: Omit<Assignment, 'submittedAt' | 'score' | 'feedback' | 'status'>[] = [
    /* keep your 5 items here exactly as before */
    // example:
    {
        id: 1,
        title: 'Calculus Problem Set 5',
        course: 'Advanced Mathematics',
        teacher: 'Dr. Sarah Johnson',
        description: 'Solve integration problems …',
        dueDate: '2025-01-18',
        dueTime: '11:59 PM',
        maxScore: 100,
        priority: 'high',
        attachments: ['problem_set_5.pdf'],
        estimatedTime: '3-4 hours',
        category: 'homework'
    },
    {
        id: 2,
        title: 'Programming Assignment 3: Binary Trees',
        course: 'Computer Science Fundamentals',
        teacher: 'Prof. Mike Chen',
        description: 'Implement binary search tree operations including insertion, deletion, and traversal.',
        dueDate: '2025-01-20',
        dueTime: '11:59 PM',
        maxScore: 150,
        priority: 'medium',
        attachments: ['binary_tree_template.py', 'test_cases.txt'],
        estimatedTime: '5-6 hours',
        category: 'project'
    },
    {
        id: 3,
        title: 'Lab Report: Wave Interference',
        course: 'Physics Laboratory',
        teacher: 'Dr. Emily Davis',
        description: 'Analyze experimental data from the wave interference lab and write a comprehensive report.',
        dueDate: '2025-01-22',
        dueTime: '11:59 PM',
        maxScore: 80,
        priority: 'medium',
        attachments: ['lab_data.xlsx', 'report_template.docx'],
        estimatedTime: '2-3 hours',
        category: 'lab-report'
    },
    {
        id: 4,
        title: 'Statistics Project: Data Analysis',
        course: 'Statistics & Probability',
        teacher: 'Prof. Alex Wilson',
        description: 'Perform statistical analysis on the provided dataset and present findings.',
        dueDate: '2025-01-25',
        dueTime: '11:59 PM',
        maxScore: 120,
        priority: 'low',
        attachments: ['dataset.csv', 'analysis_guidelines.pdf'],
        estimatedTime: '4-5 hours',
        category: 'project'
    },
    {
        id: 5,
        title: 'Midterm Exam Review',
        course: 'Advanced Mathematics',
        teacher: 'Dr. Sarah Johnson',
        description: 'Complete practice problems covering all topics from chapters 1-8.',
        dueDate: '2025-01-16',
        dueTime: '11:59 PM',
        maxScore: 50,
        priority: 'high',
        attachments: ['review_problems.pdf'],
        estimatedTime: '2 hours',
        category: 'review'
    }
    // ...your other 4 items...
];

const Assignments: React.FC = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedTab, setSelectedTab] = useState<'pending' | 'submitted' | 'graded'>('submitted');
    const [searchTerm, setSearchTerm] = useState('');

    const getPriorityColor = (priority: Assignment['priority']) => {
        switch (priority) {
            case 'high':
                return 'border-red-500 bg-red-50';
            case 'medium':
                return 'border-yellow-500 bg-yellow-50';
            case 'low':
                return 'border-green-500 bg-green-50';
            default:
                return 'border-gray-200 bg-white';
        }
    };

    // ✅ Fetch submissions + merge
    useEffect(() => {
        const fetch = async () => {
            if (!user) return;
            const snap = await getDocs(
                query(collection(db, 'submissions'), where('userId', '==', user.uid))
            );
            const subs = snap.docs.map(d => d.data()) as {
                assignmentId: string;
                submittedAt: string;
                link: string;
                score?: number;
                feedback?: string;
            }[];

            const merged = staticAssignments.map(sa => {
                const s = subs.find(o => o.assignmentId === `${sa.id}`);
                return {
                    ...sa,
                    submittedAt: s ? new Date(s.submittedAt).toLocaleString() : null,
                    score: s?.score ?? null,
                    feedback: s?.feedback ?? null,
                    status: (s ? (s.score != null ? 'graded' : 'submitted') : 'pending') as 'pending' | 'submitted' | 'graded',
                    link: s?.link
                };
            });


            setAssignments(merged);
        };
        fetch();
    }, [user]);

    // ✅ Submit flow
    const handleSubmit = async (id: number) => {
        const link = prompt('Enter your Google Drive submission link:');
        if (!link || !user) return;
        await addDoc(collection(db, 'submissions'), {
            userId: user.uid,
            assignmentId: `${id}`,
            link,
            submittedAt: Timestamp.now().toDate().toISOString()
        });
        window.location.reload();
    };

    // ✅ Color helpers
    const getStatusColor = (s: Assignment['status']) => ({
        pending: 'bg-yellow-100 text-yellow-800',
        submitted: 'bg-blue-100 text-blue-800',
        graded: 'bg-green-100 text-green-800'
    })[s];

    const getDaysUntil = (due: string) => {
        const n = new Date();
        const d = new Date(due);
        return Math.ceil((d.getTime() - n.getTime()) / (1000 * 60 * 60 * 24));
    };

    const filtered = assignments.filter(a =>
        a.status === selectedTab &&
        (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.course.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const counts = {
        pending: assignments.filter(a => a.status === 'pending').length,
        submitted: assignments.filter(a => a.status === 'submitted').length,
        graded: assignments.filter(a => a.status === 'graded').length
    };

    return (
        <div className="space-y-6 p-6">
            {/* Search and Tabs */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedTab('pending')}
                        className={`px-4 py-2 rounded-lg ${selectedTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                        Pending ({counts.pending})
                    </button>
                    <button
                        onClick={() => setSelectedTab('submitted')}
                        className={`px-4 py-2 rounded-lg ${selectedTab === 'submitted' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                        Submitted ({counts.submitted})
                    </button>
                    <button
                        onClick={() => setSelectedTab('graded')}
                        className={`px-4 py-2 rounded-lg ${selectedTab === 'graded' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                        Graded ({counts.graded})
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total" value={assignments.length} icon={<FileText />} color="blue" />
                <StatCard title="Pending" value={counts.pending} icon={<Clock />} color="yellow" />
                <StatCard title="Submitted" value={counts.submitted} icon={<Upload />} color="blue" />
                <StatCard title="Graded" value={counts.graded} icon={<CheckCircle />} color="green" />
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((assignment) => {
                    const days = getDaysUntil(assignment.dueDate);
                    const isOverdue = days < 0 && assignment.status === 'pending';
                    return (
                        <div
                            key={assignment.id}
                            className={`p-4 border rounded-xl shadow-sm ${getPriorityColor(assignment.priority)} ${isOverdue ? 'border-red-500' : ''}`}
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="font-semibold text-lg">{assignment.title}</h2>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(assignment.status)}`}>
                                    {assignment.status}
                                </span>
                            </div>
                            {isOverdue && (
                                <div className="mt-2 text-sm text-red-600 font-medium">
                                    Overdue by {Math.abs(days)} days
                                </div>
                            )}
                            <p className="text-sm text-gray-600 mt-2">{assignment.description}</p>
                            <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Due: {assignment.dueDate} at {assignment.dueTime}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Course: {assignment.course}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Teacher: {assignment.teacher}
                            </div>
                            {assignment.status === 'pending' && (
                                <button
                                    onClick={() => handleSubmit(assignment.id)}
                                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    Submit Assignment
                                </button>
                            )}
                            {assignment.status !== 'pending' && assignment.link && (
                                <a
                                    href={assignment.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-block text-blue-600 hover:underline text-sm"
                                >
                                    View Submission
                                </a>
                            )}
                            {assignment.status === 'graded' && (
                                <div className="mt-2">
                                    <p className="text-sm font-medium">Score: {assignment.score}/{assignment.maxScore}</p>
                                    {assignment.feedback && (
                                        <p className="text-sm text-gray-600 mt-1">Feedback: {assignment.feedback}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: 'blue' | 'green' | 'yellow' }) => {
    const bg = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600'
    }[color];
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-600">{title}</p><p className="text-2xl font-bold">{value}</p></div>
                <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>
            </div>
        </div>
    );
};

export default Assignments;
