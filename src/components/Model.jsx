import React from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

export default function Model({ url }) {
    const geometry = useLoader(STLLoader, url);
    const ref = React.useRef();
    const { camera } = useThree();
    React.useEffect(() => {
        camera.lookAt(ref.current.position);
    });

    return (
        <>
            <mesh ref={ref}>
                <primitive object={geometry} attach="geometryetry" />
                <meshStandardMaterial color={"orange"} />
            </mesh>
            <ambientLight />
            <pointLight position={[-2, 0, 0]} />
        </>
    );
};