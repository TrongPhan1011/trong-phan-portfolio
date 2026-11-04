import classNames from 'classnames';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import AgentLayer from './AgentLayer';
import AutoPlay from './AutoPlay';
import { EngineContext, ModeContext } from './context';
import StudioEngine from './engine';
import './studio.scss';

const cx = classNames;

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hosts the sections inside a fixed screen that the engine moves from the page scroll, the agent
// cursors on top, and a tall spacer that gives the document its scroll length.
function Studio({ children }) {
    const engineRef = useRef(null);
    if (!engineRef.current) engineRef.current = new StudioEngine();
    const engine = engineRef.current;

    const [mode, setMode] = useState(() => (prefersReducedMotion() ? 'present' : 'build'));
    const initialMode = useRef(mode);
    const root = useRef(null);
    const screen = useRef(null);
    const spacer = useRef(null);
    const bg = useRef(null);

    useLayoutEffect(() => {
        engine.mode = initialMode.current;
        engine.mount({ root: root.current, screen: screen.current, spacer: spacer.current, bg: bg.current });
        return () => engine.unmount();
    }, [engine]);

    useLayoutEffect(() => {
        engine.setMode(mode);
    }, [engine, mode]);

    const modeValue = useMemo(() => ({ mode, setMode }), [mode]);

    return (
        <EngineContext.Provider value={engine}>
            <ModeContext.Provider value={modeValue}>
                <div ref={root} className={cx('st-root', mode === 'present' ? 'is-present' : 'is-build')}>
                    <div ref={screen} className="st-screen">
                        <div className="st-bg" aria-hidden="true">
                            <div ref={bg} className="st-bg-layer" />
                        </div>
                        <main className="st-world">{children}</main>
                    </div>
                    <AgentLayer />
                    <AutoPlay />
                    <div ref={spacer} className="st-spacer" aria-hidden="true" />
                </div>
            </ModeContext.Provider>
        </EngineContext.Provider>
    );
}

export default Studio;
