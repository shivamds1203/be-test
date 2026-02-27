import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle, Zap, Shield, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggeredChildren: 0.1 }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export const Landing: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            {/* Hero Section */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.section
                    initial="hidden"
                    animate="show"
                    variants={containerVariants}
                    style={{
                        padding: '120px 24px',
                        textAlign: 'center',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}
                >
                    <motion.div variants={itemVariants} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 16px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        marginBottom: 'var(--space-4)',
                        fontSize: 14,
                        fontWeight: 500
                    }}>
                        <span style={{ color: 'var(--color-primary)' }}><Zap size={14} /></span>
                        be-test 2.0 is Live
                    </motion.div>

                    <motion.h1 variants={itemVariants} style={{ marginBottom: 'var(--space-4)', fontSize: '4rem', letterSpacing: '-0.03em' }}>
                        Create & Attempt <br />
                        <span className="text-gradient">be-test Exams</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)', maxWidth: 600, marginInline: 'auto' }}>
                        The premium evaluation platform for hosting seamless, distraction-free examinations with automated grading and real-time leaderboards.
                    </motion.p>

                    <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
                        <Link to="/register">
                            <Button size="lg" variant="primary">
                                Get Started Free <ArrowRight size={20} />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="outline">
                                Login to Dashboard
                            </Button>
                        </Link>
                    </motion.div>
                </motion.section>

                {/* Feature Grid */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: 1200, padding: 'var(--space-8) var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}
                >
                    {[
                        { icon: <Shield size={24} />, title: 'Secure & Distraction-Free', text: 'Full-screen mode and strict timers ensure completely focused exams.' },
                        { icon: <CheckCircle size={24} />, title: 'Auto Evaluation', text: 'Instant results, detailed analytics, and intelligent subjective grading workflows.' },
                        { icon: <BarChart size={24} />, title: 'Real-Time Leaderboard', text: 'Dynamic ranks updated live with beautiful top 3 badges.' }
                    ].map((feature, i) => (
                        <div key={i} className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '1.25rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>{feature.text}</p>
                        </div>
                    ))}
                </motion.section>
            </main>
        </div>
    );
};
