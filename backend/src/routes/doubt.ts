import express from 'express';
import { RequestHandler } from 'express';
import { 
    createDoubt, 
    replyToDoubt, 
    getDoubtsByCourse,
    getDoubtMessages 
} from '../controllers/Doubt.ts';
import { authenticateUser } from '../controllers/Auth.ts';

const router = express.Router();

// Existing routes
router.post('/create', authenticateUser as unknown as RequestHandler, createDoubt as unknown as RequestHandler);
router.get('/course/:courseId', authenticateUser as unknown as RequestHandler, getDoubtsByCourse as unknown as RequestHandler);
router.post('/reply/:id', authenticateUser as unknown as RequestHandler, replyToDoubt as unknown as RequestHandler);

// New messages route
router.get('/:doubtId/messages', authenticateUser as unknown as RequestHandler, getDoubtMessages as unknown as RequestHandler);

export default router;


