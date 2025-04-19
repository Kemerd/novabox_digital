import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, Float, useGLTF, Environment } from '@react-three/drei';
import { useRef, Suspense, useEffect, useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion-3d';
import type { Group } from 'three';
import { GroupProps } from '@react-three/fiber';
import { EnvironmentContext } from './EnvironmentContext';
import { Model } from './Model';

// Custom hook to get scroll position
function useScrollPosition() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return scrollY;
}

function EnvironmentLoader() {
    const { setReady } = useContext(EnvironmentContext);
    const { scene } = useThree();

    useEffect(() => {
        let frameId: number;
        const checkEnv = () => {
            if (scene.environment || scene.background) {
                setReady(true);
                return;
            }
            frameId = requestAnimationFrame(checkEnv);
        };
        checkEnv();
        return () => cancelAnimationFrame(frameId);
    }, [scene, setReady]);

    return (
        <Environment
            files="potsdamer_platz_1k.hdr"
            path="/assets/env/"
        />
    );
}

export default function Scene() {
    // Increased spacing constants
    const EXPLOSION_DISTANCE = 48;
    const BASE_Y_OFFSET = 8;
    const Y_SPACING = 0;
    const Z_OFFSET = 4;
    const X_OFFSET = 8;

    const [environmentReady, setEnvironmentReady] = useState(false);
    const contextValue = {
        isReady: environmentReady,
        setReady: setEnvironmentReady
    };

    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            camera={{
                position: [0, 4, 25],
                fov: 45
            }}
            resize={{ scroll: false }}
        >
            <Stage intensity={0.6}>
                <EnvironmentContext.Provider value={contextValue}>
                    <Suspense fallback={null}>
                        <EnvironmentLoader />
                        <Model
                            path="/models/1by1.glb"
                            position={[-EXPLOSION_DISTANCE + X_OFFSET, BASE_Y_OFFSET, -Z_OFFSET]}
                            rotation={[0, Math.PI / 4, 0]}
                            initialRotation={[0, 0, 0]}
                            scale={[2, 2, 2]}
                        />
                        <Model
                            path="/models/2by1.glb"
                            position={[0 + X_OFFSET, BASE_Y_OFFSET + Y_SPACING, 0]}
                            rotation={[0, 0, 0]}
                            initialRotation={[0, 0, 0]}
                            scale={[2, 2, 2]}
                        />
                        <Model
                            path="/models/3by2.glb"
                            position={[EXPLOSION_DISTANCE + X_OFFSET, BASE_Y_OFFSET + (Y_SPACING * 2), Z_OFFSET]}
                            rotation={[0, -Math.PI / 4, 0]}
                            initialRotation={[0, 0, 0]}
                            scale={[2, 2, 2]}
                        />
                    </Suspense>
                </EnvironmentContext.Provider>
            </Stage>
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2}
            />
        </Canvas>
    );
} 