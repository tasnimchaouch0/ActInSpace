'use client';

import { useRef } from 'react';
import { useGLTF, useAnimations, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MongiCharacter({
    isSpeaking = false,
}: {
    isSpeaking?: boolean;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF('/model.glb');
    const { actions } = useAnimations(animations, groupRef);

    // Keep the animations as requested
    useFrame((state) => {
        if (groupRef.current) {
            // Gentle floating
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;

            const targetX = (state.mouse.x * 0.2);
            const targetY = (state.mouse.y * 0.1);

            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.05);

            if (isSpeaking) {
                groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 8) * 0.03;
            }
        }
    });

    return (
        <Center>
            <group ref={groupRef} scale={0.2}>
                <primitive object={scene} />
            </group>
        </Center>
    );
}

useGLTF.preload('/model.glb');
