import { BookOpen, Clock, Filter, Pin, Plus, Reply, Search, ThumbsUp, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';

import NewDiscussionForm from '../../components/NewDiscussionForm';
import { db } from '../../firebase/firebase';

interface Discussion {
    id: string;
    title: string;
    content: string;
    author: string;
    authorRole: string;
    course: string;
    category: string;
    replies: number;
    likes: number;
    isPinned: boolean;
    isAnswered: boolean;
    createdAt: string;
    lastActivity: string;
    tags: string[];
}

type CategoryId = 'all' | 'mathematics' | 'computer-science' | 'physics' | 'general';

const Discussions: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [dynamicDiscussions, setDynamicDiscussions] = useState<Discussion[]>([]);
    const [loading, setLoading] = useState(true);

    // Static discussions data
    const staticDiscussions: Discussion[] = [
        {
            id: '1',
            title: 'How to solve complex integration problems?',
            content: 'I\'m struggling with integration by parts. Can someone explain the step-by-step process with examples?',
            author: 'Alice Johnson',
            authorRole: 'student',
            course: 'Advanced Mathematics',
            category: 'mathematics',
            replies: 12,
            likes: 8,
            isPinned: true,
            isAnswered: true,
            createdAt: '2 hours ago',
            lastActivity: '30 minutes ago',
            tags: ['calculus', 'integration', 'help-needed']
        },
        {
            id: '2',
            title: 'Best practices for React component optimization',
            content: 'What are the most effective ways to optimize React components for better performance? Looking for practical tips.',
            author: 'Prof. Mike Chen',
            authorRole: 'teacher',
            course: 'Computer Science Fundamentals',
            category: 'computer-science',
            replies: 18,
            likes: 15,
            isPinned: false,
            isAnswered: false,
            createdAt: '4 hours ago',
            lastActivity: '1 hour ago',
            tags: ['react', 'optimization', 'performance']
        },
        {
            id: '3',
            title: 'Understanding quantum mechanics principles',
            content: 'Can someone help explain the wave-particle duality concept? I find it confusing how light can behave as both.',
            author: 'Bob Smith',
            authorRole: 'student',
            course: 'Physics Laboratory',
            category: 'physics',
            replies: 7,
            likes: 5,
            isPinned: false,
            isAnswered: true,
            createdAt: '6 hours ago',
            lastActivity: '2 hours ago',
            tags: ['quantum-mechanics', 'physics', 'theory']
        },
        {
            id: '4',
            title: 'Study group for upcoming midterms',
            content: 'Looking to form a study group for the upcoming midterm exams. Anyone interested in joining?',
            author: 'Carol Davis',
            authorRole: 'student',
            course: 'General',
            category: 'general',
            replies: 23,
            likes: 12,
            isPinned: false,
            isAnswered: false,
            createdAt: '8 hours ago',
            lastActivity: '3 hours ago',
            tags: ['study-group', 'midterms', 'collaboration']
        },
        {
            id: '5',
            title: 'Assignment submission guidelines clarification',
            content: 'Could someone clarify the format requirements for the upcoming project submission? The rubric mentions specific formatting but I want to make sure I understand correctly.',
            author: 'David Wilson',
            authorRole: 'student',
            course: 'Computer Science Fundamentals',
            category: 'computer-science',
            replies: 5,
            likes: 3,
            isPinned: false,
            isAnswered: true,
            createdAt: '1 day ago',
            lastActivity: '4 hours ago',
            tags: ['assignment', 'guidelines', 'clarification']
        }
    ];

    // Calculate category counts dynamically
    const calculateCategoryCounts = (discussions: Discussion[]) => {
        const counts: Record<CategoryId, number> = {
            'all': discussions.length,
            'mathematics': 0,
            'computer-science': 0,
            'physics': 0,
            'general': 0
        };

        discussions.forEach(discussion => {
            if (discussion.category in counts) {
                counts[discussion.category as CategoryId]++;
            }
        });

        return counts;
    };

    const categories = [
        { id: 'all' as CategoryId, name: 'All Discussions' },
        { id: 'mathematics' as CategoryId, name: 'Mathematics' },
        { id: 'computer-science' as CategoryId, name: 'Computer Science' },
        { id: 'physics' as CategoryId, name: 'Physics' },
        { id: 'general' as CategoryId, name: 'General' }
    ];

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const discussionsRef = collection(db, 'discussions');
                const q = query(discussionsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                
                const fetchedDiscussions = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    isPinned: true // Ensure dynamic discussions are pinned
                })) as Discussion[];

                setDynamicDiscussions(fetchedDiscussions);
            } catch (error) {
                console.error('Error fetching discussions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscussions();
    }, []);

    const handleNewDiscussion = async (discussionData: Omit<Discussion, 'id'>) => {
        try {
            const discussionsRef = collection(db, 'discussions');
            const docRef = await addDoc(discussionsRef, {
                ...discussionData,
                isPinned: true // Ensure new discussions are pinned
            });
            
            setDynamicDiscussions(prev => [{
                ...discussionData,
                id: docRef.id,
                isPinned: true
            }, ...prev]);
        } catch (error) {
            console.error('Error adding discussion:', error);
        }
    };

    const popularTags = [
        'calculus', 'programming', 'physics', 'study-tips', 'assignments',
        'react', 'mathematics', 'quantum-mechanics', 'help-needed', 'collaboration'
    ];

    // Combine static and dynamic discussions, ensuring dynamic ones are at the top
    const allDiscussions = [...dynamicDiscussions, ...staticDiscussions];
    const categoryCounts = calculateCategoryCounts(allDiscussions);

    const filteredDiscussions = allDiscussions.filter(discussion => {
        const matchesCategory = selectedCategory === 'all' || discussion.category === selectedCategory;
        const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'teacher': return 'bg-blue-100 text-blue-800';
            case 'student': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Discussions</h1>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    <span>New Discussion</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Search and Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search discussions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Sort by Latest</option>
                                    <option>Sort by Popular</option>
                                    <option>Sort by Unanswered</option>
                                </select>
                                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Filter className="h-4 w-4" />
                                    <span>Filter</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Discussion List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading discussions...</p>
                            </div>
                        ) : (
                            filteredDiscussions.map((discussion) => (
                                <div key={discussion.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            {discussion.isPinned && (
                                                <Pin className="h-4 w-4 text-blue-600" />
                                            )}
                                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                                {discussion.title}
                                            </h3>
                                            {discussion.isAnswered && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                    Answered
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Clock className="h-3 w-3" />
                                            <span>{discussion.createdAt}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-4 line-clamp-2">{discussion.content}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <User className="h-3 w-3 text-gray-600" />
                                                </div>
                                                <span className="text-sm text-gray-700">{discussion.author}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(discussion.authorRole)}`}>
                                                    {discussion.authorRole}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                <BookOpen className="h-3 w-3" />
                                                <span>{discussion.course}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Reply className="h-3 w-3" />
                                                    <span>{discussion.replies}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <ThumbsUp className="h-3 w-3" />
                                                    <span>{discussion.likes}</span>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                                View
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {discussion.tags.map((tag) => (
                                            <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Categories */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                                        selectedCategory === category.id
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    <span className="font-medium">{category.name}</span>
                                    <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                        {categoryCounts[category.id]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Popular Tags */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {popularTags.map((tag) => (
                                <button
                                    key={tag}
                                    className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 text-sm px-3 py-1 rounded-full transition-colors"
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Discussion Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">New Discussions</span>
                                <span className="font-semibold">24</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Replies</span>
                                <span className="font-semibold">156</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Questions Answered</span>
                                <span className="font-semibold">18</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Active Users</span>
                                <span className="font-semibold">89</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="font-medium text-gray-900">Ask a Question</div>
                                <div className="text-sm text-gray-600">Get help from peers and teachers</div>
                            </button>
                            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="font-medium text-gray-900">Browse Unanswered</div>
                                <div className="text-sm text-gray-600">Help others by answering questions</div>
                            </button>
                            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="font-medium text-gray-900">My Discussions</div>
                                <div className="text-sm text-gray-600">View your posts and replies</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <NewDiscussionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleNewDiscussion}
            />
        </div>
    );
};

export default Discussions;