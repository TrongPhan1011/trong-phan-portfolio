import classNames from 'classnames';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import AgentLayer from './AgentLayer';
import AutoPlay from './AutoPlay';
import { EngineContext, ModeContext, MusicContext } from './context';
import MusicToggle from './MusicToggle';
import StudioEngine from './engine';
import Music from './music';
import './studio.scss';

const cx = classNames;

const GATE_FADE_MS = 400;

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hosts the sections inside a fixed screen that the engine moves from the page scroll, the agent
// cursors on top, and a tall spacer that gives the document its scroll length.
// `music` is an optional looping background track. `gate` is an optional first screen, rendered
// with `onEnter(withSound)`: that click is what lets the browser play the music, so the auto
// scroll waits for it instead of starting by itself.
function Studio({ music: track, gate: Gate, children }) {
    const engineRef = useRef(null);
    if (!engineRef.current) engineRef.current = new StudioEngine();
    const engine = engineRef.current;
    const music = useMemo(() => (track ? new Music(track) : null), [track]);

    const [mode, setMode] = useState(() => (prefersReducedMotion() ? 'present' : 'build'));
    const [gate, setGate] = useState(Gate ? 'open' : 'closed');
    const initialMode = useRef(mode);
    const hasGate = useRef(!!Gate);
    const root = useRef(null);
    const screen = useRef(null);
    const spacer = useRef(null);
    const bg = useRef(null);

    useLayoutEffect(() => {
        engine.mode = initialMode.current;
        engine.autoStartHeld = hasGate.current;
        engine.mount({ root: root.current, screen: screen.current, spacer: spacer.current, bg: bg.current });
        return () => engine.unmount();
    }, [engine]);

    useLayoutEffect(() => {
        engine.setMode(mode);
    }, [engine, mode]);

    useEffect(() => {
        if (!music) return undefined;
        music.mount();
        return () => music.unmount();
    }, [music]);

    // nothing scrolls behind the first screen
    useLayoutEffect(() => {
        if (gate !== 'open') return undefined;
        const html = document.documentElement;
        html.style.overflow = 'hidden';
        return () => {
            html.style.overflow = '';
        };
    }, [gate]);

    const enter = useCallback(
        (withSound) => {
            document.documentElement.style.overflow = '';
            if (music) {
                if (withSound) music.start();
                else music.mute();
            }
            engine.startAuto();
            setGate('leaving');
            window.setTimeout(() => setGate('closed'), GATE_FADE_MS);
        },
        [engine, music],
    );

    const modeValue = useMemo(() => ({ mode, setMode }), [mode]);

    return (
        <EngineContext.Provider value={engine}>
            <ModeContext.Provider value={modeValue}>
                <MusicContext.Provider value={music}>
                    <div ref={root} className={cx('st-root', mode === 'present' ? 'is-present' : 'is-build')}>
                        <div ref={screen} className="st-screen">
                            <div className="st-bg" aria-hidden="true">
                                <div ref={bg} className="st-bg-layer" />
                            </div>
                            <main className="st-world">{children}</main>
                        </div>
                        <AgentLayer />
                        <AutoPlay />
                        <MusicToggle />
                        {Gate && gate !== 'closed' && <Gate leaving={gate === 'leaving'} onEnter={enter} />}
                        <div ref={spacer} className="st-spacer" aria-hidden="true" />
                    </div>
                </MusicContext.Provider>
            </ModeContext.Provider>
        </EngineContext.Provider>
    );
}

export default Studio;
