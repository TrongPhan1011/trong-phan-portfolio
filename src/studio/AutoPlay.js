import classNames from 'classnames';
import { memo, useEffect, useState } from 'react';

import { useEngine } from './context';

const cx = classNames;

// Floating play/pause for visitors who would rather watch the crew than scroll.
function AutoPlay() {
    const engine = useEngine();
    const [playing, setPlaying] = useState(false);

    useEffect(() => engine.onAuto(setPlaying), [engine]);

    return (
        <button
            type="button"
            data-autoplay=""
            aria-pressed={playing}
            title={playing ? 'Pause' : 'Scroll through the build automatically'}
            className={cx('st-auto', playing && 'is-playing')}
            onClick={() => (playing ? engine.stopAuto() : engine.startAuto())}
        >
            <svg viewBox="0 0 24 24" aria-hidden="true">
                {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l10.5-6.5z" />}
            </svg>
            <span>{playing ? 'Pause' : 'Auto scroll'}</span>
            <span className="st-auto-track" aria-hidden="true">
                <i
                    ref={(n) => {
                        engine.autoBar = n;
                    }}
                />
            </span>
        </button>
    );
}

export default memo(AutoPlay);
