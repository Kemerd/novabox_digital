import { motion } from 'framer-motion';
import { theme } from '../styles/theme';

export default function LoadingSpinner() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                color: theme.colors.accent2,
            }}
        >
            <motion.div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                }}
            >
                <motion.div
                    style={{
                        width: '40px',
                        height: '40px',
                        border: `2px solid ${theme.colors.accent1}`,
                        borderTopColor: theme.colors.accent3,
                        borderRadius: '50%',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        fontFamily: theme.typography.fonts.display.light,
                        fontSize: theme.typography.sizes.body.small,
                    }}
                >
                    Loading 3D Experience...
                </motion.p>
            </motion.div>
        </motion.div>
    );
} 