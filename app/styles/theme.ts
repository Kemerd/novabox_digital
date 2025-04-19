/**
 * Luxury Dark Theme Configuration
 * Inspired by high-end aerospace and premium manufacturing aesthetics
 */
export const theme = {
    colors: {
        // Primary colors
        background: '#0A0A0A', // Deep obsidian black
        primary: '#FFFFFF',    // Pure white for contrast

        // Accent colors
        accent1: '#71797E',    // Gunmetal grey
        accent2: '#C0C0C0',    // Polished silver
        accent3: '#4682B4',    // Steel blue
        accent4: '#BCC6CC',    // Metallic silver

        // Gradient colors
        gradient: {
            primary: 'linear-gradient(135deg, #0A0A0A 0%, #2C2C2C 100%)',
            accent: 'linear-gradient(135deg, #71797E 0%, #4682B4 100%)',
        },

        // Functional colors
        error: '#FF3B30',
        success: '#34C759',
        warning: '#FF9500',
    },

    typography: {
        weights: {
            thin: 100,
            extraLight: 200,
            light: 300,
            regular: 400,
            medium: 500,
            semiBold: 600,
            bold: 700,
            extraBold: 800,
            black: 900,
        },
        fonts: {
            display: {
                thin: "'InterDisplay', -apple-system, BlinkMacSystemFont, sans-serif",
                extraLight: "'InterDisplay', -apple-system, BlinkMacSystemFont, sans-serif",
                light: "'InterDisplay', -apple-system, BlinkMacSystemFont, sans-serif",
                regular: "'InterDisplay', -apple-system, BlinkMacSystemFont, sans-serif",
                medium: "'InterDisplay', -apple-system, BlinkMacSystemFont, sans-serif",
                semiBold: "'InterDisplay', -apple-system, BlinkMacSystemFont, sans-serif",
                bold: "'InterDisplay', -apple-system, BlinkMacSystemFont, sans-serif",
                extraBold: "'InterDisplay', -apple-system, BlinkMacSystemFont, sans-serif",
                black: "'InterDisplay', -apple-system, BlinkMacSystemFont, sans-serif",
            },
            text: {
                thin: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                extraLight: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                light: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                regular: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                medium: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                semiBold: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                bold: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                extraBold: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                black: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }
        },
        sizes: {
            // Following Apple's typography scale
            hero: {
                primary: '3.5rem',    // 56px - Display Bold
                secondary: '2.5rem',  // 40px - Display Medium
            },
            heading: {
                h1: '2rem',          // 32px - Display Medium
                h2: '1.75rem',       // 28px - Display Regular
                h3: '1.5rem',        // 24px - Display Regular
                h4: '1.25rem',       // 20px - Display Regular
            },
            body: {
                large: '1.125rem',   // 18px - Text Regular
                base: '1rem',        // 16px - Text Regular
                small: '0.875rem',   // 14px - Text Regular
                xs: '0.75rem',       // 12px - Text Medium
            }
        },

        lineHeight: {
            tight: 1.2,
            base: 1.5,
            relaxed: 1.75,
        },

        letterSpacing: {
            tight: '-0.02em',
            normal: '0',
            wide: '0.02em',
        }
    },

    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '4rem',
    },

    animations: {
        transition: '0.3s ease-in-out',
        springConfig: {
            tension: 280,
            friction: 60,
        },
    },
}; 