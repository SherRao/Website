import {
    useRef,
    useLayoutEffect,
    useState
} from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "motion/react";

const PARALLAX_TW = "relative overflow-visible";
const SCROLLER_TW = "flex whitespace-nowrap text-center font-sans font-bold text-[2.25rem] leading-none tracking-tight [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.1))] md:text-[5rem] md:leading-[5rem]";

function useElementWidth(ref: React.RefObject<HTMLElement | null>) {
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        function updateWidth() {
            if (ref.current)
                setWidth(ref.current.offsetWidth);
        }
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [ref]);

    return width;
}

type ScrollingTextProps = {
    text: string;
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

/**
 * TODO: docs
 * 
 * @param param0 
 * @returns 
 */
export const ScrollingText = ({ text, baseVelocity = 100, scrollContainerRef, className = "",
    damping = 50, stiffness = 400, numCopies = 6, velocityMapping = { input: [0, 1000], output: [0, 5] },
    parallaxClassName = PARALLAX_TW, scrollerClassName = SCROLLER_TW, parallaxStyle, scrollerStyle
}: ScrollingTextProps) => {
    const copyRef = useRef(null);
    const baseX = useMotionValue(0);
    const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {};
    const { scrollY } = useScroll(scrollOptions);
    const ScrollingText = useVelocity(scrollY);
    const smoothVelocity = useSpring(ScrollingText, { damping, stiffness });
    const velocityFactor = useTransform(smoothVelocity, velocityMapping?.input || [0, 1000], velocityMapping?.output || [0, 5], { clamp: false });
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
        if (velocityFactor.get() < 0)
            directionFactor.current = -1;

        else if (velocityFactor.get() > 0)
            directionFactor.current = 1;

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    const spans = [];
    for (let i = 0; i < numCopies; i++)
        spans.push(
            <span key={i} ref={i === 0 ? copyRef : null} className={`shrink-0 ${className ?? ""}`}>
                {text}&nbsp;
            </span>
        );

    return (
        <div className={parallaxClassName} style={parallaxStyle}>
            <motion.div className={scrollerClassName} style={{ x, ...scrollerStyle }}>
                {spans}
            </motion.div>
        </div>
    );
};