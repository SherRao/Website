/**
 * A stage cue that covers the page on first load: the cue light stands by while the line fills, turns to "go" at
 * 1.3s, then the screen lifts like a curtain at 1.5s. Plain CSS (motion.css), so it runs from first paint.
 */
export const Loader = () => (
    <div className="loader" role="status" aria-label="Loading">
        <div className="loader-in" aria-hidden="true">
            <div className="loader-row">
                <span className="label-s loader-cue">
                    <i />
                    <span className="loader-word">
                        <span className="loader-standby">standby</span>
                        <span className="loader-go">go</span>
                    </span>
                </span>
                <span className="label-s loader-count" />
            </div>
            <div className="loader-line" />
            <div className="loader-row">
                <span className="label-s">nausher rao</span>
                <span className="label-s">cue 1</span>
            </div>
        </div>
    </div>
);
