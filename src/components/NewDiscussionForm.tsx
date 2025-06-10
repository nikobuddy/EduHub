import React, { useState } from 'react';

import { X } from 'lucide-react';
import { useAuth } from '../pages/Auth/useAuth';

interface Discussion {
    title: string;
    content: string;
    category: string;
    course: string;
    tags: string[];
    createdAt: string;
    lastActivity: string;
    replies: number;
    likes: number;
    isPinned: boolean;
    isAnswered: boolean;
    author: string;
    authorRole: string;
    authorId: string;
}

interface NewDiscussionFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (discussion: Discussion) => void;
}

const NewDiscussionForm: React.FC<NewDiscussionFormProps> = ({ isOpen, onClose, onSubmit }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'general',
        course: '',
        tags: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        const tags = formData.tags.split(',').map(tag => tag.trim());
        onSubmit({
            ...formData,
            tags,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            replies: 0,
            likes: 0,
            isPinned: true,
            isAnswered: false,
            author: user.displayName || 'Anonymous User',
            authorRole: 'student',
            authorId: user.uid
        });
        setFormData({
            title: '',
            content: '',
            category: 'general',
            course: '',
            tags: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">New Discussion</h2>
                        <p className="text-sm text-gray-500 mt-1">Share your thoughts and questions with the community</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="What's your question or topic?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                        </label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            rows={6}
                            placeholder="Provide details about your question or topic..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="general">General</option>
                                <option value="mathematics">Mathematics</option>
                                <option value="computer-science">Computer Science</option>
                                <option value="physics">Physics</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.course}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter course name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="e.g., calculus, help-needed, assignment"
                        />
                        <p className="mt-1 text-sm text-gray-500">Add relevant tags to help others find your discussion</p>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Discussion
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewDiscussionForm;