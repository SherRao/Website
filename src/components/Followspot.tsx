import { useId, type Ref } from "react";

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

// The drawing's geometry, in viewBox units. The lamp turns around the stand's pivot, and its beam starts at the
// lens, on an axis above the pivot, and runs to the drawing's right edge. Spotlight.tsx and DoorSpot.tsx aim the
// lamp from these, and mascot.css turns and stretches it around them.
const WIDTH = 200;
const PIVOT = { x: 55, y: 100 };
const LENS = { x: 95, y: 70 };
const BEAM = WIDTH - LENS.x;

/** Where a followspot's stand pivot is on screen, and px per drawing unit. A lamp facing left (-1) is mirrored. */
export const pivotOn = (svg: SVGSVGElement, facing = 1) => {
    // The box ignores the mirroring (it's symmetric) and the lamp's turn (that's inside the drawing).
    const r = svg.getBoundingClientRect();
    const unit = r.width / WIDTH;
    return { x: facing < 0 ? r.right - PIVOT.x * unit : r.left + PIVOT.x * unit, y: r.top + PIVOT.y * unit, unit };
};

/**
 * Aims a lamp at a point `dx`, `dy` px from its pivot (`dx` the way the lamp faces): turns it, no more than `max`
 * degrees either way, so its beam's axis passes through the point, and stretches the beam from the lens to reach
 * `stretch` times as far as the point, but never shorter than `minReach` of its drawn length.
 */
export const aimAt = (
    dx: number,
    dy: number,
    unit: number,
    { max, stretch = 1, minReach }: { max: number; stretch?: number; minReach: number },
) => {
    const d = Math.hypot(dx, dy),
        off = (PIVOT.y - LENS.y) * unit,
        phi = Math.atan2(dy, dx);
    const limit = (max * Math.PI) / 180;
    const theta = Math.max(-limit, Math.min(limit, phi + (d > off ? Math.asin(off / d) : 0)));
    const reach = Math.max(
        minReach,
        (stretch * (d * Math.cos(phi - theta) - (LENS.x - PIVOT.x) * unit)) / (BEAM * unit),
    );
    return { aim: (theta * 180) / Math.PI, reach };
};

/** Points a lamp where aimAt() said. */
export const setAim = (svg: SVGSVGElement, { aim, reach }: { aim: number; reach: number }) => {
    svg.style.setProperty("--aim", `${aim}deg`);
    svg.style.setProperty("--reach", `${reach}`);
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
 * right as drawn. Its lamp turns around the stand's pivot by `--aim` when set, otherwise by its mood's
 * resting angle (mascot.css), and `--reach` stretches the beam from the lens. Decorative: hidden from assistive
 * technology.
 */
export const Followspot = ({
    mood,
    className,
    ref,
}: {
    mood: FollowspotMood;
    className?: string;
    ref?: Ref<SVGSVGElement>;
}) => {
    const id = useId();
    const beam = `beam-${id}`;
    const soft = `soft-${id}`;
    const face = FACES[mood];

    return (
        <svg
            ref={ref}
            className={className ? `followspot ${className}` : "followspot"}
            data-mood={mood}
            viewBox={`0 0 ${WIDTH} 170`}
            style={
                { "--pivot": `${PIVOT.x}px ${PIVOT.y}px`, "--lens": `${LENS.x}px ${LENS.y}px` } as React.CSSProperties
            }
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
                    d={`M${LENS.x} ${LENS.y - 18} L${WIDTH} ${LENS.y - 56} L${WIDTH} ${LENS.y + 56} L${LENS.x} ${LENS.y + 18} Z`}
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
