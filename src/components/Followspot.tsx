import { useId } from "react";

export type FollowspotMood = "cue" | "listening" | "sleep" | "hi" | "out";

/** Eyes and mouth for each mood. */
type Eyes = "dot" | "happy" | "closed" | "x";

const FACES: Record<FollowspotMood, { eyes: Eyes; mouth: "smile" | "w" | "flat" | "none" }> = {
    cue: { eyes: "dot", mouth: "smile" },
    listening: { eyes: "happy", mouth: "w" },
    sleep: { eyes: "closed", mouth: "none" },
    hi: { eyes: "happy", mouth: "smile" },
    out: { eyes: "x", mouth: "flat" },
};

const EYES_X = [60, 77];
const EYES_Y = 69;

const Eye = ({ kind, x }: { kind: Eyes; x: number }) => {
    if (kind === "dot") return <circle cx={x} cy={EYES_Y} r="4.2" fill="currentColor" stroke="none" />;
    if (kind === "x") return <path d={`M${x - 4} ${EYES_Y - 4} l8 8 M${x + 4} ${EYES_Y - 4} l-8 8`} />;
    if (kind === "happy") return <path d={`M${x - 5} ${EYES_Y + 2} l5 -5 l5 5`} />;
    return <path d={`M${x - 5} ${EYES_Y - 1} q5 5 10 0`} />;
};

/**
 * The site's mascot: a followspot on a stand, drawn in one stroke weight with a gel beam as its only fill. Faces
 * right as drawn. Its lamp turns around the stand's pivot (55, 100) by `--aim` when set, otherwise by its mood's
 * resting angle (mascot.css), and `--reach` stretches the beam from the lens. Decorative: hidden from assistive
 * technology.
 */
export const Followspot = ({ mood, className }: { mood: FollowspotMood; className?: string }) => {
    const id = useId();
    const beam = `beam-${id}`;
    const soft = `soft-${id}`;
    const face = FACES[mood];

    return (
        <svg
            className={className ? `followspot ${className}` : "followspot"}
            data-mood={mood}
            viewBox="0 0 200 170"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <linearGradient id={beam}>
                    <stop offset="0" style={{ stopColor: "var(--gel)", stopOpacity: 0.5 }} />
                    <stop offset="1" style={{ stopColor: "var(--gel)", stopOpacity: 0 }} />
                </linearGradient>
                {/* feathers the beam's edges, so it reads as light rather than a wedge */}
                <filter id={soft} x="-10%" y="-25%" width="120%" height="150%">
                    <feGaussianBlur stdDeviation="5" />
                </filter>
            </defs>
            <g className="fs-lamp">
                <path
                    className="fs-beam"
                    d="M95 52 L200 14 L200 126 L95 88 Z"
                    fill={`url(#${beam})`}
                    filter={`url(#${soft})`}
                    stroke="none"
                />
                <path d="M24 70 H13" />
                <path
                    className="fs-body"
                    d="M31 56 L87 46 Q94 45 94 52 V88 Q94 95 87 94 L31 84 Q24 83 24 76 V64 Q24 57 31 56 Z"
                />
                <path d="M96 38 V102" strokeWidth="7" />
                <path d="M55 89 V100" />
                <g strokeWidth="4.5">
                    <g className={face.eyes === "dot" ? "fs-blink" : undefined}>
                        {EYES_X.map((x) => (
                            <Eye key={x} kind={face.eyes} x={x} />
                        ))}
                    </g>
                    {face.mouth === "smile" && <path d="M64.5 80 q4 4 8 0" />}
                    {face.mouth === "w" && <path d="M62.5 80 q3 3 6 0 q3 3 6 0" />}
                    {face.mouth === "flat" && <path d="M65.5 81 h6" />}
                </g>
                {mood === "listening" && (
                    <>
                        <path d="M36 56 C38 24, 80 20, 84 48" />
                        <rect className="fs-body" x="29" y="52" width="13" height="22" rx="6" />
                    </>
                )}
            </g>
            <circle cx="55" cy="101" r="3.5" fill="currentColor" stroke="none" />
            <path d="M55 106 V148 M55 148 L38 160 M55 148 L72 160" />
            {mood === "out" && <path className="fs-smoke" d="M92 30 q-7 -7 0 -14 q7 -7 0 -14" strokeWidth="3.5" />}
            {mood === "sleep" && (
                <g className="fs-zz" strokeWidth="3.5">
                    <path d="M96 34 h8 l-8 9 h8" />
                    <path d="M108 20 h6 l-6 7 h6" />
                </g>
            )}
        </svg>
    );
};
