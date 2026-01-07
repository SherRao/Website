import React from "react";
import { motion } from "motion/react";

type AnimationType =
    | "fade"
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "scale"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right";

type AnimationVariants = {
    initial: Record<string, number>;
    animate: Record<string, number>;
    exit: Record<string, number>;
};

type AnimatedWrapperProps = {
    children: React.ReactNode;
    type?: AnimationType;
    duration?: number;
    delay?: number;
    once?: boolean;
    className?: string;
    style?: React.CSSProperties;
    as?: keyof typeof motion;
} & Omit<React.HTMLAttributes<HTMLElement>, "as" | "style" | "className" | "children">;

const animationVariants: Record<AnimationType, AnimationVariants> = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    },
    "fade-up": {
        initial: { opacity: 0, y: 32 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 32 }
    },
    "fade-down": {
        initial: { opacity: 0, y: -32 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -32 }
    },
    "fade-left": {
        initial: { opacity: 0, x: -32 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -32 }
    },
    "fade-right": {
        initial: { opacity: 0, x: 32 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 32 }
    },
    scale: {
        initial: { opacity: 0, scale: 0.94 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.94 }
    },
    "slide-up": {
        initial: { y: 48, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 48, opacity: 0 }
    },
    "slide-down": {
        initial: { y: -48, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -48, opacity: 0 }
    },
    "slide-left": {
        initial: { x: -48, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -48, opacity: 0 }
    },
    "slide-right": {
        initial: { x: 48, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 48, opacity: 0 }
    },
};

const AnimatedWrapper = ({
    children,
    type = "fade",
    duration = 0.7,
    delay = 0,
    once = false,
    className = "",
    style = {},
    as = "div",
    ...rest
}: AnimatedWrapperProps) => {
    // Get the motion component for the HTML element, default to motion.div
    const MotionComponent =
        (motion[as as keyof typeof motion] as React.ElementType) || motion.div;
    const variants: AnimationVariants =
        animationVariants[type] || animationVariants.fade;

    return (
        <MotionComponent
            className={className}
            style={style}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
                duration,
                delay,
                type: "spring",
                damping: 24,
                stiffness: 240,
            }}
            variants={variants}
            {...rest}
        >
            {children}
        </MotionComponent>
    );
};

export default AnimatedWrapper;