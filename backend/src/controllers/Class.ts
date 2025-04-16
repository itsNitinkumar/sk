import { Request, Response, RequestHandler } from 'express';
import { db } from '../db/index.ts';
import { coursesTable, educatorsTable, modulesTable, contentTable } from '../db/schema.ts';
import { eq, and } from 'drizzle-orm';
import { uploadMedia, deleteMedia } from '../utils/storage.ts';
import { UploadedFile } from 'express-fileupload';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  }
  files?: {
    [key: string]: UploadedFile | UploadedFile[];
  };
  courseId: string;
}

async function isEducatorForCourse(userId: string, courseId: string): Promise<boolean> {
  const educator = await db
    .select()
    .from(educatorsTable)
    .innerJoin(coursesTable, eq(educatorsTable.id, coursesTable.educatorId))
    .where(and(
      eq(educatorsTable.userId, userId),
      eq(coursesTable.id, courseId)
    ))
    .limit(1);

  return educator.length > 0;
}

export const createClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { moduleId, title, description, duration } = req.body;
    
    const videoFile = req.files?.video as UploadedFile;
    if (!videoFile) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded'
      });
    }

    // Upload to Cloudinary
    const videoUpload = await uploadMedia(videoFile);

    // Create the class record
    const newContent = await db.insert(contentTable).values({
      moduleId,
      title: title || 'Untitled Class',
      description: description || '',
      type: 'video',
      fileUrl: videoUpload.url,
      duration: duration ? duration.toString() : null,  // Convert duration to string
      views: 0,
      order: 0,
      isPreview: false
    }).returning();

    return res.status(201).json({
      success: true,
      data: newContent[0],
      message: 'Class created successfully'
    });
  } catch (error) {
    console.error('Error creating class:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating class'
    });
  }
};

export const getClassStream = async (req: Request, res: Response) => {
  try {
    const { contentId } = req.params;
    const content = await db.select()
      .from(contentTable)
      .where(and(
        eq(contentTable.id, contentId),
        eq(contentTable.type, 'video')
      ))
      .limit(1);

    if (!content.length) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Increment views
    await db.update(contentTable)
      .set({ views: (content[0].views || 0) + 1 })
      .where(eq(contentTable.id, contentId));

    return res.status(200).json({
      success: true,
      data: content[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching class'
    });
  }
};

export const updateClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentId } = req.params;
    const { id: userId } = req.user;
    const { duration, moduleId, title, description } = req.body;

    const contentDetails = await db
      .select({
        module: modulesTable,
        content: contentTable
      })
      .from(contentTable)
      .innerJoin(modulesTable, eq(contentTable.moduleId, modulesTable.id))
      .where(and(
        eq(contentTable.id, contentId),
        eq(contentTable.type, 'video')
      ))
      .limit(1);

    if (!contentDetails.length) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const courseId = contentDetails[0].module.courseId;
    const isEducator = await isEducatorForCourse(userId, courseId);
    
    if (!isEducator) {
      return res.status(403).json({
        success: false,
        message: 'Only educators can update classes'
      });
    }

    const updateData: Record<string, any> = {};

    if (moduleId) updateData.moduleId = moduleId;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (duration) updateData.duration = parseFloat(duration);

    if (req.files?.video) {
      const videoFile = req.files.video as UploadedFile;
      const videoUpload = await uploadMedia(videoFile);
      
      // Delete old video if exists
      if (contentDetails[0].content.fileUrl) {
        await deleteMedia(contentDetails[0].content.fileUrl);
      }

      updateData.fileUrl = videoUpload.url;
    }

    const updatedContent = await db.update(contentTable)
      .set(updateData)
      .where(eq(contentTable.id, contentId))
      .returning();

    return res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: updatedContent[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating class'
    });
  }
};

export const deleteClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentId } = req.params;
    const { id: userId } = req.user;

    const content = await db.select()
      .from(contentTable)
      .where(eq(contentTable.id, contentId))
      .limit(1);

    if (!content.length) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Get module and course details for permission check
    const contentDetails = await db
      .select({
        module: modulesTable,
      })
      .from(contentTable)
      .innerJoin(modulesTable, eq(contentTable.moduleId, modulesTable.id))
      .where(and(
        eq(contentTable.id, contentId),
        eq(contentTable.type, 'video')
      ))
      .limit(1);

    if (!contentDetails.length) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const courseId = contentDetails[0].module.courseId;
    const isEducator = await isEducatorForCourse(userId, courseId);
    
    if (!isEducator) {
      return res.status(403).json({
        success: false,
        message: 'Only educators can delete classes'
      });
    }

    // Delete from Cloudinary first
    if (content[0].fileUrl) {
      try {
        await deleteMedia(content[0].fileUrl);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
      }
    }

    // Delete from database
    await db.delete(contentTable)
      .where(eq(contentTable.id, contentId));

    return res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteClass:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting class',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getModuleClasses = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;

    const classes = await db
      .select({
        id: contentTable.id,
        moduleId: contentTable.moduleId,
        title: contentTable.title,
        description: contentTable.description,
        views: contentTable.views,
        duration: contentTable.duration,
        fileUrl: contentTable.fileUrl,
        order: contentTable.order,
        isPreview: contentTable.isPreview
      })
      .from(contentTable)
      .where(and(
        eq(contentTable.moduleId, moduleId),
        eq(contentTable.type, 'video')
      ))
      .orderBy(contentTable.order);

    return res.status(200).json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error('Error fetching module classes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching module classes'
    });
  }
};

export const uploadContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.files?.material as UploadedFile;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { moduleId, title, description, type, order, isPreview } = req.body;

    if (!moduleId || !title || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const uploadResult = await uploadMedia(file);
    
    const newContent = await db.insert(contentTable).values({
      moduleId,
      title,
      description: description || '',
      type,
      fileUrl: uploadResult.url,
      duration: type === 'video' ? req.body.duration.toString() || null : null,
      order: parseInt(order) || 0,
      isPreview: Boolean(isPreview),
      views: 0
    }).returning();

    return res.status(201).json({
      success: true,
      data: newContent[0],
      message: 'Content uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading content:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};







