/* eslint-disable react-hooks/immutability */
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
};

type RotatingMeshProps = {
    fbx: any;
    scale: number;
    rotation: Vector3;
    setRotation: (v: Vector3) => void;
    mouseRotation: boolean;
    mesh: React.RefObject<Mesh>;
};

function RotatingMesh({ fbx, scale, rotation, setRotation, mouseRotation, mesh }: RotatingMeshProps) {
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

export function RotatingModel({
    fileUrl,
    scale,
    title,
    description,
    color = "#a374ff",
    rotationFactor = 5,
    className = "",
    mouseRotation = true,
    enableZoom = false,
    clickable = false
}: RotatingModelProps) {
    const mesh = React.useRef<Mesh>(null);
    const fbx = useFBX(fileUrl);
    const [rotation, setRotation] = React.useState(new Vector3(Math.PI / 4, Math.PI / 4, 0));
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!mesh.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const nx = (x / rect.width) * 2 - 1;
        const ny = -((y / rect.height) * 2 - 1);

        setRotation(new Vector3(-ny * Math.PI / rotationFactor, nx * Math.PI / rotationFactor, 0));
    };

    const handleMouseExit = () => {
        if (!mesh.current) return;
        setRotation(new Vector3(0, 0, 0));
    };

    return (
        <div
            ref={containerRef}
            className={`flex flex-row gap-10 justify-center items-center overflow-visible ${className}`}
            onMouseMove={mouseRotation ? handleMouseMove : undefined}
        >
            <div className="w-100 h-100">
                <Canvas>
                    <RotatingMesh
                        fbx={fbx}
                        scale={scale}
                        rotation={rotation}
                        setRotation={setRotation}
                        mouseRotation={mouseRotation}
                        mesh={mesh}
                    />
                    <ambientLight />
                    <pointLight position={[-3, 2, 2]} intensity={15} />
                    <OrbitControls enableRotate autoRotate autoRotateSpeed={10} enableZoom={enableZoom} enabled={clickable} />
                </Canvas>
            </div>

            <div className={"text-left flex flex-col gap-6 max-w-7xl"}>
                <span className={`text-5xl font-extralight text-[${color}]`}>
                    {title}
                </span>
                <p className="text-4xl text-gray-100 font-light leading-snug">
                    {description}
                </p>
            </div>
        </div>
    );
}