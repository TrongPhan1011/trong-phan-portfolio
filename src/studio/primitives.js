import classNames from 'classnames';
import { useContext, useLayoutEffect, useRef } from 'react';

import { AGENTS } from './agents';
import { EngineContext, StageContext } from './context';

const cx = classNames;

// `at` is a [start, end] window expressed in the build progress (0 → 1) of the enclosing stage.
const win = (type, at, extra) => (at ? { type, a: at[0], b: at[1], ...extra } : null);

const textOf = (children) => (Array.isArray(children) ? children.join('') : String(children ?? ''));

// The returned object is the slot the engine reads from: DOM nodes are written into it by refs.
// Slots sharing a `job` are handed to the same agent when their tasks follow each other.
function useSlot(kind, specs, extra) {
    const engine = useContext(EngineContext);
    const stageId = useContext(StageContext);
    const slot = useRef(null);
    if (!slot.current) slot.current = { kind, specs: specs.filter(Boolean), ...extra };
    useLayoutEffect(() => {
        slot.current.stageId = stageId;
        return engine.addSlot(slot.current);
    }, [engine, stageId]);
    return slot.current;
}

// One section: a raised block the crew draws first and rounds off last.
// `build` is how long (in screen heights of scroll) the crew spends designing it.
export function Stage({
    id,
    order,
    label,
    build = 1.5,
    tone = '#FFFFFF',
    draw = [0, 0.06],
    polish = [0.9, 0.98],
    decor,
    className,
    children,
}) {
    const engine = useContext(EngineContext);
    const ref = useRef(null);
    const body = useRef(null);
    const content = useRef(null);
    const fx = useRef(null);
    useLayoutEffect(
        () =>
            engine.addStage({
                id,
                order,
                label,
                build,
                el: ref.current,
                body: body.current,
                content: content.current,
                fx: fx.current,
            }),
        [engine, id, order, label, build],
    );
    return (
        <StageContext.Provider value={id}>
            <section ref={ref} id={id} aria-label={label} className="st-stage">
                <Block
                    label={label}
                    tone={tone}
                    draw={draw}
                    polish={polish}
                    decor={decor}
                    bodyRef={body}
                    contentRef={content}
                    className={className}
                >
                    {children}
                </Block>
                <div ref={fx} className="st-fx" aria-hidden="true" />
            </section>
        </StageContext.Provider>
    );
}

function Block({ label, tone, draw, polish, decor, bodyRef, contentRef, className, children }) {
    const slot = useSlot('frame', [win('draw', draw), win('polish', polish, { radius: 28, shadow: true })], {
        label: `${label} section`,
        block: true,
    });
    return (
        <div
            ref={(n) => {
                slot.el = n;
            }}
            className={cx('st-block', className)}
        >
            <div
                ref={(n) => {
                    slot.surface = n;
                }}
                className="st-surface"
                style={{ background: tone }}
            >
                {decor}
            </div>
            <div ref={bodyRef} className="st-body">
                <div ref={contentRef} className="st-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

// A rectangle an agent draws, then floods with color and rounds off.
export function Box({
    as: Tag = 'div',
    draw,
    fill,
    color = '#FFFFFF',
    origin = [0.3, 0.6],
    polish,
    radius = 12,
    shadow = false,
    base = '#D9D9D9',
    fillClassName,
    label = 'rectangle',
    job,
    className,
    children,
    ...rest
}) {
    const slot = useSlot(
        'frame',
        [
            win('draw', draw),
            win('fill', fill, { color, ox: origin[0], oy: origin[1] }),
            win('polish', polish, { radius, shadow }),
        ],
        { label, job },
    );
    return (
        <Tag
            ref={(n) => {
                slot.el = n;
            }}
            className={cx('st-box', className)}
            {...rest}
        >
            <span
                ref={(n) => {
                    slot.surface = n;
                }}
                className="st-surface"
                style={{ background: base, borderRadius: polish ? 0 : radius }}
                aria-hidden="true"
            >
                {fill && (
                    <span
                        ref={(n) => {
                            slot.fill = n;
                        }}
                        className={cx('st-fill', fillClassName)}
                        style={{ background: color }}
                    />
                )}
            </span>
            {children}
        </Tag>
    );
}

// Text an agent types character by character. The untyped rest stays in the layout (transparent),
// so nothing reflows while typing. `parts` allows differently styled runs: [{ text, className }].
export function Type({
    as: Tag = 'div',
    at,
    scale,
    from = 0.5,
    parts,
    label = 'text',
    job,
    className,
    children,
    ...rest
}) {
    const segs = parts || [{ text: textOf(children) }];
    const slot = useSlot('text', [win('type', at), win('scale', scale, { from })], {
        text: segs.map((s) => s.text).join(''),
        segs: segs.map((s) => ({ text: s.text, on: null, off: null, caret: null })),
        label,
        job,
    });
    slot.len = slot.text.length;
    return (
        <Tag
            ref={(n) => {
                slot.el = n;
            }}
            className={cx('st-text', className)}
            {...rest}
        >
            <span
                ref={(n) => {
                    slot.piece = n;
                }}
                className="st-text-piece"
            >
                {segs.map((s, i) => (
                    <span key={i} className={s.className}>
                        <span
                            ref={(n) => {
                                slot.segs[i].on = n;
                            }}
                        />
                        <span
                            ref={(n) => {
                                slot.segs[i].caret = n;
                            }}
                            className="st-caret"
                            aria-hidden="true"
                        />
                        <span
                            ref={(n) => {
                                slot.segs[i].off = n;
                            }}
                            className="st-off"
                        >
                            {s.text}
                        </span>
                    </span>
                ))}
            </span>
        </Tag>
    );
}

// A real form control whose placeholder gets typed in by an agent.
export function TypedInput({ as: Tag = 'input', at, text, label = 'input', job, className, ...rest }) {
    const slot = useSlot('input', [win('type', at)], { text, len: text.length, label, job });
    return (
        <Tag
            ref={(n) => {
                slot.el = n;
            }}
            className={className}
            aria-label={text}
            {...rest}
        />
    );
}

function Item({
    kind,
    as: Tag = 'div',
    pieceAs: Piece = 'div',
    at,
    from,
    label,
    job,
    className,
    pieceClassName,
    children,
    ...rest
}) {
    const slot = useSlot('item', [win(kind, at, kind === 'drag' ? { from } : null)], { label, job });
    return (
        <Tag
            ref={(n) => {
                slot.el = n;
            }}
            className={cx('st-item', className)}
            {...rest}
        >
            <Piece
                ref={(n) => {
                    slot.piece = n;
                }}
                className={cx('st-piece', pieceClassName)}
            >
                {children}
            </Piece>
        </Tag>
    );
}

// An element an agent grabs from off-canvas ('left' | 'right' | 'top' | 'bottom' | [dx, dy]).
export const Drag = ({ from = 'left', label = 'element', ...props }) => (
    <Item kind="drag" from={from} label={label} {...props} />
);

// An element an agent drops in place with a click.
export const Pop = ({ label = 'element', ...props }) => <Item kind="pop" label={label} {...props} />;

export function Line({ at, label = 'line', color = '#E4E4E7', job, className, children }) {
    const slot = useSlot('line', [win('line', at)], { label, job });
    return (
        <div
            ref={(n) => {
                slot.el = n;
            }}
            className={cx('st-line', className)}
            aria-hidden="true"
        >
            <div
                ref={(n) => {
                    slot.piece = n;
                }}
                className="st-line-piece"
                style={{ background: color }}
            />
            {children}
        </div>
    );
}

// Every agent flies in and circles around this block.
export function Gather({ at, className, children }) {
    const slot = useSlot(
        'anchor',
        AGENTS.map((a) => win('gather', at, { agentIndex: a.id })),
        { label: 'crew' },
    );
    return (
        <div
            ref={(n) => {
                slot.el = n;
            }}
            className={className}
        >
            {children}
        </div>
    );
}
