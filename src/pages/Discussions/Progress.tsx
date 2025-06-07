import { Award, BookOpen, Calendar, Clock, Star, Target, TrendingUp, Trophy } from 'lucide-react';
import React, { useState } from 'react';

const Progress: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('semester');

    const overallStats = {
        totalCourses: 6,
        completedCourses: 2,
        totalHours: 124,
        averageScore: 88,
        certificates: 3,
        currentStreak: 12
    };

    const courseProgress = [
        {
            id: 1,
            title: 'Advanced Mathematics',
            teacher: 'Dr. Sarah Johnson',
            progress: 85,
            grade: 'A-',
            score: 92,
            totalLessons: 24,
            completedLessons: 20,
            timeSpent: '32h',
            lastActivity: '2 hours ago',
            thumbnail: 'https://images.pexels.com/photos/6238288/pexels-photo-6238288.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        {
            id: 2,
            title: 'Computer Science Fundamentals',
            teacher: 'Prof. Mike Chen',
            progress: 65,
            grade: 'B+',
            score: 87,
            totalLessons: 30,
            completedLessons: 19,
            timeSpent: '28h',
            lastActivity: '1 day ago',
            thumbnail: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        {
            id: 3,
            title: 'Physics Laboratory',
            teacher: 'Dr. Emily Davis',
            progress: 45,
            grade: 'B',
            score: 82,
            totalLessons: 20,
            completedLessons: 9,
            timeSpent: '18h',
            lastActivity: '3 days ago',
            thumbnail: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        {
            id: 4,
            title: 'Statistics & Probability',
            teacher: 'Prof. Alex Wilson',
            progress: 30,
            grade: 'B-',
            score: 78,
            totalLessons: 22,
            completedLessons: 7,
            timeSpent: '12h',
            lastActivity: '5 days ago',
            thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        }
    ];

    const achievements = [
        {
            id: 1,
            title: 'Perfect Attendance',
            description: 'Attended all classes for 2 weeks straight',
            icon: Calendar,
            earned: true,
            earnedDate: '2024-01-10',
            color: 'blue'
        },
        {
            id: 2,
            title: 'Quick Learner',
            description: 'Completed 5 lessons in one day',
            icon: TrendingUp,
            earned: true,
            earnedDate: '2024-01-08',
            color: 'green'
        },
        {
            id: 3,
            title: 'Top Performer',
            description: 'Scored 90+ on 3 consecutive assignments',
            icon: Trophy,
            earned: true,
            earnedDate: '2024-01-05',
            color: 'yellow'
        },
        {
            id: 4,
            title: 'Discussion Champion',
            description: 'Participated in 10 forum discussions',
            icon: Star,
            earned: false,
            progress: 7,
            total: 10,
            color: 'purple'
        },
        {
            id: 5,
            title: 'Assignment Master',
            description: 'Submit 15 assignments on time',
            icon: Target,
            earned: false,
            progress: 12,
            total: 15,
            color: 'orange'
        }
    ];

    const weeklyActivity = [
        { day: 'Mon', hours: 3.5, assignments: 2 },
        { day: 'Tue', hours: 4.2, assignments: 1 },
        { day: 'Wed', hours: 2.8, assignments: 3 },
        { day: 'Thu', hours: 5.1, assignments: 1 },
        { day: 'Fri', hours: 3.9, assignments: 2 },
        { day: 'Sat', hours: 2.3, assignments: 0 },
        { day: 'Sun', hours: 1.8, assignments: 1 }
    ];

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
        if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
        if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
        return 'text-gray-600 bg-gray-100';
    };

    const getAchievementColor = (color: string) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setSelectedPeriod('week')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedPeriod === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                            }`}
                    >
                        This Week
                    </button>
                    <button
                        onClick={() => setSelectedPeriod('month')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedPeriod === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                            }`}
                    >
                        This Month
                    </button>
                    <button
                        onClick={() => setSelectedPeriod('semester')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedPeriod === 'semester' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                            }`}
                    >
                        Semester
                    </button>
                </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Courses</p>
                            <p className="text-2xl font-bold text-gray-900">{overallStats.completedCourses}/{overallStats.totalCourses}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Study Hours</p>
                            <p className="text-2xl font-bold text-gray-900">{overallStats.totalHours}h</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Clock className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Score</p>
                            <p className="text-2xl font-bold text-gray-900">{overallStats.averageScore}%</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Certificates</p>
                            <p className="text-2xl font-bold text-gray-900">{overallStats.certificates}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Award className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Streak</p>
                            <p className="text-2xl font-bold text-gray-900">{overallStats.currentStreak}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Target className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Rank</p>
                            <p className="text-2xl font-bold text-gray-900">#12</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                            <Trophy className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course Progress */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900">Course Progress</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {courseProgress.map((course) => (
                            <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center space-x-4 mb-4">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                                        <p className="text-sm text-gray-600">{course.teacher}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.grade)}`}>
                                            {course.grade}
                                        </span>
                                        <p className="text-sm text-gray-500 mt-1">{course.score}%</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Progress</span>
                                        <span className="font-medium">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Lessons</span>
                                            <p className="font-medium">{course.completedLessons}/{course.totalLessons}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Time Spent</span>
                                            <p className="font-medium">{course.timeSpent}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Last Activity</span>
                                            <p className="font-medium">{course.lastActivity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Weekly Activity */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
                        <div className="space-y-3">
                            {weeklyActivity.map((day) => (
                                <div key={day.day} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 w-8">{day.day}</span>
                                    <div className="flex-1 mx-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${(day.hours / 6) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-8 text-right">{day.hours}h</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">This Week</span>
                                <span className="text-sm font-medium text-green-600">+5.2%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">This Month</span>
                                <span className="text-sm font-medium text-green-600">+12.8%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Semester</span>
                                <span className="text-sm font-medium text-blue-600">+18.5%</span>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Great progress!</span>
                            </div>
                            <p className="text-xs text-blue-700 mt-1">
                                You're performing 18% better than last semester
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map((achievement) => (
                            <div key={achievement.id} className={`p-4 rounded-lg border-2 ${achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                                }`}>
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className={`p-2 rounded-lg ${getAchievementColor(achievement.color)}`}>
                                        <achievement.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                                        {achievement.earned ? (
                                            <span className="text-xs text-green-600">Earned {achievement.earnedDate}</span>
                                        ) : (
                                            <span className="text-xs text-gray-500">
                                                {achievement.progress}/{achievement.total} completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                                {!achievement.earned && achievement.progress && achievement.total && (
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Progress;