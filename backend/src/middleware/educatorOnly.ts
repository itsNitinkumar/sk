import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const educatorOnly = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user;

    const user = await db.select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!user.length || !user[0].isEducator) {
      return res.status(403).json({
        success: false,
        message: 'Only educators can perform this action'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking educator status'
    });
  }
};