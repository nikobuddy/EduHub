import { Award, BookOpen, Calendar, Clock, LucideIcon, Star, Target, TrendingUp, Trophy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getAllUserCourses, getUserEnrolledCourses } from './firebaseService';

import { courses as allCourses } from './courseData';
import { db } from '../../firebase/firebase';
import { useAuth } from '../Auth/useAuth';

interface CourseProgress {
    id: number;
    title: string;
    teacher: string;
    progress: number;
    score: number;
    totalLessons: number;
    completedLessons: number;
    hoursStudied: number;
    lastAccessed: string;
    thumbnail: string;
    completed: boolean;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    earned: boolean;
    earnedDate?: string;
    progress?: number;
    total?: number;
    color: string;
}

interface OverallStats {
    totalCourses: number;
    completedCourses: number;
    totalHours: number;
    averageScore: number;
    certificates: number;
    currentStreak: number;
}

const Progress: React.FC = () => {
    const { user } = useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState('semester');
    const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
    const [overallStats, setOverallStats] = useState<OverallStats>({
        totalCourses: 0,
        completedCourses: 0,
        totalHours: 0,
        averageScore: 0,
        certificates: 0,
        currentStreak: 0
    });
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProgress = async () => {
            if (!user) return;

            try {
                // Get enrolled courses and their progress
                const enrolledIds = await getUserEnrolledCourses();
                const userCourses = await getAllUserCourses();

                // Map course progress
                const progress = allCourses
                    .filter(course => enrolledIds.includes(course.id))
                    .map(course => {
                        const userProgress = userCourses.find(uc => uc.courseId === course.id.toString());
                        return {
                            id: course.id,
                            title: course.title,
                            teacher: course.teacher,
                            progress: userProgress?.progress || 0,
                            score: userProgress?.score || 0,
                            totalLessons: course.totalLessons,
                            completedLessons: userProgress?.completedLessons || 0,
                            hoursStudied: userProgress?.hoursStudied || 0,
                            lastAccessed: userProgress?.lastAccessed || new Date().toISOString(),
                            thumbnail: course.thumbnail,
                            completed: userProgress?.completed || false
                        };
                    });

                setCourseProgress(progress);

                // Calculate overall stats
                const completedCourses = progress.filter(c => c.completed).length;
                const totalHours = progress.reduce((sum, c) => sum + c.hoursStudied, 0);
                const avgScore = progress.length > 0
                    ? Math.round(progress.reduce((sum, c) => sum + c.score, 0) / progress.length)
                    : 0;

                setOverallStats({
                    totalCourses: progress.length,
                    completedCourses,
                    totalHours,
                    averageScore: avgScore,
                    certificates: completedCourses,
                    currentStreak: calculateStreak(progress)
                });

                // Fetch and set achievements
                const userAchievements = await fetchUserAchievements(user.uid);
                setAchievements(userAchievements);

            } catch (error) {
                console.error("Error fetching user progress:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProgress();
    }, [user]);

    const calculateStreak = (courses: CourseProgress[]): number => {
        // Simple streak calculation based on last accessed dates
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        return courses.filter(course => {
            const lastAccessed = new Date(course.lastAccessed);
            return lastAccessed >= lastWeek;
        }).length;
    };

    const fetchUserAchievements = async (userId: string): Promise<Achievement[]> => {
        try {
            const achievementsRef = collection(db, `users/${userId}/achievements`);
            const achievementsSnap = await getDocs(achievementsRef);
            
            if (achievementsSnap.empty) {
                // Initialize default achievements if none exist
                return [
                    {
                        id: '1',
                        title: 'Perfect Attendance',
                        description: 'Attended all classes for 2 weeks straight',
                        icon: Calendar,
                        earned: false,
                        progress: 0,
                        total: 14,
                        color: 'blue'
                    },
                    {
                        id: '2',
                        title: 'Quick Learner',
                        description: 'Completed 5 lessons in one day',
                        icon: TrendingUp,
                        earned: false,
                        progress: 0,
                        total: 5,
                        color: 'green'
                    },
                    {
                        id: '3',
                        title: 'Top Performer',
                        description: 'Scored 90+ on 3 consecutive assignments',
                        icon: Trophy,
                        earned: false,
                        progress: 0,
                        total: 3,
                        color: 'yellow'
                    },
                    {
                        id: '4',
                        title: 'Discussion Champion',
                        description: 'Participated in 10 forum discussions',
                        icon: Star,
                        earned: false,
                        progress: 0,
                        total: 10,
                        color: 'purple'
                    },
                    {
                        id: '5',
                        title: 'Assignment Master',
                        description: 'Submit 15 assignments on time',
                        icon: Target,
                        earned: false,
                        progress: 0,
                        total: 15,
                        color: 'orange'
                    }
                ];
            }

            return achievementsSnap.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title || '',
                    description: data.description || '',
                    icon: getIconByName(data.iconName || 'Award'),
                    earned: data.earned || false,
                    earnedDate: data.earnedDate,
                    progress: data.progress,
                    total: data.total,
                    color: data.color || 'blue'
                } as Achievement;
            });
        } catch (error) {
            console.error("Error fetching achievements:", error);
            return [];
        }
    };

    const getIconByName = (name: string): LucideIcon => {
        const icons: Record<string, LucideIcon> = {
            Award,
            BookOpen,
            Calendar,
            Clock,
            Star,
            Target,
            TrendingUp,
            Trophy
        };
        return icons[name] || Award;
    };

    const getGradeColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-100';
        if (score >= 80) return 'text-blue-600 bg-blue-100';
        if (score >= 70) return 'text-yellow-600 bg-yellow-100';
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

    if (loading) {
        return <div className="text-center py-10 text-gray-600">Loading progress...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setSelectedPeriod('week')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedPeriod === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                    >
                        This Week
                    </button>
                    <button
                        onClick={() => setSelectedPeriod('month')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedPeriod === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                    >
                        This Month
                    </button>
                    <button
                        onClick={() => setSelectedPeriod('semester')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedPeriod === 'semester' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
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
                            <p className="text-2xl font-bold text-gray-900">#{calculateRank()}</p>
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
                        {courseProgress.length > 0 ? (
                            courseProgress.map((course) => (
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
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.score)}`}>
                                                {getGradeLetter(course.score)}
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
                                                <p className="font-medium">{course.hoursStudied}h</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Last Activity</span>
                                                <p className="font-medium">{formatLastAccessed(course.lastAccessed)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No courses enrolled yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {achievements.map((achievement) => (
                                <div key={achievement.id} className={`p-4 rounded-lg border-2 ${achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
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
        </div>
    );
};

// Helper functions
const getGradeLetter = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
};

const formatLastAccessed = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    } else if (diffInHours < 48) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString();
    }
};

const calculateRank = (): number => {
    // This is a placeholder for actual rank calculation
    // In a real application, you would compare the user's stats with other users
    return Math.floor(Math.random() * 50) + 1;
};

export default Progress;