"use client";

import React from "react";

/**
 * 
 * A backgroud circle with a gradient. Also has a screen sized transparent div with a backdrop-blur filter. 
 * 
 */
export const BackgroundBlob = () => {
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setCursorPos({ x: e.x, y: e.y });
    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div id="blob-container" className="block fixed left-0 top-0 min-w-screen min-h-full -z-1000">
      <div id="blob" className="fixed left-0 top-0 aspect-square h-[1000px] rounded-full -z-1000"
        style={{
          background: "linear-gradient(to right, aquamarine, mediumpurple)",
          left: cursorPos.x - 250,
          top: cursorPos.y - 250,
          animation: "rotateBlob 20s infinite, top 3s linear 0s 1 normal forwards, left 3s linear 0s 1 normal forwards"
        }} />

      <div id="blob-blur" className="fixed left-0 top-0 min-w-screen min-h-full backdrop-blur-[500px] -z-999" />
    </div>
  );
};