import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OverlayProps {
    show: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    zIndex?: number;
}

export const Overlay: React.FC<OverlayProps> = ({ show, onClick, children, zIndex = 1000 }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClick}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        zIndex,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
