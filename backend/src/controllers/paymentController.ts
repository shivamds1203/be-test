import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy'
});

export const createOrder = async (req: any, res: Response) => {
    try {
        const { examId } = req.body;

        const exam = await prisma.exam.findUnique({ where: { id: examId } });
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        const options = {
            amount: exam.price * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${examId}_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        // Record initial pending payment
        await prisma.payment.create({
            data: {
                userId: req.user.id,
                examId: examId,
                stripePaymentId: order.id, // Reusing stripePaymentId column for razorpay order id
                amount: exam.price,
                status: 'PENDING'
            }
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error creating Razorpay order', error });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment successful, update db
            await prisma.payment.updateMany({
                where: { stripePaymentId: razorpay_order_id },
                data: { status: 'COMPLETED' }
            });

            res.status(200).json({ message: "Payment verified successfully" });
        } else {
            res.status(400).json({ message: "Invalid Signature" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying payment', error });
    }
};
