import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '~/styles/theme';
import { animations } from '~/styles/animations';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

/**
 * Premium Button Component
 * Follows Apple's Human Interface Guidelines for interactive elements
 */
export function Button({
    children,
    variant = 'primary',
    size = 'medium',
    isLoading,
    icon,
    ...props
}: ButtonProps) {
    const getButtonStyles = () => {
        const baseStyles = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            borderRadius: '12px',
            fontFamily: theme.typography.fonts.body,
            fontWeight: theme.typography.weights.medium,
            transition: theme.animations.transition,
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
        };

        const sizeStyles = {
            small: {
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                fontSize: theme.typography.sizes.body.small,
            },
            medium: {
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                fontSize: theme.typography.sizes.body.regular,
            },
            large: {
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                fontSize: theme.typography.sizes.body.large,
            },
        };

        const variantStyles = {
            primary: {
                background: theme.colors.gradient.accent,
                color: theme.colors.primary,
                boxShadow: '0 4px 12px rgba(70, 130, 180, 0.2)',
            },
            secondary: {
                background: 'rgba(113, 121, 126, 0.1)',
                color: theme.colors.accent2,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.colors.accent1}`,
            },
            ghost: {
                background: 'transparent',
                color: theme.colors.accent2,
            },
        };

        return {
            ...baseStyles,
            ...sizeStyles[size],
            ...variantStyles[variant],
        };
    };

    return (
        <motion.button
            style={getButtonStyles()}
            whileHover={animations.hover}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={animations.transitions.quick}
            disabled={isLoading}
            {...props}
        >
            {icon && <span className="icon">{icon}</span>}
            {isLoading ? (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    ◌
                </motion.div>
            ) : (
                children
            )}
        </motion.button>
    );
} 