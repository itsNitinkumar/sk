import React, { useRef } from 'react';
import { Loader2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
    accept: string;
    maxSize: number; // in bytes
    onUpload: (file: File) => Promise<void>;
    disabled?: boolean;
    className?: string;
    buttonText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    accept,
    maxSize,
    onUpload,
    disabled = false,
    className = '',
    buttonText = 'Upload File'
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > maxSize) {
            toast.error(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
            return;
        }

        try {
            await onUpload(file);
            // Reset the input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    return (
        <label 
            className={`relative inline-flex items-center gap-2 px-4 py-2 
                bg-blue-600 text-white rounded-lg cursor-pointer 
                hover:bg-blue-700 transition-colors
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
                ${className}`}
        >
            <Upload className="w-5 h-5" />
            {buttonText}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
            />
        </label>
    );
};
