import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';
import { animations } from '~/styles/animations';

interface CardProps {
    children: React.ReactNode;
    variant?: 'glass' | 'solid';
    className?: string;
    style?: React.CSSProperties;
}

export function Card({ children, variant = 'solid', className, style }: CardProps) {
    const baseStyles: React.CSSProperties = {
        background: variant === 'glass'
            ? 'rgba(255, 255, 255, 0.1)'
            : theme.colors.background,
        backdropFilter: variant === 'glass' ? 'blur(10px)' : undefined,
        borderRadius: '16px',
        border: `1px solid ${theme.colors.accent1}`,
        padding: theme.spacing.lg,
        ...style,
    };

    return (
        <motion.div
            className={className}
            style={baseStyles}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={animations.transitions.quick}
            whileHover={animations.hover}
        >
            {children}
        </motion.div>
    );
} 