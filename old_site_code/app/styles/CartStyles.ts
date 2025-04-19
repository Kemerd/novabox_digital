import { theme } from './theme';

export const CartStyles = {
    // Container styles
    container: {
        background: theme.colors.background,
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.spacing.lg,
    },

    // Line item styles
    lineItem: {
        display: 'grid',
        gridTemplateColumns: '100px 1fr auto',
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        border: `1px solid ${theme.colors.accent1}`,
        transition: theme.animations.transition,
    },

    // Product image container
    imageContainer: {
        borderRadius: '8px',
        overflow: 'hidden',
        aspectRatio: '1/1',
    },

    // Product details
    productDetails: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.spacing.xs,
    },

    // Product title
    productTitle: {
        fontFamily: theme.typography.fonts.hero,
        fontSize: theme.typography.sizes.body.large,
        color: theme.colors.primary,
        textDecoration: 'none',
    },

    // Product options
    optionsList: {
        listStyle: 'none',
        padding: 0,
        margin: `${theme.spacing.xs} 0`,
        display: 'flex',
        gap: theme.spacing.sm,
        flexWrap: 'wrap' as const,
    },

    optionItem: {
        fontSize: theme.typography.sizes.body.small,
        color: theme.colors.accent2,
        background: 'rgba(255, 255, 255, 0.05)',
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: '6px',
    },

    // Quantity controls
    quantityControls: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },

    quantityButton: {
        background: 'transparent',
        border: `1px solid ${theme.colors.accent1}`,
        color: theme.colors.primary,
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: theme.animations.transition,
    },

    // Price display
    price: {
        fontFamily: theme.typography.fonts.hero,
        fontSize: theme.typography.sizes.body.large,
        color: theme.colors.primary,
    },
}; 