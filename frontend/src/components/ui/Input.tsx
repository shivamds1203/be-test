import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = '', ...props }, ref) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%' }}>
                {label && (
                    <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' }}>
                        {label}
                    </label>
                )}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    {icon && (
                        <div style={{ position: 'absolute', left: 14, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={className}
                        style={{
                            padding: '12px 16px',
                            paddingLeft: icon ? '44px' : '16px',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
                            background: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            fontSize: '16px',
                            outline: 'none',
                            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                            width: '100%',
                            fontFamily: 'inherit'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-primary)';
                            e.target.style.boxShadow = `0 0 0 3px rgba(79, 70, 229, 0.15)`;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)';
                            e.target.style.boxShadow = 'none';
                        }}
                        {...props}
                    />
                </div>
                {error && <span style={{ fontSize: '12px', color: 'var(--color-danger)' }}>{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
