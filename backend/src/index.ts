import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import userRoutes from './routes/userRoutes';
import examRoutes from './routes/examRoutes';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running smoothly! 🚀' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
