import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Create a new exam
// @route   POST /api/exams
// @access  Private/Admin
export const createExam = async (req: any, res: Response) => {
    try {
        const { title, description, timeLimitMinutes, marksPerQuestion, price } = req.body;

        const exam = await prisma.exam.create({
            data: {
                title,
                description,
                timeLimitMinutes,
                marksPerQuestion,
                price,
                createdById: req.user.id,
            },
        });

        res.status(201).json(exam);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating exam' });
    }
};

// @desc    Add questions to an exam
// @route   POST /api/exams/:id/questions
// @access  Private/Admin
export const addQuestions = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { questions } = req.body; // Array of { type, text, options, correctOptionIndex, explanation }

        const exam = await prisma.exam.findUnique({ where: { id } });
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        // Using transaction for bulk insert
        const createdQuestions = await prisma.$transaction(
            questions.map((q: any) =>
                prisma.question.create({
                    data: {
                        examId: id,
                        type: q.type,
                        text: q.text,
                        options: q.options || [],
                        correctOptionIndex: q.correctOptionIndex,
                        explanation: q.explanation,
                    },
                })
            )
        );

        res.status(201).json(createdQuestions);
    } catch (error) {
        res.status(500).json({ message: 'Server error adding questions' });
    }
};

// @desc    Publish an exam
// @route   PUT /api/exams/:id/publish
// @access  Private/Admin
export const publishExam = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { isPublished } = req.body;

        const exam = await prisma.exam.update({
            where: { id },
            data: { isPublished },
        });

        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: 'Server error publishing exam' });
    }
};

// @desc    Get all published exams (Student)
// @route   GET /api/exams
// @access  Private
export const getExams = async (req: Request, res: Response) => {
    try {
        const exams = await prisma.exam.findMany({
            where: { isPublished: true },
            include: {
                _count: {
                    select: { questions: true }
                }
            }
        });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching exams' });
    }
};

// @desc    Get single exam details
// @route   GET /api/exams/:id
// @access  Private
export const getExamById = async (req: Request, res: Response) => {
    try {
        const exam = await prisma.exam.findUnique({
            where: { id: req.params.id as string },
            include: {
                questions: {
                    select: { id: true, type: true, text: true, options: true, explanation: true }
                }
            }
        });

        if (exam) {
            res.json(exam);
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching exam' });
    }
};

// @desc    Submit an exam attempt
// @route   POST /api/exams/:id/submit
// @access  Private
export const submitExam = async (req: any, res: Response) => {
    try {
        const { id: examId } = req.params;
        const { answers, timeTakenSeconds } = req.body; // Array of { questionId, selectedOptionIndex, subjectiveText }
        const userId = req.user.id;

        const exam = await prisma.exam.findUnique({
            where: { id: examId },
            include: { questions: true }
        });

        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        let score = 0;
        const totalQuestions = exam.questions.length;
        const totalMarks = totalQuestions * exam.marksPerQuestion;

        const answerRecords = answers.map((ans: any) => {
            const question = exam.questions.find(q => q.id === ans.questionId);
            let isCorrect = false;

            if (question && question.type === 'MCQ') {
                isCorrect = question.correctOptionIndex === ans.selectedOptionIndex;
                if (isCorrect) score += exam.marksPerQuestion;
            }

            return {
                questionId: ans.questionId,
                selectedOptionIndex: ans.selectedOptionIndex,
                subjectiveText: ans.subjectiveText,
                isCorrect: question?.type === 'MCQ' ? isCorrect : null // null for subjective pending review
            };
        });

        const percentage = (score / totalMarks) * 100;

        const attempt = await prisma.examAttempt.create({
            data: {
                userId,
                examId,
                score,
                percentage,
                timeTakenSeconds,
                status: 'COMPLETED',
                submittedAt: new Date(),
                answers: {
                    create: answerRecords
                }
            },
            include: {
                answers: true
            }
        });

        res.status(201).json(attempt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error submitting exam' });
    }
};

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const attempts = await prisma.examAttempt.findMany({
            where: { status: 'COMPLETED' },
            orderBy: [
                { percentage: 'desc' },
                { timeTakenSeconds: 'asc' }
            ],
            take: 10,
            include: {
                user: { select: { id: true, name: true, profileImage: true } },
                exam: { select: { title: true } }
            }
        });

        res.json(attempts);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching leaderboard' });
    }
};
