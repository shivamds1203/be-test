import express from 'express';
import { registerUser, loginUser, getUserProfile, googleAuth } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/profile', protect, getUserProfile);

export default router;
