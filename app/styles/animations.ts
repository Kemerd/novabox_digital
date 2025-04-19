import { theme } from './theme';

/**
 * Core Animation Configurations
 * Inspired by Apple's fluid motion design principles
 */
export const animations = {
    // Spring configurations for natural motion
    springs: {
        // Gentle spring for subtle interactions
        soft: {
            type: "spring",
            stiffness: 170,
            damping: 26,
            mass: 1,
        },
        // Snappy spring for primary actions
        responsive: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
        },
        // Dramatic spring for hero elements
        dramatic: {
            type: "spring",
            stiffness: 125,
            damping: 20,
            mass: 1,
        }
    },

    // Transition presets
    transitions: {
        // Smooth fade for subtle elements
        fade: {
            duration: 0.5,
            ease: [0.32, 0.72, 0, 1],
        },
        // Quick response for interactive elements
        quick: {
            duration: 0.2,
            ease: [0.32, 0.72, 0, 1],
        },
        // Dramatic entrance for hero sections
        hero: {
            duration: 0.8,
            ease: [0.32, 0.72, 0, 1],
        }
    },

    // Hover effects
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.2,
            ease: [0.32, 0.72, 0, 1],
        }
    }
}; 