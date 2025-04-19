import { useRef, useEffect, useState, useContext, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import type { Group } from 'three';
import { GroupProps } from '@react-three/fiber';
import { EnvironmentContext } from './EnvironmentContext';
import { useScrollPosition } from './hooks/useScrollPosition';

export type ModelProps = {
    path: string;
    position: [number, number, number];
    rotation: [number, number, number];
    initialRotation: [number, number, number];
    scale?: [number, number, number];
};

export function Model({ path, position, rotation, initialRotation, scale = [2, 2, 2] }: ModelProps) {
    const { scene } = useGLTF(path);
    const groupRef = useRef<Group>(null);
    const scrollY = useScrollPosition();
    const [currentRotation] = useState(() => [...rotation]);
    const lastScrollY = useRef(0);
    const [isModelReady, setIsModelReady] = useState(false);
    const { isReady: isEnvironmentReady } = useContext(EnvironmentContext);

    useEffect(() => {
        if (scene && !isModelReady) {
            setIsModelReady(true);
        }
    }, [scene]);

    const isReady = isModelReady && isEnvironmentReady;

    const finalPosition = useMemo(() => {
        return isReady ? position : [position[0], position[1] - 5, position[2]] as [number, number, number];
    }, [isReady, position]);

    useFrame((state, delta) => {
        if (groupRef.current && isReady) {
            const targetRotation = (scrollY * 0.002) + rotation[1];
            const smoothedRotation = lastScrollY.current + (targetRotation - lastScrollY.current) * 0.1;
            lastScrollY.current = smoothedRotation;
            groupRef.current.rotation.y = smoothedRotation;
        }
    });

    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
        >
            <motion.group
                ref={groupRef as unknown as React.RefObject<GroupProps>}
                position={finalPosition}
                rotation={[rotation[0], currentRotation[1], rotation[2]]}
                initial={{
                    scale: 0.8,
                    opacity: 0,
                    y: position[1] - 10
                }}
                animate={{
                    scale: isReady ? 1 : 0.8,
                    opacity: isReady ? 1 : 0,
                    y: isReady ? position[1] : position[1] - 5
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 1
                }}
            >
                <primitive
                    object={scene}
                    scale={scale}
                    rotation={[-Math.PI / 4, Math.PI, 0]}
                />
            </motion.group>
        </Float>
    );
} 