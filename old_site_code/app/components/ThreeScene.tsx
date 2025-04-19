import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion-3d';
import { theme } from '../styles/theme';
import { usePreload } from './three/hooks/usePreload';

// Lazy load the heavy components
const Scene = lazy(() => import('./three/Scene'));
const LoadingSpinner = lazy(() => import('./LoadingSpinner'));

export default function ThreeScene() {
    const isLoading = usePreload();

    return (
        <div style={{
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            transform: 'translateZ(0)',
            willChange: 'transform',
            position: 'relative',
            background: theme.colors.background,
        }}>
            <Suspense fallback={<LoadingSpinner />}>
                {isLoading ? <LoadingSpinner /> : <Scene />}
            </Suspense>
        </div>
    );
} 