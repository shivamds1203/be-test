# be-test: Advanced AI-Powered Examination Platform

This is a premium, production-ready examination platform I built to bridge the gap between teachers and students while ensuring the highest standards of exam integrity using AI.

## 🚀 Overview

**be-test** is designed for modern educational institutions and private examiners. It features a fully integrated proctoring system, AI-driven question generation, and a secure payment gateway.

## ✨ Key Features

### 👨‍🏫 For Teachers & Admins
- **AI Question Extraction**: Upload a theory PDF, and my AI model automatically extracts multiple-choice questions from the content.
- **AI Topic Generation**: Simply enter a topic, and the platform crafts a draft question bank for you.
- **Razorpay Integration**: A secure payment flow for hosting and publishing exams.
- **Exam Synchronization**: Generate unique 8-character codes for private exams and invite students via email.
- **Scheduling**: Full control over exam start dates and times.
- **Advanced Analytics**: Interactive charts showing revenue, student performance, and participation trends.
- **Result Export**: Generate professional PDF reports of student marks and proctoring logs.

### 👨‍🎓 For Students
- **Code-Based Entry**: Join private exams instantly using unique access codes.
- **Exam Dashboard**: Track upcoming scheduled exams and live attempts.
- **Leaderboard**: Compete with peers and earn badges for top performances.
- **Dynamic Exam Interface**: A clean, distraction-free environment for taking tests.

### 🛡️ Secure Proctoring (AI-Powered)
I implemented several layers of security to ensure exam fairness:
- **Head Movement Detection**: Real-time monitoring using Tensorflow.js to detect if a student is looking away.
- **Tab-Switch Detection**: Automatic warnings or termination if the student leaves the exam window.
- **Audio Monitoring**: Detection of volume spikes or suspicious background noise.
- **Live Camera Feed**: Constant visual monitoring throughout the examination.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Framer Motion (Animations), Lucide React (Icons), Recharts (Analytics), Tensorflow.js (Vision AI).
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL with Prisma ORM.
- **Authentication**: JWT & Google OAuth 2.0.
- **Payments**: Razorpay.
- **Styling**: Vanilla CSS with a focus on Glassmorphism and a Figma-inspired 8px grid system.

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database

### Installation

1. **Clone the repository**:
   ```bash
   git clone [your-repository-link]
   cd be-test
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   # Create a .env file with your VITE_RAZORPAY_KEY_ID and VITE_GOOGLE_CLIENT_ID
   npm run dev
   ```

3. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Configure your .env with DATABASE_URL, RAZORPAY_SECRET, etc.
   npx prisma generate
   npm start
   ```

---
*Created by [Your Name/be-test Team]*
