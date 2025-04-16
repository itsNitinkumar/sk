'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { Doubt, Message } from '@/types';
import { toast } from 'react-hot-toast';
import doubtService from '@/services/doubt.service';
import { supabase } from '../utils/supabase';

interface DoubtFormData {
    title: string;
    description: string;
    courseId: string;
}

const formatMessageDate = (dateString?: string) => {
    if (!dateString) return 'Just now';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Just now';
        
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Just now';
    }
};

export default function CourseDoubts({ courseId }: { courseId: string }) {
    const [doubts, setDoubts] = useState<Doubt[]>([]);
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<DoubtFormData>({
        title: '',
        description: '',
        courseId: courseId
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDoubts();

        // Subscribe to real-time messages with debug logging
        const channel = supabase.channel('message-updates')
            .on('postgres_changes', 
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages'
                }, 
                (payload) => {
                    console.log('New message received:', payload.new);
                    const newMessage = payload.new as Message;
                    if (!newMessage.doubtId) {
                        console.error('Message received without doubtId:', newMessage);
                        return;
                    }
                    setMessages(prev => {
                        const existingMessages = prev[newMessage.doubtId] || [];
                        const updated = {
                            ...prev,
                            [newMessage.doubtId]: [...existingMessages, newMessage]
                        };
                        console.log('Updated messages:', updated);
                        return updated;
                    });
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });

        return () => {
            console.log('Cleaning up subscription');
            channel.unsubscribe();
        };
    }, [courseId]);

    const loadDoubts = async () => {
        try {
            setLoading(true);
            const response = await doubtService.getDoubtsByCourse(courseId);
            console.log('Doubts response:', response);

            if (response.success) {
                setDoubts(response.doubts);
                
                // Initialize messages for each doubt
                const messagesMap: Record<string, Message[]> = {};
                
                // Fetch messages for each doubt
                for (const doubt of response.doubts) {
                    try {
                        console.log(`Fetching messages for doubt: ${doubt.id}`);
                        const messagesResponse = await doubtService.getMessages(doubt.id);
                        console.log(`Messages response for doubt ${doubt.id}:`, messagesResponse);
                        
                        if (messagesResponse.success && messagesResponse.messages) {
                            messagesMap[doubt.id] = messagesResponse.messages;
                        } else {
                            console.warn(`No messages found for doubt ${doubt.id}`);
                            messagesMap[doubt.id] = [];
                        }
                    } catch (error) {
                        console.error(`Failed to fetch messages for doubt ${doubt.id}:`, error);
                        messagesMap[doubt.id] = [];
                    }
                }
                
                console.log('Final messages map:', messagesMap);
                setMessages(messagesMap);
            } else {
                toast.error(response.message || 'Failed to load doubts');
            }
        } catch (error) {
            console.error('Error loading doubts:', error);
            toast.error('Failed to load doubts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitDoubt = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await doubtService.createDoubt(
                courseId,
                formData.title,
                formData.description
            );

            if (response.success) {
                setDoubts([...doubts, response.data]);
                setShowForm(false);
                setFormData({ title: '', description: '', courseId });
                toast.success('Doubt posted successfully');
                loadDoubts(); // Reload doubts after successful creation
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Error submitting doubt:', error);
            toast.error('Failed to post doubt');
        }
    };

    if (loading) {
        return <div>Loading doubts...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    <Plus className="w-5 h-5" />
                    Ask a Doubt
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmitDoubt} className="space-y-4 border p-4 rounded-lg">
                    <div>
                        <label className="block mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                            minLength={5}
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows={4}
                            required
                            minLength={20}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {doubts.length > 0 ? (
                    doubts.map((doubt) => (
                        <div key={doubt.id} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="text-xl font-semibold text-white mb-2">{doubt.title}</h4>
                                    <p className="text-gray-300">{doubt.description}</p>
                                    <div className="mt-2 text-sm text-gray-400">
                                        {doubt.date && (
                                            <span>Posted: {new Date(doubt.date).toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    doubt.status === 'resolved' 
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                    {doubt.status}
                                </span>
                            </div>

                            {/* Messages Section */}
                            {messages[doubt.id]?.length > 0 && (
                                <div className="mt-6 space-y-4">
                                    <h5 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                                        Replies ({messages[doubt.id]?.length})
                                    </h5>
                                    {messages[doubt.id]
                                        .sort((a, b) => {
                                            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                                            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                                            return dateA - dateB;
                                        })
                                        .map((message, index) => (
                                            <div 
                                                key={message.id || index} 
                                                className={`bg-gray-900/50 rounded p-2 ml-4 ${
                                                    message.isResponse ? 'border-l-2 border-blue-400' : ''
                                                }`}
                                            >
                                                <p className="text-gray-300">{message.text}</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                                                    <span className={message.isResponse ? "text-blue-400" : "text-gray-400"}>
                                                        {message.isResponse ? "Educator's Response" : "Student's Message"}
                                                    </span>
                                                    <span>
                                                        {formatMessageDate(message.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-800 rounded-lg">
                        <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No doubts posted yet</p>
                        <p className="text-gray-500 mt-2">Be the first to ask a question!</p>
                    </div>
                )}
            </div>
        </div>
    );
}























