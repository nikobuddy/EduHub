import {
    BookOpen, Clock, Download, FileText, Filter, Grid,
    List, Play, Search, Star, Users, Video
} from 'lucide-react';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast'; // ✅ Import toas
import { courses as initialCourses } from './courseData';



const Courses: React.FC = () => {
    const getEmbedUrl = (url: string) => {
        const videoIdMatch = url.match(/(?:youtu\.be\/|v=)([^&]+)/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
    };
    const categories = ['all', 'computer-science', 'chemistry', 'design', 'data'];

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentVideo, setCurrentVideo] = useState<any | null>(null);

    const [courses, setCourses] = useState(initialCourses); // ✅ Make it dynamic

    const filteredCourses = courses.filter((course) => {
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });


    const enrolledCourses = filteredCourses.filter(course => course.isEnrolled);
    const availableCourses = filteredCourses.filter(course => !course.isEnrolled);

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
                <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                {course.isEnrolled && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Enrolled</span>
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(course.level)}`}>{course.level}</span>
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
                            <Users className="h-3 w-3" /><span>{course.teacher}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" /><span>{course.duration}</span>
                        </span>
                    </div>
                    {course.isEnrolled && (
                        <>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-max rounded-full transition-all duration-300" style={{ width: `${course.progress}%` }}></div>
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
                            <button onClick={() => setCurrentVideo(course)} className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Play className="h-4 w-4" /><span>Continue</span>
                            </button>
                            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Download className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                setCourses(prev =>
                                    prev.map(c =>
                                        c.id === course.id ? { ...c, isEnrolled: true, progress: 0 } : c
                                    )
                                );
                                toast.success(`Successfully enrolled in "${course.title}"`);
                            }}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Enroll Now
                        </button>

                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">

            <Toaster position="top-right" reverseOrder={false} />

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
                            <Grid className="h-4 w-4" />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

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
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
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

            {currentVideo && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentVideo.title}</h2>
                    <div className="w-full aspect-video mb-4 rounded-xl overflow-hidden">
                        <iframe
                            className="w-full h-full"
                            src={getEmbedUrl(currentVideo.videoUrl)}
                            title={currentVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <p className="text-gray-600 text-sm">{currentVideo.description}</p>
                </div>
            )}
            {enrolledCourses.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Currently Enrolled ({enrolledCourses.length})
                    </h2>
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {enrolledCourses.map(course => <CourseCard key={course.id} course={course} />)}
                    </div>
                </div>
            )}

            {availableCourses.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Available Courses ({availableCourses.length})
                    </h2>
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {availableCourses.map(course => <CourseCard key={course.id} course={course} />)}
                    </div>
                </div>
            )}

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
                            <a
                                href="/courses" // or external link
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                Browse Videos
                            </a>

                        </div>
                        <div className="text-center p-6 bg-green-50 rounded-lg">
                            <FileText className="h-8 w-8 text-green-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Study Materials</h3>
                            <p className="text-sm text-gray-600 mb-4">Download PDFs, notes, and references</p>

                            <a
                                href="/courses" // or external link
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >View Materials
                            </a>
                        </div>
                        <div className="text-center p-6 bg-purple-50 rounded-lg">
                            <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Practice Tests</h3>
                            <p className="text-sm text-gray-600 mb-4">Take quizzes and practice exams</p>

                            <a
                                href="/discussions" // or external link
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >Start Practice
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses;