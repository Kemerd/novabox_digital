import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export function Input({ label, error, icon, ...props }: InputProps) {
    const inputStyles: React.CSSProperties = {
        width: '100%',
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        background: 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${error ? theme.colors.error : theme.colors.accent1}`,
        borderRadius: '8px',
        color: theme.colors.primary,
        fontFamily: theme.typography.fonts.body,
        fontSize: theme.typography.sizes.body.regular,
        transition: theme.animations.transition,
    };

    const labelStyles: React.CSSProperties = {
        display: 'block',
        marginBottom: theme.spacing.xs,
        color: theme.colors.accent2,
        fontSize: theme.typography.sizes.body.small,
    };

    return (
        <div>
            {label && <label style={labelStyles}>{label}</label>}
            <div style={{ position: 'relative' }}>
                <motion.input
                    style={inputStyles}
                    whileFocus={{
                        border: `1px solid ${theme.colors.accent3}`,
                        background: 'rgba(255, 255, 255, 0.1)',
                    }}
                    {...props}
                />
                {icon && (
                    <div style={{
                        position: 'absolute',
                        right: theme.spacing.sm,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: theme.colors.accent2,
                    }}>
                        {icon}
                    </div>
                )}
            </div>
            {error && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        color: theme.colors.error,
                        fontSize: theme.typography.sizes.body.small,
                        marginTop: theme.spacing.xs,
                        display: 'block',
                    }}
                >
                    {error}
                </motion.span>
            )}
        </div>
    );
} 