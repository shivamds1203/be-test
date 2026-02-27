import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
    hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    hoverEffect = true,
    className = '',
    style,
    ...props
}) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -4, scale: 1.01, boxShadow: 'var(--shadow-xl)' } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`glass-panel ${className}`}
            style={{
                padding: 'var(--space-4)',
                ...style
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};
