import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    style,
    children,
    ...props
}) => {
    const baseStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-heading)',
        transition: 'background-color var(--transition-fast), color var(--transition-fast)',
        gap: 'var(--space-1)',
        position: 'relative' as const,
        overflow: 'hidden' as const,
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            boxShadow: 'var(--shadow-indigo)',
        },
        secondary: {
            backgroundColor: 'var(--color-secondary)',
            color: '#fff',
            boxShadow: 'var(--shadow-purple)',
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            border: '2px solid var(--color-border)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--color-text-muted)',
        }
    };

    const sizes = {
        sm: { padding: '8px 16px', fontSize: '14px' },
        md: { padding: '12px 24px', fontSize: '16px' },
        lg: { padding: '16px 32px', fontSize: '18px' }
    };

    return (
        <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ ...baseStyles, ...variants[variant], ...sizes[size], ...style }}
            className={className}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ width: 20, height: 20, border: '2px solid transparent', borderTopColor: 'currentColor', borderRadius: '50%' }}
                />
            ) : children}
        </motion.button>
    );
};
