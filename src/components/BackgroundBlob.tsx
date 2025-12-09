"use client";

import React, { useState, useEffect } from "react";

/**
 * A backgroud circle with a gradient. Also has a screen sized transparent div with a backdrop-blur filter. 
 * 
 */
const BackgroundBlob = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setCursorPos({ x: e.x, y: e.y });
    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div id="blob-container" className="fixed left-0 top-0 min-w-screen min-h-screen -z-1000">
      <div id="blob" className="fixed left-0 top-0 aspect-square h-[1000px] rounded-full -z-1000"
        style={{
          background: "linear-gradient(to right, aquamarine, mediumpurple)",
          left: cursorPos.x - 250,
          top: cursorPos.y - 250,
          animation: "rotateBlob 20s infinite, top 3s linear 0s 1 normal forwards, left 3s linear 0s 1 normal forwards"
        }} />
      <div id="blur" className="fixed left-0 top-0 min-w-screen min-h-screen backdrop-blur-[250px] -z-999" />
    </div>
  );
};

export default BackgroundBlob;