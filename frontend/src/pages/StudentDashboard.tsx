import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { PlayCircle, Trophy, Award, Clock, Download, Hash, Calendar, Key } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const mockExams = [
    { id: '1', title: 'Advanced React Patterns', duration: 45, marks: 50, status: 'AVAILABLE', startTime: '2026-03-01T10:00:00' },
    { id: '2', title: 'System Design Basics', duration: 60, marks: 100, status: 'AVAILABLE', startTime: '2026-03-02T14:30:00' },
    { id: 'SC1', title: 'Theoretical Physics Unit 1', duration: 45, marks: 50, status: 'SCHEDULED', startTime: '2026-03-05T09:00:00', code: 'PHYS402' },
    { id: '3', title: 'JavaScript Fundamentals', duration: 30, marks: 40, status: 'COMPLETED', score: 36, startTime: '2026-02-25T11:00:00' },
];

const mockLeaderboard = [
    { rank: 1, name: 'Alice Smith', percentage: 98, time: '28m 10s' },
    { rank: 2, name: 'Bob Jones', percentage: 95, time: '30m 05s' },
    { rank: 3, name: 'Charlie Brown', percentage: 92, time: '32m 45s' },
];

export const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { user } = useAuth();
    const { showToast } = useUI();
    const [joinCode, setJoinCode] = useState('');
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const downloadPDF = async (examTitle: string, id: string) => {
        const input = document.getElementById(`result-card-${id}`);
        if (!input) return;

        // Temporarily adjust styles for PDF
        const originalBackground = input.style.background;
        input.style.background = '#ffffff';
        input.style.color = '#000000'; // Ensure text is dark

        try {
            const canvas = await html2canvas(input, { scale: 2, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${examTitle}_Marksheet.pdf`);
        } catch (error) {
            console.error("PDF generation failed", error);
        } finally {
            // Restore styles
            input.style.background = originalBackground;
            input.style.color = '';
        }
    };

    const handleJoinExam = () => {
        if (!joinCode) return;
        if (joinCode.length < 5) {
            setErrors({ joinCode: 'Code must be at least 5 characters' });
            return;
        }
        setJoining(true);
        setTimeout(() => {
            showToast(`Successfully joined exam: ${joinCode}`, 'success');
            setJoining(false);
            setJoinCode('');
        }, 1500);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, padding: 'var(--space-4)' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)', alignItems: 'start' }}>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 'var(--space-4)' }}>
                            <img
                                src="/favicon.png"
                                alt="Logo"
                                style={{ width: 48, height: 48, borderRadius: 12 }}
                            />
                            <div>
                                <h1 style={{ fontSize: '2rem', margin: 0 }}>My Dashboard</h1>
                            </div>
                        </div>

                        <GlassCard style={{ marginBottom: 'var(--space-6)', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Hash size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: 0 }}>Join Private Exam</h3>
                                        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>Enter the unique 8-character code provided by your teacher to unlock your exam.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 8 }}>
                                    <Input
                                        placeholder="EX: REACT2026"
                                        value={joinCode}
                                        onChange={e => {
                                            setJoinCode(e.target.value.toUpperCase());
                                            if (errors.joinCode) setErrors({ ...errors, joinCode: '' });
                                        }}
                                        error={errors.joinCode}
                                        style={{ background: 'var(--color-surface)', fontSize: '1.1rem', fontWeight: 'bold' }}
                                    />
                                    <Button variant="primary" onClick={handleJoinExam} isLoading={joining} disabled={!joinCode} style={{ padding: '0 32px' }}>
                                        Join Exam
                                    </Button>
                                </div>
                            </div>
                        </GlassCard>

                        <section style={{ marginBottom: 'var(--space-6)' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-3)' }}>Live Now</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {mockExams.filter(e => e.status === 'AVAILABLE').map(exam => (
                                    <GlassCard key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                                            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(79, 70, 229, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <PlayCircle size={24} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{exam.title}</h3>
                                                <div style={{ display: 'flex', gap: 'var(--space-3)', color: 'var(--color-text-muted)', fontSize: 13 }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {exam.duration} mins</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Trophy size={14} /> {exam.marks} marks</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="primary" onClick={() => navigate(`/exam/${exam.id}`)}>
                                            Enter Exam
                                        </Button>
                                    </GlassCard>
                                ))}
                            </div>
                        </section>

                        <section style={{ marginBottom: 'var(--space-6)' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-3)' }}>Scheduled / Upcoming</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {mockExams.filter(e => e.status === 'SCHEDULED' || (e.startTime && new Date(e.startTime) > new Date())).map(exam => (
                                    <GlassCard key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.9 }}>
                                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                                            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{exam.title}</h3>
                                                <div style={{ display: 'flex', gap: 'var(--space-3)', color: 'var(--color-text-muted)', fontSize: 13 }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {new Date(exam.startTime!).toLocaleDateString()}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {new Date(exam.startTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {exam.code && <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', fontWeight: 600 }}><Key size={14} /> {exam.code}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" disabled>
                                            Join on Start Time
                                        </Button>
                                    </GlassCard>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-3)' }}>Recent Results</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {mockExams.filter(e => e.status === 'COMPLETED').map(exam => (
                                    <GlassCard key={exam.id} id={`result-card-${exam.id}`} hoverEffect={false} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8 }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{exam.title}</h3>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Completed Exam Marksheet</p>
                                        </div>
                                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                            <div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                                                    {exam.score} / {exam.marks}
                                                </div>
                                                <span style={{ fontSize: 12, color: 'var(--color-primary)' }}>Performance: Clean</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                                <Button variant="ghost" size="sm" onClick={() => navigate(`/exam/${exam.id}/results`)}>Details</Button>
                                                <Button variant="outline" size="sm" onClick={() => downloadPDF(exam.title, exam.id)}>
                                                    <Download size={14} /> PDF
                                                </Button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </section>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                        <GlassCard>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                                <Award size={24} color="var(--color-primary)" />
                                <h2 style={{ fontSize: '1.25rem' }}>Global Leaderboard</h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {mockLeaderboard.map((user, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: 'var(--space-2)',
                                        borderRadius: 'var(--radius-md)',
                                        background: idx === 0 ? 'rgba(255, 215, 0, 0.1)' : idx === 1 ? 'rgba(192, 192, 192, 0.1)' : idx === 2 ? 'rgba(205, 127, 50, 0.1)' : 'transparent'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <div style={{
                                                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : 'var(--color-surface)',
                                                color: idx < 3 ? '#000' : 'var(--color-text)',
                                                fontWeight: 'bold', fontSize: 12
                                            }}>
                                                {user.rank}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{user.name}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{user.percentage}%</div>
                                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{user.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>

                </div>
            </main>
        </div>
    );
};
