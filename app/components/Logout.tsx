import { Form } from '@remix-run/react';
import { theme } from '~/styles/theme';

/**
 * Logout component with Apple-inspired styling
 * Renders a form with a submit button that posts to the logout endpoint
 */
export function Logout({
    style
}: {
    style?: React.CSSProperties
}) {
    // Default styles that can be overridden through props
    const defaultStyles: React.CSSProperties = {
        background: 'rgba(255, 77, 77, 0.1)',
        color: '#ff4d4d',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        borderRadius: '8px',
        fontSize: theme.typography.sizes.body.small,
        fontWeight: theme.typography.weights.medium,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    };

    const mergedStyles = { ...defaultStyles, ...style };

    return (
        <Form action="/account/logout" method="post">
            <button
                type="submit"
                style={mergedStyles}
            >
                Sign out
            </button>
        </Form>
    );
} 