import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, user } = useAuth();
    const { showToast } = useUI();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signIn(email, password);
            showToast('Welcome back! 👋', 'success');
            // Role detection happens via AuthContext observer
        } catch (error: any) {
            console.error(error);
            let msg = 'Failed to sign in';
            if (error.code === 'auth/user-not-found') msg = 'No user found with this email';
            if (error.code === 'auth/wrong-password') msg = 'Incorrect password';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Redirect after successful login (handled in effect or by context)
    React.useEffect(() => {
        if (user) {
            navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
        }
    }, [user, navigate]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>

            <Link to="/" style={{ position: 'absolute', top: 32, left: 32, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)' }}>
                <ArrowLeft size={20} /> Back to Home
            </Link>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} style={{ width: '100%', maxWidth: 400 }}>
                <GlassCard hoverEffect={false}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-1)' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" variant="primary" isLoading={loading} style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                            Sign In
                        </Button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 14, color: 'var(--color-text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Sign up</Link>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
};
