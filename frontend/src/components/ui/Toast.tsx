import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle size={18} color="var(--color-success)" />,
        error: <AlertCircle size={18} color="var(--color-danger)" />,
        info: <Info size={18} color="var(--color-accent)" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="glass-panel"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '12px 16px',
                minWidth: 280,
                maxWidth: 400,
                pointerEvents: 'auto',
                boxShadow: 'var(--shadow-lg)',
                borderLeft: `4px solid ${type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-danger)' : 'var(--color-accent)'}`,
            }}
        >
            {icons[type]}
            <p style={{ flex: 1, fontSize: 14, fontWeight: 500, margin: 0 }}>{message}</p>
            <button onClick={onClose} style={{ color: 'var(--color-text-muted)', padding: 4 }}>
                <X size={16} />
            </button>
        </motion.div>
    );
};
