"use client";

import React from "react";
import { Mesh, Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";

type RotatingModelProps = {
    fileUrl: string;
    scale: number;
    rotationFactor?: number;
    className?: string;
    mouseRotation?: boolean;
    enableZoom?: boolean;
    clickable?: boolean;
};

export function RotatingModel({ fileUrl, scale, rotationFactor = 5, className = "", mouseRotation = true, enableZoom = false, clickable = false }: RotatingModelProps) {
    const mesh = React.useRef<Mesh>(null!);
    const fbx = useFBX(fileUrl);
    const [rotation, setRotation] = React.useState(new Vector3());

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!mesh.current) return;

        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nx = (x / rect.width) * 2 - 1;
        const ny = -((y / rect.height) * 2 - 1);

        setRotation(new Vector3(-ny * Math.PI / rotationFactor, nx * Math.PI / rotationFactor, 0));
    };

    return (
        <div className={`flex justify-center items-center ${className}`} onMouseMove={mouseRotation ? handleMouseMove : undefined} >
            <Canvas className="w-full h-full">
                <mesh ref={mesh} scale={scale} rotation={[rotation.x, rotation.y, rotation.z]}>
                    <primitive object={fbx} />
                </mesh>

                <ambientLight />
                <pointLight position={[1, 1, 1]} />
                <OrbitControls enableRotate enableZoom={enableZoom} enabled={clickable} />
            </Canvas>
        </div>
    );
}