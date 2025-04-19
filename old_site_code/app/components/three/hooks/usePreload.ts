import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

const MODEL_PATHS = [
    '/models/1by1.glb',
    '/models/2by1.glb',
    '/models/3by2.glb'
];

export function usePreload() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function preloadAssets() {
            try {
                // Preload models
                MODEL_PATHS.forEach(path => useGLTF.preload(path));

                // Preload HDR (just trigger the fetch)
                await fetch('/assets/env/potsdamer_platz_1k.hdr');

                setIsLoading(false);
            } catch (error) {
                console.error('Error preloading assets:', error);
                // Still set loading to false to not block the UI
                setIsLoading(false);
            }
        }

        preloadAssets();
    }, []);

    return isLoading;
} 