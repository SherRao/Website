"use client";

import {
    useRef,
    useLayoutEffect,
    useState,
} from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame,
} from "motion/react";

const useElementWidth = (ref: React.RefObject<HTMLElement | null>) => {
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        const updateWidth = () => {
            if (ref.current) setWidth(ref.current.offsetWidth);
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [ref]);

    return width;
};

type ScrollingMarqueeProps = {
    text: string;
    baseVelocity?: number;
    className?: string;
    scrollerClassName?: string;
    numCopies?: number;
};

/**
 * Continuously scrolling marquee that subtly responds to scroll velocity.
 */
export const ScrollingMarquee = ({
    text,
    baseVelocity = 60,
    className = "",
    scrollerClassName = "flex whitespace-nowrap font-black text-[8rem] leading-none tracking-tighter",
    numCopies = 6,
}: ScrollingMarqueeProps) => {
    const copyRef = useRef<HTMLSpanElement>(null);
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
    const copyWidth = useElementWidth(copyRef);

    const wrap = (min: number, max: number, v: number) => {
        const range = max - min;
        const mod = (((v - min) % range) + range) % range;
        return mod + min;
    };

    const x = useTransform(baseX, (v) => {
        if (copyWidth === 0) return "0px";
        return `${wrap(-copyWidth, 0, v)}px`;
    });

    const directionFactor = useRef(1);
    useAnimationFrame((_, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
        if (velocityFactor.get() < 0) directionFactor.current = -1;
        else if (velocityFactor.get() > 0) directionFactor.current = 1;
        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    const spans = [];
    for (let i = 0; i < numCopies; i++) {
        spans.push(
            <span
                key={i}
                ref={i === 0 ? copyRef : null}
                className={`shrink-0 select-none ${className}`}
            >
                {text}&nbsp;
            </span>
        );
    }

    return (
        <div className="relative overflow-hidden">
            <motion.div className={scrollerClassName} style={{ x }}>
                {spans}
            </motion.div>
        </div>
    );
};
