import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { UploadedFile } from 'express-fileupload';
import path from 'path';

dotenv.config();

// Create Supabase client with realtime enabled
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Initialize realtime channels
const doubtChannel = supabase.channel('doubt-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'doubts'
    },
    (payload) => {
      console.log('Doubt change:', payload);
    }
  )
  .subscribe();

const messageChannel = supabase.channel('message-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'messages'
    },
    (payload) => {
      console.log('Message change:', payload);
    }
  )
  .subscribe();

// Existing Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export { doubtChannel, messageChannel };

export const uploadMedia = async (file: UploadedFile) => {
  try {
    if (!file || !file.tempFilePath) {
      throw new Error('Invalid file object');
    }

    const cleanFileName = file.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '_');
    
    const uniqueFileName = `${Date.now()}-${cleanFileName}`;

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'auto',
      folder: 'skillarious/materials',
      public_id: uniqueFileName,
      overwrite: true
    });

    // Return both URL and public_id
    return {
      url: result.secure_url,      // Store this in fileUrl
      public_id: result.public_id, // Store this for future deletion
      fileName: file.name,
      mimeType: file.mimetype,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload file to storage');
  }
};

export const deleteMedia = async (fileUrl: string) => {
  try {
    const public_id = getPublicIdFromUrl(fileUrl);
    if (!public_id) {
      throw new Error('Invalid file URL');
    }

    const result = await cloudinary.uploader.destroy(public_id);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete file from storage');
  }
};

// Add a function to extract public_id from URL
export const getPublicIdFromUrl = (url: string): string => {
  const urlParts = url.split('/');
  const startIndex = urlParts.indexOf('skillarious');
  if (startIndex === -1) return '';
  
  return urlParts
    .slice(startIndex)
    .join('/')
    .split('.')[0]; // Remove file extension
};






