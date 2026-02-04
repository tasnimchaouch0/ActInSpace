// @ts-nocheck
'use client';

import { useRef, useLayoutEffect, Suspense } from 'react';
import { useGLTF, useAnimations, Center, OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { useFrame, Canvas } from '@react-three/fiber';
import * as THREE from 'three';

// Farm background component
export function FarmBackground() {
    return (
        <>
            {/* Sky gradient background */}
            <color attach="background" args={['#87CEEB']} />
            <fog attach="fog" args={['#87CEEB', 10, 50]} />

            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <hemisphereLight args={['#87CEEB', '#6B8E23', 0.5]} />

            {/* Ground - farm field */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#6B8E23" roughness={0.8} />
            </mesh>

            {/* Olive trees in background */}
            {[-8, -4, 4, 8].map((x, i) => (
                <group key={i} position={[x, -1, -8]}>
                    {/* Tree trunk */}
                    <mesh position={[0, 1, 0]} castShadow>
                        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
                        <meshStandardMaterial color="#8B4513" />
                    </mesh>
                    {/* Tree foliage */}
                    <mesh position={[0, 2.5, 0]} castShadow>
                        <sphereGeometry args={[1.2, 8, 8]} />
                        <meshStandardMaterial color="#556B2F" />
                    </mesh>
                </group>
            ))}

            {/* Additional scattered trees */}
            {[[-6, -6], [6, -6], [-3, -10], [3, -10]].map(([x, z], i) => (
                <group key={`tree-${i}`} position={[x, -1, z]}>
                    <mesh position={[0, 1, 0]} castShadow>
                        <cylinderGeometry args={[0.15, 0.25, 1.8, 8]} />
                        <meshStandardMaterial color="#8B4513" />
                    </mesh>
                    <mesh position={[0, 2.2, 0]} castShadow>
                        <sphereGeometry args={[1, 8, 8]} />
                        <meshStandardMaterial color="#556B2F" />
                    </mesh>
                </group>
            ))}
        </>
    );
}


// Internal model component that uses R3F hooks
export function MongiModel({
    isSpeaking = false,
}: {
    isSpeaking?: boolean;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF('/model.glb?v=3');
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
        console.log('=== MODEL LOADING DEBUG ===');
        console.log('Scene loaded:', scene);

        const meshes: THREE.Mesh[] = [];
        let totalMeshCount = 0;

        scene.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
                totalMeshCount++;
                const mesh = obj as THREE.Mesh;
                console.log(`Mesh ${totalMeshCount}:`, obj.name || 'unnamed');
                console.log('  - Has morphTargetInfluences:', !!mesh.morphTargetInfluences);
                console.log('  - morphTargetDictionary:', mesh.morphTargetDictionary);

                if (mesh.morphTargetInfluences) {
                    meshes.push(mesh);
                }
            }
        });

        console.log(`Total meshes found: ${totalMeshCount}`);
        console.log(`Meshes with morph targets: ${meshes.length}`);
        console.log('=== END DEBUG ===');

        morphMeshes.current = meshes;
    }, [scene]);

    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;

            // Force arms to stay down in all states
            scene.traverse((obj) => {
                const name = obj.name.toLowerCase();
                // Target shoulder and upper arm bones specifically
                if (name.includes('leftarm') || name.includes('leftshoulder') || name.includes('left_arm')) {
                    obj.rotation.z = 1.25; // Points arm down
                    obj.rotation.x = 0;
                    obj.rotation.y = 0;
                } else if (name.includes('rightarm') || name.includes('rightshoulder') || name.includes('right_arm')) {
                    obj.rotation.z = -1.25; // Points arm down
                    obj.rotation.x = 0;
                    obj.rotation.y = 0;
                }
                // Zero out elbows, wrists, and hands to keep arms straight
                else if (name.includes('forearm') || name.includes('hand') || name.includes('wrist') || name.includes('elbow')) {
                    obj.rotation.set(0, 0, 0);
                }
            });

            if (isSpeaking) {
                // No floating - keep Y position stable
                groupRef.current.position.y = 0;

                // Head bobbing and slight rotation when speaking
                const headBob = Math.sin(time * 3) * 0.08;
                const headTilt = Math.sin(time * 2.5) * 0.04;
                groupRef.current.rotation.y = headBob;
                groupRef.current.rotation.z = headTilt * 0.5;
                groupRef.current.rotation.x = Math.sin(time * 2) * 0.03;

                // Enhanced mouth movement with more variation
                morphMeshes.current.forEach((mesh) => {
                    if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
                        const mouthIndices = [
                            mesh.morphTargetDictionary['mouthOpen'],
                            mesh.morphTargetDictionary['Mouth_Open'],
                            mesh.morphTargetDictionary['MouthOpen'],
                            mesh.morphTargetDictionary['jawOpen'],
                            mesh.morphTargetDictionary['Jaw_Open'],
                            mesh.morphTargetDictionary['viseme_aa'],
                            mesh.morphTargetDictionary['viseme_O']
                        ].filter(index => index !== undefined);

                        mouthIndices.forEach(index => {
                            // Reduced mouth opening (max 0.3)
                            const mouthValue = 0.1 +
                                Math.sin(time * 10) * 0.1 +
                                Math.sin(time * 15) * 0.08;

                            mesh.morphTargetInfluences![index] = THREE.MathUtils.lerp(
                                mesh.morphTargetInfluences![index],
                                Math.max(0, Math.min(0.3, mouthValue)),
                                0.25
                            );
                        });
                    }
                });

            } else {
                // No floating when not speaking
                groupRef.current.position.y = 0;

                const targetX = (state.mouse.x * 0.15);
                const targetY = (state.mouse.y * 0.08);

                groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
                groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.05);
                groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.05);

                // Smoothly reset mouth
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
            <group ref={groupRef} scale={1.2}>
                <primitive object={scene} />
            </group>
        </Center>
    );
}

// Default export is a standalone component with its own Canvas
export default function MongiCharacter(props: { isSpeaking?: boolean }) {
    return (
        <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 35 }}
                gl={{ antialias: true }}
            >
                <Suspense fallback={null}>
                    <FarmBackground />
                    <MongiModel {...props} />
                    <ContactShadows
                        position={[0, -1.5, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2}
                        far={10}
                    />
                    <Environment preset="city" />
                    <OrbitControls
                        enableZoom={false}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

// useGLTF.preload('/model.glb');
