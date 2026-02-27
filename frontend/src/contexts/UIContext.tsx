import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast, ToastType } from '../components/ui/Toast';

interface ToastState {
    id: number;
    message: string;
    type: ToastType;
}

interface UIContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastState[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const hideToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <UIContext.Provider value={{ showToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                zIndex: 2000,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                pointerEvents: 'none',
            }}>
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={() => hideToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within UIProvider');
    return context;
};
