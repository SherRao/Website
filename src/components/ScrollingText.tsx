//TODO: CLEAN
import { useRef, useLayoutEffect, useState } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "motion/react";

const PARALLAX_TW =
    "relative overflow-hidden";
const SCROLLER_TW =
    "flex whitespace-nowrap text-center font-sans font-bold text-[2.25rem] leading-none tracking-tight [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.1))] " +
    "md:text-[5rem] md:leading-[5rem]";
const SPAN_TW = "flex-shrink-0";

function useElementWidth(ref: React.RefObject<HTMLElement | null>) {
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        function updateWidth() {
            if (ref.current) {
                setWidth(ref.current.offsetWidth);
            }
        }
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [ref]);

    return width;
}

type ScrollingTextProps = {
    scrollContainerRef?: React.RefObject<HTMLElement>;
    texts?: string[];
    velocity?: number;
    className?: string;
    damping?: number;
    stiffness?: number;
    numCopies?: number;
    velocityMapping?: { input: [number, number]; output: [number, number] };
    parallaxClassName?: string;
    scrollerClassName?: string;
    parallaxStyle?: React.CSSProperties;
    scrollerStyle?: React.CSSProperties;
};

type VelocityTextProps = {
    children: React.ReactNode;
    baseVelocity?: number;
    scrollContainerRef?: React.RefObject<HTMLElement>;
    className?: string;
    damping?: number;
    stiffness?: number;
    numCopies?: number;
    velocityMapping?: { input: [number, number]; output: [number, number] };
    parallaxClassName?: string;
    scrollerClassName?: string;
    parallaxStyle?: React.CSSProperties;
    scrollerStyle?: React.CSSProperties;
};

const VelocityText = ({
    children,
    baseVelocity = 1,
    scrollContainerRef,
    className = "",
    damping,
    stiffness,
    numCopies = 6,
    velocityMapping,
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle
}: VelocityTextProps) => {
    const baseX = useMotionValue(0);
    const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {};
    const { scrollY } = useScroll(scrollOptions);
    const ScrollingText = useVelocity(scrollY);
    const smoothVelocity = useSpring(ScrollingText, {
        damping: damping ?? 50,
        stiffness: stiffness ?? 400
    });
    const velocityFactor = useTransform(
        smoothVelocity,
        velocityMapping?.input || [0, 1000],
        velocityMapping?.output || [0, 5],
        { clamp: false }
    );

    const copyRef = useRef(null);
    const copyWidth = useElementWidth(copyRef);

    function wrap(min: number, max: number, v: number) {
        const range = max - min;
        const mod = (((v - min) % range) + range) % range;
        return mod + min;
    }

    const x = useTransform(baseX, v => {
        if (copyWidth === 0) return "0px";
        return `${wrap(-copyWidth, 0, v)}px`;
    });

    const directionFactor = useRef(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    const spans = [];
    for (let i = 0; i < numCopies; i++) {
        spans.push(
            <span
                className={`${SPAN_TW} ${className ?? ""}`}
                key={i}
                ref={i === 0 ? copyRef : null}
            >
                {children}
            </span>
        );
    }

    return (
        <div
            className={parallaxClassName ? parallaxClassName : PARALLAX_TW}
            style={parallaxStyle}
        >
            <motion.div
                className={scrollerClassName ? scrollerClassName : SCROLLER_TW}
                style={{ x, ...scrollerStyle }}
            >
                {spans}
            </motion.div>
        </div>
    );
};

export const ScrollingText = ({
    scrollContainerRef,
    texts = [],
    velocity = 100,
    className = "",
    damping = 50,
    stiffness = 400,
    numCopies = 6,
    velocityMapping = { input: [0, 1000], output: [0, 5] },
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle
}: ScrollingTextProps) => {
    return (
        <div>
            {texts.map((text, index) => (
                <VelocityText
                    key={index}
                    className={className}
                    baseVelocity={index % 2 !== 0 ? -velocity : velocity}
                    scrollContainerRef={scrollContainerRef}
                    damping={damping}
                    stiffness={stiffness}
                    numCopies={numCopies}
                    velocityMapping={velocityMapping}
                    parallaxClassName={parallaxClassName}
                    scrollerClassName={scrollerClassName}
                    parallaxStyle={parallaxStyle}
                    scrollerStyle={scrollerStyle}
                >
                    {text}&nbsp;
                </VelocityText>
            ))}
        </div>
    );
};