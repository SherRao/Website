// Minimal artworks for the gallery works. They render their finished state; motion (route drawing, the dot's walk,
// count-ups, the dots filling) is started by PageMotion only when the visitor hasn't asked for reduced motion.

const ROUTE = "M70 320 H200 V130 H330";

export const BlueDot = () => (
    <div className="piece" role="img" aria-label="A blue dot walking a route across an indoor map grid">
        <svg viewBox="0 0 400 400" aria-hidden="true">
            <defs>
                <pattern id="bd-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M40 0H0V40" fill="none" stroke="#efe7dc" strokeOpacity="0.08" />
                </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#bd-grid)" />
            <path className="tx-route" d={ROUTE} pathLength={1} />
            {/* resting position, shown with reduced motion */}
            <g className="dot-rest" transform="translate(330 130)">
                <circle r="30" fill="rgba(59,118,255,0.14)" stroke="rgba(59,118,255,0.4)" />
                <circle r="10" fill="#3b76ff" stroke="#fff" strokeWidth="4" />
            </g>
            <g className="dot-move">
                <circle r="30" fill="rgba(59,118,255,0.14)" stroke="rgba(59,118,255,0.4)">
                    <animate attributeName="r" values="24;40;24" dur="3s" repeatCount="indefinite" begin="indefinite" />
                </circle>
                <circle r="10" fill="#3b76ff" stroke="#fff" strokeWidth="4" />
                <animateMotion path={ROUTE} dur="7s" repeatCount="indefinite" keyPoints="0;1;1;0;0" keyTimes="0;0.42;0.5;0.92;1" calcMode="linear" begin="indefinite" />
            </g>
        </svg>
    </div>
);

const NODES = { you: [110, 190], sam: [290, 190], priya: [290, 320], jon: [110, 320] } as const;
type Node = keyof typeof NODES;
const PAIRWISE: [Node, Node][] = [["sam", "you"], ["you", "priya"], ["jon", "you"], ["sam", "priya"], ["jon", "sam"], ["jon", "priya"]];
const WITH_TAB: [Node, Node][] = [["jon", "priya"], ["sam", "you"]];
const TAB_GREEN = "#0e7a54";

const Line = ([a, b]: [Node, Node]) => (
    <line key={`${a}-${b}`} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke={TAB_GREEN} strokeWidth="3" strokeLinecap="round" />
);
const Caption = ({ children }: { children: string }) => (
    <text x="200" y="374" textAnchor="middle" fill={TAB_GREEN} fontFamily="ui-monospace, monospace" fontSize="15">{children}</text>
);

export const TabSplit = () => (
    <div className="piece piece--tab" role="img" aria-label="Tab settling a four-person trip: six payments become two">
        <svg viewBox="0 0 400 400" aria-hidden="true">
            <text x="200" y="104" textAnchor="middle" fill={TAB_GREEN} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontWeight="700" fontSize="56">tab.</text>
            <g className="tabp-pair">{PAIRWISE.map(Line)}<Caption>6 payments</Caption></g>
            <g className="tabp-tab">{WITH_TAB.map(Line)}<Caption>2 payments with tab</Caption></g>
            {(Object.keys(NODES) as Node[]).map((n) => (
                <g key={n}>
                    <circle cx={NODES[n][0]} cy={NODES[n][1]} r="21" fill="#f3f0e8" stroke={TAB_GREEN} strokeWidth="3" />
                    <text x={NODES[n][0]} y={NODES[n][1] + 4} textAnchor="middle" fill={TAB_GREEN} fontFamily="ui-monospace, monospace" fontSize="11">{n}</text>
                </g>
            ))}
        </svg>
    </div>
);

type CounterProps = { to: number; prefix?: string; suffix?: string; label: string };

export const Counter = ({ to, prefix = "", suffix = "", label }: CounterProps) => (
    <div className="piece piece--type" role="img" aria-label={label}>
        <span aria-hidden="true" data-count={to} data-prefix={prefix} data-suffix={suffix}>{prefix}{to.toLocaleString("en-US")}{suffix}</span>
    </div>
);

export const Dots = ({ filled, total }: { filled: number; total: number }) => (
    <div className="piece" role="img" aria-label={`${filled} of ${total} startups hit their goals`}>
        <div aria-hidden="true" style={{ width: "100%" }}>
            <div className="dots" data-dots={filled}>
                {Array.from({ length: total }, (_, i) => <i key={i} className={i < filled ? "on" : undefined} />)}
            </div>
            <p className="dots-cap" data-dots-cap={total}>{filled}/{total}</p>
        </div>
    </div>
);

export const Blank = ({ text }: { text: string }) => (
    <div className="piece piece--blank">
        <i className="scan" aria-hidden="true" />
        <span>{text}</span>
    </div>
);

export const Wave = ({ bars = 32 }: { bars?: number }) => (
    <div className="wave" aria-hidden="true">
        {Array.from({ length: bars }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}
    </div>
);
