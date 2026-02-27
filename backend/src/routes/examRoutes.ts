import express from 'express';
import {
    createExam,
    addQuestions,
    publishExam,
    getExams,
    getExamById,
    submitExam,
    getLeaderboard
} from '../controllers/examController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// Public / General routes
router.get('/leaderboard', getLeaderboard);

// Student Exam routes
router.get('/', protect, getExams);
router.get('/:id', protect, getExamById);
router.post('/:id/submit', protect, submitExam);

// Admin routes
router.post('/', protect, admin, createExam);
router.post('/:id/questions', protect, admin, addQuestions);
router.put('/:id/publish', protect, admin, publishExam);

export default router;
