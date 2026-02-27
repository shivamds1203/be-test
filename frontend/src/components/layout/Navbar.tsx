import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Moon, Sun, LayoutDashboard, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 'var(--z-header)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                padding: 'var(--space-2) var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 18
                }}>
                    E
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    be-<span className="text-gradient">test</span>
                </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <button
                    onClick={toggleTheme}
                    style={{
                        padding: 8,
                        borderRadius: '50%',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text)'
                    }}
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {user ? (
                    <>
                        <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                            <Button variant="ghost" size="sm">
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut size={18} />
                            Logout
                        </Button>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Log In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm">Sign Up</Button>
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
};
