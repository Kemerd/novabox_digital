import React, { useRef } from 'react';
import { useTheme } from '~/hooks/useTheme';

const SearchAside: React.FC = () => {
    const theme = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);

    const fetchResults = () => {
        // Implementation of fetchResults function
    };

    return (
        <input
            name="q"
            onChange={fetchResults}
            onFocus={fetchResults}
            placeholder="Search"
            ref={inputRef}
            type="search"
            list={queriesDatalistId}
            style={{
                width: '100%',
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${theme.colors.accent1}`,
                borderRadius: '8px',
                color: theme.colors.primary,
                fontSize: theme.typography.sizes.body.regular,
                outline: 'none',
                transition: theme.animations.transition,
            }}
        />
    );
};

export default SearchAside; 