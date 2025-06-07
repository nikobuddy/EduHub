import { Calendar, CheckCircle, Clock, Download, FileText, Filter, Plus, Search, Upload } from 'lucide-react';
import React, { useState } from 'react';

const Assignments: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'pending' | 'submitted' | 'graded'>('pending');
    const [searchTerm, setSearchTerm] = useState('');

    const assignments = [
        {
            id: 1,
            title: 'Calculus Problem Set 5',
            course: 'Advanced Mathematics',
            teacher: 'Dr. Sarah Johnson',
            description: 'Solve integration problems using substitution and integration by parts methods.',
            dueDate: '2024-01-18',
            dueTime: '11:59 PM',
            maxScore: 100,
            submittedAt: null,
            score: null,
            feedback: null,
            status: 'pending',
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
            dueDate: '2024-01-20',
            dueTime: '11:59 PM',
            maxScore: 150,
            submittedAt: '2024-01-19 10:30 AM',
            score: 142,
            feedback: 'Excellent implementation! Minor optimization suggestions provided in comments.',
            status: 'graded',
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
            dueDate: '2024-01-22',
            dueTime: '11:59 PM',
            maxScore: 80,
            submittedAt: '2024-01-21 08:15 PM',
            score: null,
            feedback: null,
            status: 'submitted',
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
            dueDate: '2024-01-25',
            dueTime: '11:59 PM',
            maxScore: 120,
            submittedAt: null,
            score: null,
            feedback: null,
            status: 'pending',
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
            dueDate: '2024-01-16',
            dueTime: '11:59 PM',
            maxScore: 50,
            submittedAt: '2024-01-15 09:45 PM',
            score: 47,
            feedback: 'Good work overall. Review integration techniques for better accuracy.',
            status: 'graded',
            priority: 'high',
            attachments: ['review_problems.pdf'],
            estimatedTime: '2 hours',
            category: 'review'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'submitted': return 'bg-blue-100 text-blue-800';
            case 'graded': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-red-300 bg-red-50';
            case 'medium': return 'border-yellow-300 bg-yellow-50';
            case 'low': return 'border-green-300 bg-green-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'homework': return <FileText className="h-4 w-4" />;
            case 'project': return <Upload className="h-4 w-4" />;
            case 'lab-report': return <FileText className="h-4 w-4" />;
            case 'review': return <CheckCircle className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    const getDaysUntilDue = (dueDate: string) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const filteredAssignments = assignments.filter(assignment => {
        const matchesTab = assignment.status === selectedTab;
        const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const pendingCount = assignments.filter(a => a.status === 'pending').length;
    const submittedCount = assignments.filter(a => a.status === 'submitted').length;
    const gradedCount = assignments.filter(a => a.status === 'graded').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>Submit Assignment</span>
                </button>
            </div>

            {/* Assignment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                            <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Submitted</p>
                            <p className="text-2xl font-bold text-blue-600">{submittedCount}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Upload className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Graded</p>
                            <p className="text-2xl font-bold text-green-600">{gradedCount}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search assignments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>All Courses</option>
                            <option>Advanced Mathematics</option>
                            <option>Computer Science Fundamentals</option>
                            <option>Physics Laboratory</option>
                            <option>Statistics & Probability</option>
                        </select>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Filter className="h-4 w-4" />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Assignment Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setSelectedTab('pending')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === 'pending'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Pending ({pendingCount})
                        </button>
                        <button
                            onClick={() => setSelectedTab('submitted')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === 'submitted'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Submitted ({submittedCount})
                        </button>
                        <button
                            onClick={() => setSelectedTab('graded')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === 'graded'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Graded ({gradedCount})
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        {filteredAssignments.map((assignment) => {
                            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                            const isOverdue = daysUntilDue < 0 && assignment.status === 'pending';
                            const isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0 && assignment.status === 'pending';

                            return (
                                <div
                                    key={assignment.id}
                                    className={`border-l-4 rounded-lg p-6 ${getPriorityColor(assignment.priority)} ${isOverdue ? 'border-red-500' : isDueSoon ? 'border-orange-500' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="p-2 bg-white rounded-lg">
                                                {getCategoryIcon(assignment.category)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                                                <p className="text-sm text-gray-600">{assignment.course} • {assignment.teacher}</p>
                                                <p className="text-sm text-gray-700 mt-2">{assignment.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                                                {assignment.status}
                                            </span>
                                            {isOverdue && (
                                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    Overdue
                                                </span>
                                            )}
                                            {isDueSoon && (
                                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    Due Soon
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>Due: {assignment.dueDate} at {assignment.dueTime}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            <span>Est. Time: {assignment.estimatedTime}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <FileText className="h-4 w-4" />
                                            <span>Max Score: {assignment.maxScore} points</span>
                                        </div>
                                        {assignment.score !== null && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>Score: {assignment.score}/{assignment.maxScore}</span>
                                            </div>
                                        )}
                                    </div>

                                    {assignment.attachments && assignment.attachments.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {assignment.attachments.map((file, index) => (
                                                    <button
                                                        key={index}
                                                        className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                                                    >
                                                        <Download className="h-3 w-3" />
                                                        <span>{file}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {assignment.feedback && (
                                        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm font-medium text-blue-900 mb-1">Teacher Feedback:</p>
                                            <p className="text-sm text-blue-800">{assignment.feedback}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            {assignment.submittedAt ? (
                                                <span>Submitted: {assignment.submittedAt}</span>
                                            ) : (
                                                <span>
                                                    {daysUntilDue > 0 ? `${daysUntilDue} days remaining` :
                                                        daysUntilDue === 0 ? 'Due today' :
                                                            `${Math.abs(daysUntilDue)} days overdue`}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            {assignment.status === 'pending' && (
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                                    Submit Assignment
                                                </button>
                                            )}
                                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assignments;