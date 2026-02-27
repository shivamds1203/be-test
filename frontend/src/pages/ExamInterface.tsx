import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Video, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useProctoring } from '../hooks/useProctoring';

const mockQuestions = [
    { id: 'q1', text: 'Which hooks are built-in to React?', options: ['useState', 'useForm', 'useFetch', 'useRedux'], type: 'MCQ' },
    { id: 'q2', text: 'What is the virtual DOM?', options: ['A direct copy of HTML', 'A lightweight JavaScript representation of the DOM', 'A browser extension', 'A CSS framework'], type: 'MCQ' },
    { id: 'q3', text: 'How do you prevent unnecessary re-renders in React?', options: ['Using jQuery', 'Using React.memo', 'Using setTimeout', 'Using CSS transitions'], type: 'MCQ' },
    { id: 'q4', text: 'Explain the context API in your own words.', type: 'SUBJECTIVE' }
];

export const ExamInterface: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [timeLeft, setTimeLeft] = useState(60 * 45); // 45 mins

    const webcamRef = React.useRef<Webcam>(null);
    const { warnings, isModelLoading } = useProctoring(webcamRef);

    // Auto-submit if warnings exceed threshold
    useEffect(() => {
        if (warnings >= 3) {
            handleSubmit();
        }
    }, [warnings]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = () => {
        // Submit logic
        navigate(`/exam/${id}/results`);
    };

    const currentQ = mockQuestions[currentQIndex];

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const isLowTime = timeLeft < 60;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
            {/* Exam Header */}
            <header style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky', top: 0, zIndex: 10
            }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                    Exam <span style={{ color: 'var(--color-primary)' }}>Active</span>
                </div>

                {/* Animated Timer */}
                <motion.div
                    animate={isLowTime ? { scale: [1, 1.05, 1], color: ['#ef4444', '#b91c1c', '#ef4444'] } : {}}
                    transition={isLowTime ? { repeat: Infinity, duration: 1 } : {}}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 16px', borderRadius: 'var(--radius-full)',
                        background: isLowTime ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-surface)',
                        border: `1px solid ${isLowTime ? 'var(--color-danger)' : 'var(--color-border)'}`,
                        color: isLowTime ? 'var(--color-danger)' : 'var(--color-text)',
                        fontWeight: 'bold', fontSize: '1.1rem'
                    }}
                >
                    <Clock size={18} /> {formatTime(timeLeft)}
                </motion.div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {warnings > 0 && (
                        <div style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'bold' }}>
                            <AlertTriangle size={18} /> {warnings}/3 Warnings
                        </div>
                    )}
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit Exam <CheckCircle size={18} />
                    </Button>
                </div>
            </header>

            <main style={{ flex: 1, padding: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 'var(--space-4)', maxWidth: 1200, margin: '0 auto', width: '100%' }}>

                {/* Question Panel */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
                            <span>Question {currentQIndex + 1} of {mockQuestions.length}</span>
                            <span style={{ background: 'var(--color-surface)', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{currentQ.type}</span>
                        </div>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-6)', lineHeight: 1.4 }}>
                            {currentQ.text}
                        </h2>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
                            >
                                {currentQ.type === 'MCQ' ? (
                                    currentQ.options?.map((opt, i) => {
                                        const isSelected = answers[currentQ.id] === i;
                                        return (
                                            <motion.div
                                                key={i}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => setAnswers({ ...answers, [currentQ.id]: i })}
                                                style={{
                                                    padding: '16px 20px',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                    background: isSelected ? 'rgba(79, 70, 229, 0.05)' : 'var(--color-surface)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-3)'
                                                }}
                                            >
                                                <div style={{
                                                    width: 24, height: 24, borderRadius: '50%',
                                                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)'}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {isSelected && <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-primary)' }} />}
                                                </div>
                                                <span style={{ fontSize: '1.1rem', fontWeight: isSelected ? 500 : 400 }}>{opt}</span>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <textarea
                                        value={answers[currentQ.id] || ''}
                                        onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                                        placeholder="Type your detailed answer here..."
                                        style={{
                                            width: '100%', minHeight: 200, padding: 16,
                                            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)', color: 'var(--color-text)',
                                            fontFamily: 'inherit', fontSize: '1rem', resize: 'vertical', outline: 'none'
                                        }}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)', display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="outline" disabled={currentQIndex === 0} onClick={() => setCurrentQIndex(prev => prev - 1)}>
                                <ChevronLeft size={18} /> Previous
                            </Button>
                            <Button variant="primary" disabled={currentQIndex === mockQuestions.length - 1} onClick={() => setCurrentQIndex(prev => prev + 1)}>
                                Next <ChevronRight size={18} />
                            </Button>
                        </div>
                    </GlassCard>
                </div>

                {/* Navigation & Proctoring Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {/* Camera Feed */}
                    <GlassCard style={{ padding: 'var(--space-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-success)', fontWeight: 'bold', fontSize: 14 }}>
                            <Video size={16} /> Live Proctoring Active
                        </div>
                        {isModelLoading && <div style={{ fontSize: 12, color: 'var(--color-primary)' }}>Initializing AI Model...</div>}
                        <div style={{ width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '2px solid var(--color-border)', aspectRatio: '4/3', background: '#000' }}>
                            <Webcam
                                ref={webcamRef}
                                audio={true}
                                mirrored={true}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-3)' }}>Question Grid</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-2)' }}>
                            {mockQuestions.map((q, i) => {
                                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                                const isCurrent = i === currentQIndex;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentQIndex(i)}
                                        style={{
                                            aspectRatio: '1', borderRadius: 'var(--radius-sm)',
                                            background: isCurrent ? 'var(--color-primary)' : isAnswered ? 'var(--color-success)' : 'var(--color-surface)',
                                            color: isCurrent || isAnswered ? '#fff' : 'var(--color-text)',
                                            border: `1px solid ${isCurrent ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                            fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </GlassCard>
                </div>

            </main>
        </div>
    );
};
