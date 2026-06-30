"use client";

import React from "react";

type TypewriterProps = {
    text: string;
    speed?: number;
    delay?: number;
    cursor?: boolean;
    className?: string;
    onComplete?: () => void;
};

/**
 * Lightweight typewriter that types `text` character-by-character.
 */
export const Typewriter = ({
    text,
    speed = 35,
    delay = 0,
    cursor = true,
    className = "",
    onComplete,
}: TypewriterProps) => {
    const [output, setOutput] = React.useState("");
    const [done, setDone] = React.useState(false);
    const onCompleteRef = React.useRef(onComplete);

    React.useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    React.useEffect(() => {
        let i = 0;
        let interval: ReturnType<typeof setInterval> | null = null;

        const timer = setTimeout(() => {
            interval = setInterval(() => {
                i += 1;
                setOutput(text.slice(0, i));
                if (i >= text.length) {
                    if (interval) clearInterval(interval);
                    setDone(true);
                    onCompleteRef.current?.();
                }
            }, speed);
        }, delay);

        return () => {
            clearTimeout(timer);
            if (interval) clearInterval(interval);
        };
    }, [text, speed, delay]);

    return (
        <span className={className}>
            {output}
            {cursor && (
                <span
                    className={`inline-block w-[0.5em] h-[0.95em] -mb-[0.1em] ml-0.5 bg-current ${
                        done ? "animate-[blink_1s_steps(2,end)_infinite]" : ""
                    }`}
                />
            )}
            <style jsx>{`
                @keyframes blink {
                    50% {
                        opacity: 0;
                    }
                }
            `}</style>
        </span>
    );
};
