import { Request, Response } from 'express';
import { db } from '../db/index.ts';
import { doubtsTable, messagesTable, contentTable, usersTable, modulesTable, coursesTable, educatorsTable } from '../db/schema.ts';
import { sendEmail } from '../utils/sendEmail.ts';
import { eq, and, desc, asc } from 'drizzle-orm';
import { doubtChannel, messageChannel } from '../utils/storage.ts';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  }
}

export const createDoubt = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId, title, description } = req.body;
    const userId = req.user.id;

    // Add logging to debug
    console.log('Creating doubt with:', { courseId, title, description, userId });

    // Verify course exists
    const course = await db.select()
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId))
      .limit(1);

    if (!course.length) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const newDoubt = await db.insert(doubtsTable).values({
      date: new Date(),
      userId: userId,
      courseId: courseId,
      title,
      description,
      status: 'open',
      resolved: false
    }).returning();

    // Get educator email directly from course
    const educatorEmail = await db.select({
      email: usersTable.email
    })
    .from(coursesTable)
    .innerJoin(educatorsTable, eq(coursesTable.educatorId, educatorsTable.id))
    .innerJoin(usersTable, eq(educatorsTable.userId, usersTable.id))
    .where(eq(coursesTable.id, courseId))
    .then(result => result[0]?.email);

    if (!educatorEmail) {
      throw new Error('Educator email not found');
    }
    
    await sendEmail(
      educatorEmail,
      'New Doubt Posted',
      `A new doubt has been posted in your course:
      
      Title: "${title}"
      Description: "${description}"
      
      Please login to respond to this doubt.`
    );

    return res.status(201).json({
      success: true,
      data: newDoubt[0]
    });
  } catch (error) {
    console.error('Error in createDoubt:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating doubt',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const replyToDoubt = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const doubtId = req.params.id;
    const { content } = req.body;
    const userId = req.user.id;

    // Basic validation
    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
    }

    // Get educator ID with simplified query
    const educator = await db
      .select({ id: educatorsTable.id })
      .from(educatorsTable)
      .where(eq(educatorsTable.userId, userId))
      .limit(1);

    if (!educator.length) {
      return res.status(403).json({
        success: false,
        message: 'Only educators can reply to doubts'
      });
    }

    // Simple doubt existence check
    const doubt = await db
      .select({ id: doubtsTable.id })
      .from(doubtsTable)
      .where(eq(doubtsTable.id, doubtId))
      .limit(1);

    if (!doubt.length) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found'
      });
    }

    // Create message
    const newMessage = await db
      .insert(messagesTable)
      .values({
        doubtId,
        text: content.trim(),
        isResponse: true,
        createdAt: new Date()
      })
      .returning();

    // Update doubt status
    await db
      .update(doubtsTable)
      .set({
        status: 'answered',
        educatorAssigned: educator[0].id,
        updatedAt: new Date()
      })
      .where(eq(doubtsTable.id, doubtId));

    return res.status(200).json({
      success: true,
      data: newMessage[0]
    });

  } catch (error) {
    console.error('Server error in replyToDoubt:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while replying to doubt'
    });
  }
};

// Add new function to get realtime updates status
export const getRealtimeStatus = async (_req: Request, res: Response) => {
  try {
    const status = {
      doubtsChannel: doubtChannel.state,
      messagesChannel: messageChannel.state
    };

    return res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error getting realtime status'
    });
  }
};

export const getDoubtsByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    
    console.log('Received request for courseId:', courseId);
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Log the query we're about to execute
    console.log('Executing query for course:', courseId);

    const doubts = await db
      .select({
        id: doubtsTable.id,
        title: doubtsTable.title,
        description: doubtsTable.description,
        date: doubtsTable.date,
        status: doubtsTable.status,
        resolved: doubtsTable.resolved,
        userId: doubtsTable.userId,
        courseId: doubtsTable.courseId
      })
      .from(doubtsTable)
      .where(eq(doubtsTable.courseId, courseId));

    console.log('Query results:', doubts);

    return res.status(200).json({
      success: true,
      doubts: doubts.map(doubt => ({
        ...doubt,
        date: doubt.date?.toISOString()
      }))
    });

  } catch (error) {
    console.error('Database error:', error);
    
    // Send a more detailed error response
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doubts',
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : 'Unknown error'
    });
  }
};

export const getDoubtMessages = async (req: Request, res: Response) => {
  try {
    const { doubtId } = req.params;

    const messages = await db
      .select({
        id: messagesTable.id,
        text: messagesTable.text,
        isResponse: messagesTable.isResponse,
        createdAt: messagesTable.createdAt
      })
      .from(messagesTable)
      .where(eq(messagesTable.doubtId, doubtId))
      .orderBy(asc(messagesTable.createdAt));

    return res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};









