import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Overlay } from './Overlay';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: number;
}

export const Modal: React.FC<ModalProps> = ({ show, onClose, title, children, maxWidth = 500 }) => {
    return (
        <Overlay show={show} onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-panel"
                style={{
                    width: '90%',
                    maxWidth,
                    padding: 'var(--space-4)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    {title && <h3 style={{ margin: 0 }}>{title}</h3>}
                    <button
                        onClick={onClose}
                        style={{
                            color: 'var(--color-text-muted)',
                            padding: 8,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div>{children}</div>
            </motion.div>
        </Overlay>
    );
};
