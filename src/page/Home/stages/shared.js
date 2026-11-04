import classNames from 'classnames';

import { Box, Drag, Pop, Type, useEngine } from '~/studio';

const cx = classNames;

export function useGoto() {
    const engine = useEngine();
    return (id) => (e) => {
        e.preventDefault();
        engine.goto(id);
    };
}

export function Heading({ eyebrow, title, at, className }) {
    return (
        <div className={className}>
            <Type at={[at, at + 0.07]} className="text-lg font-medium text-tp-orange lg:text-xl" label="eyebrow">
                {eyebrow}
            </Type>
            <Type
                as="h2"
                at={[at + 0.03, at + 0.15]}
                className="mt-1 text-[30px] font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl"
                label="heading"
            >
                {title}
            </Type>
        </div>
    );
}

// Tailwind orders same-property utilities on its own, so a size is one set of classes, never an override.
const BTN_SIZES = {
    lg: 'h-12 gap-2 px-6',
    md: 'h-11 gap-2 px-5 sm:h-12 sm:px-6',
    sm: 'h-8 gap-1 px-3 text-xs md:h-10 md:gap-1.5 md:px-4 md:text-sm',
};

// One agent draws it as a grey rectangle, floods it with `color`, types the label and drops the icon in.
// Once finished, `cta` buttons keep sending out a ring and the icon moves: nudge | rise | drop | send | spin.
export function Btn({
    as = 'a',
    at,
    text,
    icon,
    motion = 'nudge',
    cta = false,
    size = 'lg',
    color = '#F85023',
    className,
    style,
    ...rest
}) {
    const job = `btn:${text}:${at}`;
    return (
        <Box
            as={as}
            draw={[at, at + 0.04]}
            fill={[at + 0.045, at + 0.09]}
            color={color}
            radius={12}
            job={job}
            label={`“${text}” button`}
            className={cx(
                'st-btn inline-flex items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tp-orange/40',
                BTN_SIZES[size],
                cta && 'is-cta',
                icon && `is-${motion}`,
                className,
            )}
            style={{ '--ring': color, ...style }}
            {...rest}
        >
            <Type as="span" at={[at + 0.095, at + 0.15]} job={job} className="whitespace-nowrap text-white" label="button label">
                {text}
            </Type>
            {icon && (
                <Pop as="span" pieceAs="span" at={[at + 0.152, at + 0.185]} job={job} label="icon" className="st-btn-icon text-white">
                    <span className="st-icon">{icon}</span>
                </Pop>
            )}
        </Box>
    );
}

export function Chip({ icon, children, className, ...rest }) {
    return (
        <span
            className={cx(
                'inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-700 shadow-[0_6px_20px_-10px_rgba(0,0,0,0.25)]',
                className,
            )}
            {...rest}
        >
            {icon && <span className="text-tp-orange">{icon}</span>}
            {children}
        </span>
    );
}

// A soft color shape an agent drags into the background of a section.
export function Blob({ at, from = 'right', color, className }) {
    return (
        <Drag at={at} from={from} label="background shape" className={cx('absolute rounded-full', className)}>
            <div
                className="st-blob aspect-square w-full rounded-full"
                style={{ background: `radial-gradient(closest-side, ${color}, transparent)` }}
            />
        </Drag>
    );
}

// A hand-painted sticker an agent drags onto the section; it keeps drifting once placed.
// `className` places it, `size` sets its height.
export function Sticker({ src, at, from = 'right', className, size, drift = 9, tilt = 4, delay = 0 }) {
    return (
        <Drag at={at} from={from} label="sticker" className={cx('absolute', className)}>
            <img
                src={src}
                alt=""
                draggable={false}
                decoding="async"
                className={cx('st-float block w-auto max-w-none select-none', size)}
                style={{ '--fd': `${drift}s`, '--fr': `${tilt}deg`, '--fdl': `${-delay}s` }}
            />
        </Drag>
    );
}
