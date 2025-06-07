import { BookOpen, Clock, Download, FileText, Filter, Grid, List, Play, Search, Star, Users, Video } from 'lucide-react';
import React, { useState } from 'react';

const Courses: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { id: 'all', name: 'All Courses', count: 12 },
        { id: 'mathematics', name: 'Mathematics', count: 4 },
        { id: 'computer-science', name: 'Computer Science', count: 3 },
        { id: 'physics', name: 'Physics', count: 2 },
        { id: 'chemistry', name: 'Chemistry', count: 2 },
        { id: 'biology', name: 'Biology', count: 1 }
    ];

    const courses = [
        {
            id: 1,
            title: 'Advanced Mathematics',
            description: 'Master calculus, linear algebra, and advanced mathematical concepts with practical applications.',
            teacher: 'Dr. Sarah Johnson',
            category: 'mathematics',
            level: 'Advanced',
            duration: '16 weeks',
            totalLessons: 24,
            completedLessons: 20,
            students: 45,
            rating: 4.8,
            progress: 85,
            thumbnail: 'https://images.pexels.com/photos/6238288/pexels-photo-6238288.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
            isEnrolled: true,
            nextLesson: 'Integration by Parts',
            lastAccessed: '2 hours ago'
        },
        {
            id: 2,
            title: 'Computer Science Fundamentals',
            description: 'Learn programming basics, data structures, algorithms, and software development principles.',
            teacher: 'Prof. Mike Chen',
            category: 'computer-science',
            level: 'Intermediate',
            duration: '20 weeks',
            totalLessons: 30,
            completedLessons: 19,
            students: 32,
            rating: 4.9,
            progress: 65,
            thumbnail: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
            isEnrolled: true,
            nextLesson: 'Binary Search Trees',
            lastAccessed: '1 day ago'
        },
        {
            id: 3,
            title: 'Physics Laboratory',
            description: 'Hands-on experiments covering mechanics, thermodynamics, and electromagnetic phenomena.',
            teacher: 'Dr. Emily Davis',
            category: 'physics',
            level: 'Intermediate',
            duration: '12 weeks',
            totalLessons: 20,
            completedLessons: 9,
            students: 28,
            rating: 4.7,
            progress: 45,
            thumbnail: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
            isEnrolled: true,
            nextLesson: 'Wave Interference',
            lastAccessed: '3 days ago'
        },
        {
            id: 4,
            title: 'Statistics & Probability',
            description: 'Statistical analysis, probability theory, and data interpretation for real-world applications.',
            teacher: 'Prof. Alex Wilson',
            category: 'mathematics',
            level: 'Intermediate',
            duration: '14 weeks',
            totalLessons: 22,
            completedLessons: 7,
            students: 35,
            rating: 4.6,
            progress: 30,
            thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
            isEnrolled: true,
            nextLesson: 'Normal Distribution',
            lastAccessed: '5 days ago'
        },
        {
            id: 5,
            title: 'Organic Chemistry',
            description: 'Explore molecular structures, reactions, and mechanisms in organic chemistry.',
            teacher: 'Dr. Lisa Brown',
            category: 'chemistry',
            level: 'Advanced',
            duration: '18 weeks',
            totalLessons: 26,
            completedLessons: 0,
            students: 22,
            rating: 4.5,
            progress: 0,
            thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
            isEnrolled: false,
            nextLesson: 'Introduction to Organic Compounds',
            lastAccessed: null
        },
        {
            id: 6,
            title: 'Web Development Bootcamp',
            description: 'Full-stack web development with HTML, CSS, JavaScript, React, and Node.js.',
            teacher: 'Prof. David Kim',
            category: 'computer-science',
            level: 'Beginner',
            duration: '24 weeks',
            totalLessons: 40,
            completedLessons: 0,
            students: 18,
            rating: 4.9,
            progress: 0,
            thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
            isEnrolled: false,
            nextLesson: 'HTML Basics',
            lastAccessed: null
        }
    ];

    const filteredCourses = courses.filter(course => {
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const enrolledCourses = courses.filter(course => course.isEnrolled);
    const availableCourses = courses.filter(course => !course.isEnrolled);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner': return 'bg-green-100 text-green-800';
            case 'Intermediate': return 'bg-blue-100 text-blue-800';
            case 'Advanced': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const CourseCard = ({ course }: { course: any }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                />
                {course.isEnrolled && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            Enrolled
                        </span>
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(course.level)}`}>
                        {course.level}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                    <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{course.rating}</span>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{course.teacher}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{course.duration}</span>
                        </span>
                    </div>

                    {course.isEnrolled && (
                        <>
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
                            <div className="text-sm text-gray-600">
                                <span>Next: {course.nextLesson}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex space-x-2">
                    {course.isEnrolled ? (
                        <>
                            <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Play className="h-4 w-4" />
                                <span>Continue</span>
                            </button>
                            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Download className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Enroll Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                                }`}
                        >
                            <Grid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                                }`}
                        >
                            <List className="h-4 w-4" />
                        </button>
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
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name} ({category.count})
                                </option>
                            ))}
                        </select>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Filter className="h-4 w-4" />
                            <span>More Filters</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Enrolled Courses */}
            {enrolledCourses.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Currently Enrolled ({enrolledCourses.length})</h2>
                    <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1'
                        }`}>
                        {enrolledCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            )}

            {/* Available Courses */}
            {availableCourses.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Courses ({availableCourses.length})</h2>
                    <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1'
                        }`}>
                        {availableCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            )}

            {/* Course Resources */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Course Resources</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-blue-50 rounded-lg">
                            <Video className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Video Lectures</h3>
                            <p className="text-sm text-gray-600 mb-4">Access recorded lectures and tutorials</p>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Browse Videos
                            </button>
                        </div>
                        <div className="text-center p-6 bg-green-50 rounded-lg">
                            <FileText className="h-8 w-8 text-green-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Study Materials</h3>
                            <p className="text-sm text-gray-600 mb-4">Download PDFs, notes, and references</p>
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                View Materials
                            </button>
                        </div>
                        <div className="text-center p-6 bg-purple-50 rounded-lg">
                            <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Practice Tests</h3>
                            <p className="text-sm text-gray-600 mb-4">Take quizzes and practice exams</p>
                            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                                Start Practice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses;