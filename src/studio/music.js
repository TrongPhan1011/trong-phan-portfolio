const VOLUME = 0.45;
const FADE_IN_MS = 1800;
const FADE_OUT_MS = 400;
const STORE_KEY = 'tp-music';
// inputs that let a page start sound; scrolling is not one of them
const GESTURES = ['pointerup', 'touchend', 'keydown', 'click'];

const readPref = () => {
    try {
        return window.localStorage.getItem(STORE_KEY);
    } catch (e) {
        return null;
    }
};

const savePref = (value) => {
    try {
        window.localStorage.setItem(STORE_KEY, value);
    } catch (e) {
        // private browsing: the choice just isn't remembered
    }
};

// Looping background music. Browsers only allow sound after the visitor taps, clicks or presses a
// key, so it tries right away and again on each such gesture until it plays (elements marked
// [data-music] decide for themselves). It pauses with the tab and remembers a mute.
// iOS ignores audio.volume: there the fades do nothing and the track plays at device volume.
export default class Music {
    constructor(src) {
        this.src = src;
        this.audio = null;
        this.on = false;
        this.want = true;
        this.raf = 0;
        this.listeners = new Set();
    }

    mount() {
        const audio = new Audio();
        audio.preload = 'none';
        audio.loop = true;
        audio.volume = 0;
        audio.src = this.src;
        this.audio = audio;
        this.want = readPref() !== 'off';
        for (const type of GESTURES) window.addEventListener(type, this.onGesture, true);
        document.addEventListener('visibilitychange', this.onVisibility);
        this.resume();
    }

    unmount() {
        for (const type of GESTURES) window.removeEventListener(type, this.onGesture, true);
        document.removeEventListener('visibilitychange', this.onVisibility);
        cancelAnimationFrame(this.raf);
        if (this.audio) {
            this.audio.pause();
            this.audio.removeAttribute('src');
            this.audio.load();
            this.audio = null;
        }
        this.set(false);
    }

    subscribe(fn) {
        this.listeners.add(fn);
        fn(this.on);
        return () => this.listeners.delete(fn);
    }

    set(on) {
        if (on === this.on) return;
        this.on = on;
        for (const fn of this.listeners) fn(on);
    }

    // Must run inside the visitor's gesture handler, or browsers refuse to play.
    start() {
        this.want = true;
        savePref('on');
        const audio = this.audio;
        if (audio && !audio.paused) {
            // caught while fading out
            this.set(true);
            this.fade(VOLUME, FADE_IN_MS);
            return;
        }
        this.resume();
    }

    mute() {
        this.want = false;
        savePref('off');
        this.set(false);
        const audio = this.audio;
        if (audio) this.fade(0, FADE_OUT_MS, () => audio.pause());
    }

    toggle() {
        if (this.on) this.mute();
        else this.start();
    }

    resume() {
        const audio = this.audio;
        if (!audio || !this.want || document.hidden || !audio.paused) return;
        audio.play().then(
            () => {
                this.set(true);
                this.fade(VOLUME, FADE_IN_MS);
            },
            () => {},
        );
    }

    fade(to, ms, done) {
        const audio = this.audio;
        cancelAnimationFrame(this.raf);
        const from = audio.volume;
        const t0 = performance.now();
        const step = (now) => {
            const u = Math.min(1, (now - t0) / ms);
            audio.volume = from + (to - from) * u;
            if (u < 1) this.raf = requestAnimationFrame(step);
            else if (done) done();
        };
        this.raf = requestAnimationFrame(step);
    }

    onGesture = (e) => {
        if (e.target instanceof Element && e.target.closest('[data-music]')) return;
        this.resume();
    };

    onVisibility = () => {
        if (!this.audio) return;
        if (document.hidden) {
            cancelAnimationFrame(this.raf);
            this.audio.pause();
        } else {
            this.resume();
        }
    };
}
