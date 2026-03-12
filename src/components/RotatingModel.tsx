/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Mesh, Vector3 } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";

const ROTATE_SPEED_X = 0;
const ROTATE_SPEED_Y = 0.001;

type RotatingModelProps = {
    fileUrl: string;
    scale: number;
    title: string;
    description: string;
    color?: string
    rotationFactor?: number;
    className?: string;
    mouseRotation?: boolean;
    enableZoom?: boolean;
    clickable?: boolean;
    style?: React.CSSProperties;
};

type RotatingMeshProps = {
    fileUrl: string;
    scale: number;
    rotation: Vector3;
    mesh: React.RefObject<Mesh>;
};

function RotatingMesh({ fileUrl, scale, rotation, mesh }: RotatingMeshProps) {
    const fbx = useFBX(fileUrl);

    useFrame(() => {
        if (!mesh.current) return;
        mesh.current.rotation.x += ROTATE_SPEED_X;
        mesh.current.rotation.y += ROTATE_SPEED_Y;
    });

    React.useEffect(() => {
        if (!mesh.current) return;
        mesh.current.rotation.x = rotation.x;
        mesh.current.rotation.y = rotation.y;
        mesh.current.rotation.z = rotation.z;
    }, [rotation, mesh]);

    return (
        <mesh ref={mesh} scale={scale}>
            <primitive object={fbx} />
        </mesh>
    );
}

/**
 * Displays a 3D FBX model with optional mouse-driven rotation and descriptive text.
 */
export function RotatingModel({
    fileUrl,
    scale,
    title,
    description,
    color = "#a374ff",
    rotationFactor = 20,
    className = "",
    mouseRotation = true,
    enableZoom = false,
    clickable = false,
    style
}: RotatingModelProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const mesh = React.useRef<Mesh>(null);
    const [rotation, setRotation] = React.useState(new Vector3(0, 0, 0));

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!mesh.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const nx = (x / rect.width) * 2 - 1;
        const ny = -((y / rect.height) * 2 - 1);

        setRotation(new Vector3(-ny * Math.PI / rotationFactor, nx * Math.PI / rotationFactor, 0));
    };

    const handleMouseLeave = () => {
        if (!mesh.current) return;
        setRotation(new Vector3(0, 0, 0));
    };

    return (
        <div
            style={style}
            ref={containerRef}
            className={`flex flex-row gap-10 justify-center items-center overflow-visible ${className}`}
            onMouseMove={mouseRotation ? handleMouseMove : undefined}
            onMouseLeave={mouseRotation ? handleMouseLeave : undefined}
        >
            <div className="w-55 h-75">
                <Canvas>
                    <RotatingMesh
                        fileUrl={fileUrl}
                        scale={scale}
                        rotation={rotation}
                        mesh={mesh}
                    />
                    <ambientLight />
                    <pointLight position={[-3, 2, 2]} intensity={15} />
                    <OrbitControls enableRotate autoRotate autoRotateSpeed={10} enableZoom={enableZoom} enabled={clickable} />
                </Canvas>
            </div>

            <div className="w-full h-full text-left flex flex-col justify-start items-start gap-2">
                <h3 className="text-4xl font-bold uppercase" style={{ color }}>
                    {title}
                </h3>
                <p className="text-3xl font-light leading-snug tracking-wide">
                    {description}
                </p>
            </div>
        </div>
    );
}
