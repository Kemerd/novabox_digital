import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '~/styles/theme';
import { animations } from '~/styles/animations';

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

const modalStyles = {
    overlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    content: {
        background: theme.colors.background,
        borderRadius: '16px',
        padding: theme.spacing.xl,
        maxWidth: '800px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative' as const,
        border: `1px solid ${theme.colors.accent1}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    closeButton: {
        position: 'absolute' as const,
        top: theme.spacing.md,
        right: theme.spacing.md,
        background: 'transparent',
        border: 'none',
        color: theme.colors.accent2,
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: theme.spacing.xs,
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: theme.colors.primary,
        fontSize: theme.typography.sizes.heading.h2,
        marginBottom: theme.spacing.lg,
        fontWeight: theme.typography.weights.bold,
    },
    text: {
        color: theme.colors.accent2,
        fontSize: theme.typography.sizes.body.regular,
        lineHeight: '1.6',
        '& p': {
            marginBottom: theme.spacing.md,
        },
    },
};

export function PolicyModal({ isOpen, onClose, title, content }: PolicyModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    style={modalStyles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        style={modalStyles.content}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.button
                            style={modalStyles.closeButton}
                            onClick={onClose}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ×
                        </motion.button>
                        <h2 style={modalStyles.title}>{title}</h2>
                        <div
                            style={modalStyles.text}
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 