import classNames from 'classnames';
import { memo, useEffect, useState } from 'react';

import { useMusic } from './context';

const cx = classNames;

// Sound on/off for the background music: dancing bars while it plays, a slash when muted.
function MusicToggle() {
    const music = useMusic();
    const [on, setOn] = useState(false);

    useEffect(() => (music ? music.subscribe(setOn) : undefined), [music]);

    if (!music) return null;
    return (
        <button
            type="button"
            data-music=""
            data-st-control=""
            aria-pressed={on}
            aria-label={on ? 'Mute music' : 'Play music'}
            title={on ? 'Mute music' : 'Play music'}
            className={cx('st-music', on && 'is-on')}
            onClick={() => music.toggle()}
        >
            <span className="st-eq" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
            </span>
        </button>
    );
}

export default memo(MusicToggle);
