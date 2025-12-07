"use client";

import React, {useState, useEffect} from "react";

const BackgroundBlob = () => {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => setCursorPos({ x: e.x, y: e.y });
      window.addEventListener('mousemove', handleMouseMove);
      
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
        <div id="blob" className="fixed bg-white aspect-square h-[500px] left-[50%] top-[50%] rounded-full z-1" 
        style={{
            background: "linear-gradient(to right, aquamarine, mediumpurple)",
            left: cursorPos.x - 250,
            top: cursorPos.y - 250,
            animation: "rotateBlob 20s infinite, top 3s linear 0s 1 normal forwards, left 3s linear 0s 1 normal forwards"
        }}/>
          <div id="blur" className="fixed w-full h-full backdrop-blur-[200px] bg-none z-2" />
        </>
    );

};

export default BackgroundBlob;
