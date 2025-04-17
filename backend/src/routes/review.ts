import { Router } from 'express';
import { createReview, updateReview, deleteReview, getAverageRating, getCourseReviews, getTopReviews } from '../controllers/Review';
import { authenticateUser } from '../controllers/Auth';
import { RequestHandler } from 'express';

const router = Router();

// Add the new endpoint
router.get('/top', getTopReviews as unknown as RequestHandler);

// Existing routes
router.post('/create', authenticateUser as unknown as RequestHandler, createReview as unknown as RequestHandler);
router.put('/update/:courseId', authenticateUser as unknown as RequestHandler, updateReview as unknown as RequestHandler);
router.delete('/delete/:courseId', authenticateUser as unknown as RequestHandler, deleteReview as unknown as RequestHandler);
router.get('/averagerating/:courseId', getAverageRating as unknown as RequestHandler);
router.get('/all/:courseId', getCourseReviews as unknown as RequestHandler);

export default router;
