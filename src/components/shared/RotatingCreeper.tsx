/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Mesh, Vector3 } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";

const ROTATE_SPEED_Y = 0.0035;
const CREEPER_URL = "/models/creeper/creeper.fbx";

type RotatingCreeperProps = {
    scale?: number;
    rotationFactor?: number;
    className?: string;
    mouseRotation?: boolean;
    autoRotate?: boolean;
    enableZoom?: boolean;
    style?: React.CSSProperties;
};

const CreeperMesh = ({
    scale,
    rotation,
    mesh,
    autoRotate,
}: {
    scale: number;
    rotation: Vector3;
    mesh: React.RefObject<Mesh | null>;
    autoRotate: boolean;
}) => {
    const fbx = useFBX(CREEPER_URL);

    useFrame(() => {
        if (!mesh.current) return;
        if (autoRotate) mesh.current.rotation.y += ROTATE_SPEED_Y;
    });

    React.useEffect(() => {
        if (!mesh.current) return;
        mesh.current.rotation.x = rotation.x;
        mesh.current.rotation.y = rotation.y;
        mesh.current.rotation.z = rotation.z;
    }, [rotation, mesh]);

    return (
        <mesh ref={mesh as any} scale={scale}>
            <primitive object={fbx} />
        </mesh>
    );
};

/**
 * Pre-wired Creeper FBX viewer with optional cursor-driven rotation.
 */
export const RotatingCreeper = ({
    scale = 0.05,
    rotationFactor = 18,
    className = "",
    mouseRotation = true,
    autoRotate = true,
    enableZoom = false,
    style,
}: RotatingCreeperProps) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const mesh = React.useRef<Mesh>(null);
    const [rotation, setRotation] = React.useState(new Vector3(0, 0, 0));

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!mesh.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

        setRotation(
            new Vector3(
                (-ny * Math.PI) / rotationFactor,
                (nx * Math.PI) / rotationFactor,
                0
            )
        );
    };

    const handleMouseLeave = () => setRotation(new Vector3(0, 0, 0));

    return (
        <div
            ref={containerRef}
            className={`w-full h-full ${className}`}
            style={style}
            onMouseMove={mouseRotation ? handleMouseMove : undefined}
            onMouseLeave={mouseRotation ? handleMouseLeave : undefined}
        >
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[-3, 4, 3]} intensity={20} color="#a374ff" />
                <pointLight position={[3, -2, 3]} intensity={10} color="#ffd074" />
                <React.Suspense fallback={null}>
                    <CreeperMesh
                        scale={scale}
                        rotation={rotation}
                        mesh={mesh}
                        autoRotate={autoRotate}
                    />
                </React.Suspense>
                <OrbitControls
                    enableRotate={enableZoom}
                    enableZoom={enableZoom}
                    enablePan={false}
                />
            </Canvas>
        </div>
    );
};
