'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import contentService from '@/services/content.service';
import toast from 'react-hot-toast';

interface StudyMaterialUploadProps {
    moduleId: string;
    onUploadComplete?: () => void;
}

export default function StudyMaterialUpload({ moduleId, onUploadComplete }: StudyMaterialUploadProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!file || !title) {
            toast.error('Please provide a title and file');
            return;
        }

        // Validate file size
        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size should be less than 50MB');
            return;
        }

        const formData = new FormData();
        formData.append('material', file);
        formData.append('moduleId', moduleId);
        formData.append('title', title);
        formData.append('description', description || '');

        try {
            setLoading(true);
            console.log('Uploading file:', {
                name: file.name,
                size: file.size,
                type: file.type
            });

            const response = await contentService.uploadStudyMaterial(moduleId, formData);
            
            if (response.success) {
                toast.success('Study material uploaded successfully');
                if (onUploadComplete) {
                    onUploadComplete();
                }
                router.push(`/content/studyMaterials/${moduleId}`);
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to upload study material';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-200">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-200">Description (Optional)</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                    rows={3}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-200">File</label>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-sm text-gray-200
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-red-600 file:text-white
                        hover:file:bg-red-700"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-2 text-white rounded-md ${
                    loading 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                }`}
            >
                {loading ? 'Uploading...' : 'Upload Material'}
            </button>
        </form>
    );
}
