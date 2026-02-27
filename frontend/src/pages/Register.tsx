import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { GoogleLogin } from '@react-oauth/google';

export const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { signUp } = useAuth();
    const { showToast } = useUI();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name) newErrors.name = 'Full name is required';
        if (!email) newErrors.email = 'Email address is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password, name, role);
            showToast('Account created successfully! 🎉', 'success');
            navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
        } catch (error: any) {
            console.error(error);
            showToast(error.message || 'Failed to create account', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ width: '100%', maxWidth: 400 }}>
                <GlassCard hoverEffect={false}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                        <img
                            src="/favicon.png"
                            alt="Logo"
                            style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 'var(--space-3)' }}
                        />
                        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-1)' }}>Create Account</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Join thousands of students and admins</p>
                    </div>

                    <form onSubmit={handleRegister} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: '' });
                            }}
                            error={errors.name}
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({ ...errors, email: '' });
                            }}
                            error={errors.email}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: '' });
                            }}
                            error={errors.password}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <label style={{ fontSize: 14, fontWeight: 500 }}>I am a...</label>
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
                            Create Account
                        </Button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 14, color: 'var(--color-text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Sign in</Link>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
};
