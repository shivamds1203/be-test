import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Trophy, Home, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResultsScreen: React.FC = () => {
    const percentage = 85;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }} style={{ width: '100%', maxWidth: 600 }}>
                    <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'var(--space-6) var(--space-4)' }}>

                        <motion.div
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}
                        >
                            <Trophy size={40} />
                        </motion.div>

                        <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>Exam Completed!</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: 'var(--space-6)' }}>
                            You've successfully finished the attempt. Here's how you performed:
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', width: '100%', marginBottom: 'var(--space-6)' }}>
                            <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 4 }}>Total Score</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>85 <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>/ 100</span></div>
                            </div>
                            <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 4 }}>Accuracy</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{percentage}%</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <Link to="/dashboard">
                                <Button variant="outline">
                                    <Home size={18} /> Back to Dashboard
                                </Button>
                            </Link>
                            <Button variant="primary">
                                <PieChart size={18} /> Detailed Analytics
                            </Button>
                        </div>

                    </GlassCard>
                </motion.div>
            </main>
        </div>
    );
};
