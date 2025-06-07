import { Calendar, ChevronLeft, ChevronRight, MapPin, Plus, Users, Video } from 'lucide-react';
import React, { useState } from 'react';

const Schedule: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

    const scheduleItems = [
        {
            id: 1,
            title: 'Advanced Mathematics',
            type: 'lecture',
            time: '09:00 AM - 10:30 AM',
            date: '2024-01-15',
            teacher: 'Dr. Sarah Johnson',
            room: 'Room 101',
            students: 45,
            color: 'blue',
            isLive: false
        },
        {
            id: 2,
            title: 'Computer Science Lab',
            type: 'lab',
            time: '11:00 AM - 12:30 PM',
            date: '2024-01-15',
            teacher: 'Prof. Mike Chen',
            room: 'Lab 205',
            students: 32,
            color: 'green',
            isLive: true
        },
        {
            id: 3,
            title: 'Physics Discussion',
            type: 'discussion',
            time: '02:00 PM - 03:00 PM',
            date: '2024-01-15',
            teacher: 'Dr. Emily Davis',
            room: 'Virtual Room',
            students: 28,
            color: 'purple',
            isLive: false
        },
        {
            id: 4,
            title: 'Statistics Workshop',
            type: 'workshop',
            time: '03:30 PM - 05:00 PM',
            date: '2024-01-15',
            teacher: 'Prof. Alex Wilson',
            room: 'Room 301',
            students: 35,
            color: 'orange',
            isLive: false
        },
        {
            id: 5,
            title: 'Linear Algebra',
            type: 'lecture',
            time: '10:00 AM - 11:30 AM',
            date: '2024-01-16',
            teacher: 'Dr. Sarah Johnson',
            room: 'Room 102',
            students: 40,
            color: 'blue',
            isLive: false
        }
    ];

    const upcomingEvents = [
        { id: 1, title: 'Midterm Exams', date: '2024-01-22', type: 'exam' },
        { id: 2, title: 'Project Submission Deadline', date: '2024-01-25', type: 'deadline' },
        { id: 3, title: 'Guest Lecture: AI in Education', date: '2024-01-28', type: 'special' }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: 'bg-blue-100 border-blue-300 text-blue-800',
            green: 'bg-green-100 border-green-300 text-green-800',
            purple: 'bg-purple-100 border-purple-300 text-purple-800',
            orange: 'bg-orange-100 border-orange-300 text-orange-800'
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'lecture': return <Video className="h-4 w-4" />;
            case 'lab': return <Users className="h-4 w-4" />;
            case 'discussion': return <Users className="h-4 w-4" />;
            case 'workshop': return <Users className="h-4 w-4" />;
            default: return <Calendar className="h-4 w-4" />;
        }
    };

    const todaySchedule = scheduleItems.filter(item => item.date === '2024-01-15');
    const tomorrowSchedule = scheduleItems.filter(item => item.date === '2024-01-16');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('week')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                                }`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setViewMode('month')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                                }`}
                        >
                            Month
                        </button>
                    </div>
                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="h-4 w-4" />
                        <span>Add Event</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Today's Schedule */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Today's Classes</h2>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>January 15, 2024</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {todaySchedule.map((item) => (
                                <div key={item.id} className={`p-4 rounded-lg border-l-4 ${getColorClasses(item.color)}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            {getTypeIcon(item.type)}
                                            <h3 className="font-semibold">{item.title}</h3>
                                            {item.isLive && (
                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                                    LIVE
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium">{item.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-4">
                                            <span className="flex items-center space-x-1">
                                                <Users className="h-3 w-3" />
                                                <span>{item.teacher}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{item.room}</span>
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs">
                                                Join Class
                                            </button>
                                            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs">
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tomorrow's Schedule */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Tomorrow's Classes</h2>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>January 16, 2024</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {tomorrowSchedule.map((item) => (
                                <div key={item.id} className={`p-4 rounded-lg border-l-4 ${getColorClasses(item.color)}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            {getTypeIcon(item.type)}
                                            <h3 className="font-semibold">{item.title}</h3>
                                        </div>
                                        <span className="text-sm font-medium">{item.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-4">
                                            <span className="flex items-center space-x-1">
                                                <Users className="h-3 w-3" />
                                                <span>{item.teacher}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{item.room}</span>
                                            </span>
                                        </div>
                                        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs">
                                            Set Reminder
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Classes</span>
                                <span className="font-semibold">12</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Live Sessions</span>
                                <span className="font-semibold">8</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Workshops</span>
                                <span className="font-semibold">3</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Study Hours</span>
                                <span className="font-semibold">18h</span>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                        <div className="space-y-3">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                                    <p className="text-xs text-gray-600 mt-1">{event.date}</p>
                                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${event.type === 'exam' ? 'bg-red-100 text-red-800' :
                                            event.type === 'deadline' ? 'bg-orange-100 text-orange-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {event.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calendar Widget */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">January 2024</h3>
                            <div className="flex space-x-1">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                                <div key={day} className="p-2 font-medium text-gray-500">{day}</div>
                            ))}
                            {Array.from({ length: 31 }, (_, i) => (
                                <div key={i + 1} className={`p-2 hover:bg-blue-100 rounded cursor-pointer ${i + 1 === 15 ? 'bg-blue-600 text-white' : 'text-gray-700'
                                    }`}>
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;