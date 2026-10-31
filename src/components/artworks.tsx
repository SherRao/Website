// Minimal artworks for the gallery works. They render their finished state; motion (count-ups, tab's two states,
// kabo's levels) only runs when the visitor hasn't asked for reduced motion.

const NODES = { you: [110, 190], sam: [290, 190], priya: [290, 320], jon: [110, 320] } as const;
type Node = keyof typeof NODES;
const PAIRWISE: [Node, Node][] = [
    ["sam", "you"],
    ["you", "priya"],
    ["jon", "you"],
    ["sam", "priya"],
    ["jon", "sam"],
    ["jon", "priya"],
];
const WITH_TAB: [Node, Node][] = [
    ["jon", "priya"],
    ["sam", "you"],
];
const TAB_GREEN = "#0e7a54";

const Line = ([a, b]: [Node, Node]) => (
    <line
        key={`${a}-${b}`}
        x1={NODES[a][0]}
        y1={NODES[a][1]}
        x2={NODES[b][0]}
        y2={NODES[b][1]}
        stroke={TAB_GREEN}
        strokeWidth="3"
        strokeLinecap="round"
    />
);
const Caption = ({ children }: { children: string }) => (
    <text x="200" y="374" textAnchor="middle" fill={TAB_GREEN} fontFamily="ui-monospace, monospace" fontSize="15">
        {children}
    </text>
);

export const TabSplit = () => (
    <div className="piece piece--tab" role="img" aria-label="Tab settling a four-person trip: six payments become two">
        <svg viewBox="0 0 400 400" aria-hidden="true">
            <text
                x="200"
                y="104"
                textAnchor="middle"
                fill={TAB_GREEN}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontWeight="700"
                fontSize="56"
            >
                tab.
            </text>
            <g className="tabp-pair">
                {PAIRWISE.map(Line)}
                <Caption>6 payments</Caption>
            </g>
            <g className="tabp-tab">
                {WITH_TAB.map(Line)}
                <Caption>2 payments with tab</Caption>
            </g>
            {(Object.keys(NODES) as Node[]).map((n) => (
                <g key={n}>
                    <circle
                        cx={NODES[n][0]}
                        cy={NODES[n][1]}
                        r="21"
                        fill="#f3f0e8"
                        stroke={TAB_GREEN}
                        strokeWidth="3"
                    />
                    <text
                        x={NODES[n][0]}
                        y={NODES[n][1] + 4}
                        textAnchor="middle"
                        fill={TAB_GREEN}
                        fontFamily="ui-monospace, monospace"
                        fontSize="11"
                    >
                        {n}
                    </text>
                </g>
            ))}
        </svg>
    </div>
);

/** A count-up's text at `n`: its prefix, `n` with thousands separators, and its suffix. */
export const countText = (prefix: string, n: number, suffix: string) =>
    `${prefix}${n.toLocaleString("en-US")}${suffix}`;

/** Shows a count-up (a [data-count] element) at `n`, by default its final value. */
export const showCount = (el: HTMLElement, n = Number(el.dataset.count)) => {
    el.textContent = countText(el.dataset.prefix ?? "", n, el.dataset.suffix ?? "");
};

type CounterProps = { to: number; prefix?: string; suffix?: string; label: string };

/** A figure that counts up when revealed. It renders its final value; PageMotion.tsx rewinds and plays it. */
export const Counter = ({ to, prefix = "", suffix = "", label }: CounterProps) => (
    <div className="piece piece--type" role="img" aria-label={label}>
        <span aria-hidden="true" data-count={to} data-prefix={prefix} data-suffix={suffix}>
            {countText(prefix, to, suffix)}
        </span>
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
        {Array.from({ length: bars }, (_, i) => (
            <i key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
    </div>
);

/** Kabo scoring a karaoke line: the score counts up when revealed, over a live level meter. */
export const KaraokeScore = ({ score }: { score: number }) => (
    <div className="piece piece--kabo" role="img" aria-label={`Kabo scoring a karaoke line: ${score} out of 100`}>
        <div className="kabo" aria-hidden="true">
            <span className="kabo-cap">pitch + lyrics</span>
            <span className="kabo-score" data-count={score} data-prefix="" data-suffix="">
                {score}
            </span>
            <Wave bars={24} />
        </div>
    </div>
);

const ALBUMS = [110, 170, 230, 290];
/** Albums both listeners have, by index into ALBUMS. */
const SHARED = new Set([1, 2]);
const LISTENERS = { you: 80, sam: 320 } as const;

/** MuSpace: two listeners joined by the albums they share. */
export const SharedTaste = () => (
    <div className="piece" role="img" aria-label="Two listeners joined by the two albums they both love">
        <svg viewBox="0 0 400 400" aria-hidden="true" className="mu">
            {ALBUMS.map((y, i) =>
                (Object.keys(LISTENERS) as (keyof typeof LISTENERS)[])
                    .filter((who) => SHARED.has(i) || (who === "you" ? i === 0 : i === 3))
                    .map((who) => (
                        <line
                            key={`${who}-${i}`}
                            x1={LISTENERS[who]}
                            y1={200}
                            x2={200}
                            y2={y}
                            className={SHARED.has(i) ? "mu-shared" : "mu-line"}
                        />
                    )),
            )}
            {ALBUMS.map((y, i) => (
                <rect
                    key={y}
                    x={178}
                    y={y - 22}
                    width={44}
                    height={44}
                    className={SHARED.has(i) ? "mu-album is-shared" : "mu-album"}
                />
            ))}
            {(Object.keys(LISTENERS) as (keyof typeof LISTENERS)[]).map((who) => (
                <g key={who}>
                    <circle cx={LISTENERS[who]} cy={200} r={24} className="mu-person" />
                    <text x={LISTENERS[who]} y={204} textAnchor="middle" className="mu-name">
                        {who}
                    </text>
                </g>
            ))}
            <text x={200} y={364} textAnchor="middle" className="mu-cap">
                2 albums in common
            </text>
        </svg>
    </div>
);

const PANELS = ["i. the day job", "ii. the engineer", "iii. the stage", "iv. the founder", "v. off hours"];
/** Each panel's top edge. The first two have arrived (the second covers the first); the rest are still to come. */
const PANEL_Y = [40, 72, 196, 226, 256];
const HERE = 1;

/** This website: the page in miniature, a stack of panels, with the one you're looking at lit. */
export const PageInMiniature = () => (
    <div className="piece" role="img" aria-label="This page in miniature: five panels, with the engineer panel lit">
        <svg viewBox="0 0 400 400" aria-hidden="true" className="mini">
            {PANELS.map((label, i) => (
                <g
                    key={label}
                    className={i === HERE ? "mini-panel is-here" : i < HERE ? "mini-panel" : "mini-panel is-next"}
                >
                    <rect x={70} y={PANEL_Y[i]} width={260} height={100} />
                    <text x={84} y={PANEL_Y[i] + 20}>
                        {label}
                    </text>
                </g>
            ))}
            <text x={200} y={384} textAnchor="middle" className="mini-cap">
                you are here
            </text>
        </svg>
    </div>
);
