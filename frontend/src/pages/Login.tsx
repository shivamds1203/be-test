import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const isGoogleConfigured = process.env.REACT_APP_GOOGLE_CLIENT_ID && process.env.REACT_APP_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' && process.env.REACT_APP_GOOGLE_CLIENT_ID !== 'dummy-client-id';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock API Call
        setTimeout(() => {
            // Determine role by email check OR explicitly selected role toggle
            const finalRole = email.includes('admin') ? 'ADMIN' : role;
            login({ id: '1', name: 'Demo User', email, role: finalRole, token: 'mock-jwt' });
            navigate(finalRole === 'ADMIN' ? '/admin' : '/dashboard');
            setLoading(false);
        }, 1000);
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        console.log("Google Login Token:", credentialResponse.credential);
        setLoading(true);
        setTimeout(() => {
            login({ id: '1g', name: 'Google User', email: 'google@example.com', role: role, token: 'mock-jwt-google' });
            navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
            setLoading(false);
        }, 1000);
    };

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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <label style={{ fontSize: 14, fontWeight: 500 }}>Login as...</label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <Button
                                    type="button"
                                    variant={role === 'STUDENT' ? 'primary' : 'outline'}
                                    onClick={() => setRole('STUDENT')}
                                    style={{ flex: 1 }}
                                >
                                    Student
                                </Button>
                                <Button
                                    type="button"
                                    variant={role === 'ADMIN' ? 'primary' : 'outline'}
                                    onClick={() => setRole('ADMIN')}
                                    style={{ flex: 1 }}
                                >
                                    Teacher / Admin
                                </Button>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" isLoading={loading} style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                            Sign In
                        </Button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-4) 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                        <span style={{ margin: '0 12px', fontSize: 12, color: 'var(--color-text-muted)' }}>OR</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {isGoogleConfigured ? (
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => console.log('Login Failed')}
                            />
                        ) : (
                            <Button variant="outline" type="button" onClick={() => handleGoogleSuccess({ credential: 'mock-google-token' })} style={{ width: '100%', display: 'flex', gap: 8, justifyContent: 'center' }}>
                                Sign in with Google (Preview Mode)
                            </Button>
                        )}
                    </div>

                    <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 14, color: 'var(--color-text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Sign up</Link>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
};
