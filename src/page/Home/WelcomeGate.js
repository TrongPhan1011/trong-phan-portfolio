import classNames from 'classnames';
import { useEffect, useRef } from 'react';

import { profile } from '~/lib/profile';

const cx = classNames;

// First screen. Its click is what browsers require before they play sound, so entering starts
// the music and the auto scroll together.
function WelcomeGate({ leaving, onEnter }) {
    const enterRef = useRef(null);

    useEffect(() => {
        enterRef.current?.focus({ preventScroll: true });
    }, []);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gate-title"
            className={cx('st-gate', leaving && 'is-leaving')}
        >
            <div className="st-gate-card px-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-tp-orange sm:text-sm">Portfolio</p>
                <h2
                    id="gate-title"
                    className="mt-3 text-[44px] font-bold leading-[1.02] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl"
                >
                    {profile.name}
                </h2>
                <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-zinc-600 sm:text-lg">
                    Turn your sound on, sit back and watch this page design itself.
                </p>
                <button
                    ref={enterRef}
                    type="button"
                    data-music=""
                    data-st-control=""
                    onClick={() => onEnter(true)}
                    className="st-gate-enter mt-9 inline-flex h-14 items-center gap-3 rounded-full bg-zinc-900 pl-7 pr-8 text-lg font-semibold text-white shadow-[0_18px_40px_-18px_rgba(24,24,27,0.75)] transition hover:-translate-y-0.5 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tp-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                        <path d="M8 5.5v13l10.5-6.5z" />
                    </svg>
                    Enter
                </button>
                <button
                    type="button"
                    data-music=""
                    data-st-control=""
                    onClick={() => onEnter(false)}
                    className="mx-auto mt-5 block text-sm font-medium text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-800 hover:underline"
                >
                    Enter without sound
                </button>
            </div>
        </div>
    );
}

export default WelcomeGate;
