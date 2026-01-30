'use client';

import { useRef, useLayoutEffect } from 'react';
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

    useLayoutEffect(() => {
        scene.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh;
                if (mesh.material) {
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    // Ensure materials are updated and reactive to light
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach(mat => {
                            mat.needsUpdate = true;
                        });
                    } else {
                        mesh.material.needsUpdate = true;
                    }
                }
            }
        });
    }, [scene]);

    // Cached meshes for performance
    const morphMeshes = useRef<THREE.Mesh[]>([]);

    useLayoutEffect(() => {
        const meshes: THREE.Mesh[] = [];
        scene.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh && (obj as THREE.Mesh).morphTargetInfluences) {
                meshes.push(obj as THREE.Mesh);
            }
        });
        morphMeshes.current = meshes;
    }, [scene]);

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

                // Open mouth on cached meshes
                morphMeshes.current.forEach((mesh) => {
                    if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
                        const mouthIndices = [
                            mesh.morphTargetDictionary['mouthOpen'],
                            mesh.morphTargetDictionary['Mouth_Open'],
                            mesh.morphTargetDictionary['MouthOpen'],
                            mesh.morphTargetDictionary['jawOpen'],
                            mesh.morphTargetDictionary['Jaw_Open']
                        ].filter(index => index !== undefined);

                        mouthIndices.forEach(index => {
                            mesh.morphTargetInfluences![index] = THREE.MathUtils.lerp(
                                mesh.morphTargetInfluences![index],
                                0.5 + Math.sin(state.clock.elapsedTime * 15) * 0.5,
                                0.2
                            );
                        });
                    }
                });
            } else {
                // Smoothly reset mouth on cached meshes
                morphMeshes.current.forEach((mesh) => {
                    if (mesh.morphTargetInfluences) {
                        Object.values(mesh.morphTargetDictionary || {}).forEach(index => {
                            mesh.morphTargetInfluences![index] = THREE.MathUtils.lerp(
                                mesh.morphTargetInfluences![index],
                                0,
                                0.1
                            );
                        });
                    }
                });
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

// useGLTF.preload('/model.glb');
