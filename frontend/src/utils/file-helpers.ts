export const getFileThumbnail = (fileType: string): string => {
  if (fileType.startsWith('video/')) {
    return '/thumbnails/video-thumbnail.jpg';
  } else if (fileType.startsWith('image/')) {
    return '/thumbnails/image-thumbnail.jpg';
  } else if (fileType.startsWith('application/pdf')) {
    return '/thumbnails/pdf-thumbnail.jpg';
  } else if (fileType.startsWith('application/msword') || 
             fileType.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml')) {
    return '/thumbnails/doc-thumbnail.jpg';
  } else {
    return '/thumbnails/file-thumbnail.jpg';
  }
};