import { AGENTS } from './agents';
import { clamp, easeInOut, easeOut, easeOutBack, lerp, mulberry32 } from './math';

// Scroll lengths are expressed in viewport heights.
const TRAVEL = 0.1; // agent flight to its next task, or out to its spot around the section
const HOLD = 0.14; // finished section on screen before the camera moves on
const GAP = 0.55; // camera move to the next section
const BUSY_MARGIN = 0.025; // section progress an agent keeps free between two jobs
const JOB_GAP = 0.06; // tasks of one element closer than this are done in one go by the same agent
const INTRO = 0.065; // part of the first section the crew builds by itself right after the page loads
const INTRO_MS = 1300;
const SMOOTH_MS = 110;
const SPOT_BAND = 22; // thinnest margin around a section where an agent can wait
const FX_PER_FRAME = 4;

const SKILL = {
    draw: 'draw',
    line: 'draw',
    type: 'type',
    drag: 'move',
    pop: 'move',
    scale: 'move',
    fill: 'color',
    polish: 'color',
};

const WANDER = { around: 3, park: 4, ring: 2.5 };

function css(el, prop, value) {
    if (!el) return;
    const cache = el.__st || (el.__st = {});
    if (cache[prop] === value) return;
    cache[prop] = value;
    el.style[prop] = value;
    if (prop === 'clipPath') el.style.webkitClipPath = value;
}

const tAt = (task, y) => (task.B > task.A ? clamp((y - task.A) / (task.B - task.A)) : y >= task.A ? 1 : 0);

const scaleOf = (slot, t) => lerp(slot.by.scale.from, 1, easeInOut(t));

const typedCount = (slot, t) => (t >= 1 ? slot.len : Math.round(slot.len * clamp((t - 0.05) / 0.95)));

function arc(p, q, e, bend) {
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const s = Math.sin(Math.PI * e) * bend;
    return { x: p.x + dx * e - dy * s, y: p.y + dy * e + dx * s };
}

function dragPose(task, t) {
    const e = easeInOut(t);
    const k = 1 - e;
    const bend = Math.sin(Math.PI * e) * task.bend;
    return {
        ox: task.dx * k - task.dy * bend,
        oy: task.dy * k + task.dx * bend,
        rot: task.tilt * Math.sin(Math.PI * e),
        sc: 1 + 0.05 * Math.sin(Math.PI * Math.min(1, t * 1.1)),
    };
}

// Moves a job so it starts at `start`, squeezing it if it would run past the end of the section.
function placeJob(job, start) {
    const a = Math.min(start, 0.96);
    const span = job.b - job.a;
    const f = span > 0 ? Math.min(1, (0.99 - a) / span) : 1;
    for (const t of job.tasks) {
        t.a = a + (t.a - job.a) * f;
        t.b = a + (t.b - job.a) * f;
    }
    job.a = a;
    job.b = a + span * f;
}

function writeText(slot, n) {
    let rest = n;
    for (const seg of slot.segs) {
        const k = clamp(rest, 0, seg.text.length);
        rest -= seg.text.length;
        if (seg.k === k) continue;
        seg.k = k;
        seg.on.textContent = seg.text.slice(0, k);
        seg.off.textContent = seg.text.slice(k);
    }
}

function placeCaret(slot, n) {
    let idx = -1;
    if (n >= 0) {
        let rest = n;
        idx = slot.segs.length - 1;
        for (let i = 0; i < slot.segs.length; i++) {
            if (rest <= slot.segs[i].text.length) {
                idx = i;
                break;
            }
            rest -= slot.segs[i].text.length;
        }
    }
    if (slot.caretIdx === idx) return;
    if (slot.caretIdx >= 0) slot.segs[slot.caretIdx].caret.style.display = 'none';
    if (idx >= 0) slot.segs[idx].caret.style.display = 'inline-block';
    slot.caretIdx = idx;
}

function sampleText(slot, range, origin) {
    const pts = [];
    const len = slot.len;
    if (!len) return pts;
    const at = (i, after) => {
        let idx = i;
        for (const seg of slot.segs) {
            const L = seg.text.length;
            if (idx < L) {
                const onLen = seg.on.textContent.length;
                const inOn = idx < onLen;
                const node = (inOn ? seg.on : seg.off).firstChild;
                if (!node) return null;
                const o = inOn ? idx : idx - onLen;
                range.setStart(node, o);
                range.setEnd(node, o + 1);
                const rects = range.getClientRects();
                const r = rects.length ? rects[rects.length - 1] : null;
                if (!r || (!r.width && !r.height)) return null;
                return { i: after ? i + 1 : i, x: (after ? r.right : r.left) - origin.left, y: r.bottom - origin.top };
            }
            idx -= L;
        }
        return null;
    };
    const stride = Math.max(1, Math.ceil(len / 48));
    for (let i = 0; i < len; i += stride) {
        const p = at(i, false);
        if (p) pts.push(p);
    }
    const end = at(len - 1, true);
    if (end) pts.push(end);
    return pts;
}

// Writes the visual state of a slot from the progress (t) of each of its tasks.
const APPLY = {
    frame(slot) {
        const { draw, fill, polish } = slot.by;
        const s = slot.surface;
        if (draw) {
            const t = draw.t;
            const cut = `${((1 - easeInOut(t)) * 100).toFixed(2)}%`;
            css(s, 'opacity', t > 0 ? '1' : '0');
            css(s, 'clipPath', t > 0 && t < 1 ? `inset(0 ${cut} ${cut} 0)` : 'none');
        } else {
            css(s, 'opacity', '1');
        }
        if (fill && slot.fill) {
            const t = fill.t;
            css(slot.fill, 'opacity', t > 0 ? '1' : '0');
            if (t > 0 && t < 1) {
                const { w, h } = slot.rect;
                const ox = w * fill.ox;
                const oy = h * fill.oy;
                const r = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy)) * easeOut(t);
                css(slot.fill, 'clipPath', `circle(${r.toFixed(1)}px at ${ox.toFixed(1)}px ${oy.toFixed(1)}px)`);
            } else {
                css(slot.fill, 'clipPath', 'none');
            }
        }
        if (polish) {
            const e = easeInOut(polish.t);
            css(s, 'borderRadius', `${(polish.radius * e).toFixed(2)}px`);
            css(
                s,
                'boxShadow',
                polish.shadow && e > 0
                    ? `0 ${(22 * e).toFixed(1)}px ${(50 * e).toFixed(1)}px -22px rgba(64, 32, 16, ${(0.32 * e).toFixed(
                          3,
                      )}), 0 1px 3px rgba(24, 24, 27, ${(0.08 * e).toFixed(3)})`
                    : 'none',
            );
        }
    },

    text(slot) {
        const { type, scale } = slot.by;
        if (type) {
            const n = typedCount(slot, type.t);
            if (n !== slot.n) {
                slot.n = n;
                writeText(slot, n);
            }
            placeCaret(slot, type.t > 0 && type.t < 1 ? n : -1);
        }
        if (scale) {
            const s = scaleOf(slot, scale.t);
            css(slot.piece, 'transform', s >= 0.9999 ? 'none' : `scale(${s.toFixed(4)})`);
        }
    },

    input(slot) {
        const { type } = slot.by;
        if (!type) return;
        const n = typedCount(slot, type.t);
        if (n !== slot.n) {
            slot.n = n;
            slot.el.placeholder = slot.text.slice(0, n);
        }
    },

    item(slot) {
        const { drag, pop } = slot.by;
        const p = slot.piece;
        if (drag) {
            const t = drag.t;
            css(p, 'opacity', t > 0 ? '1' : '0');
            css(slot.el, 'zIndex', t > 0 && t < 1 ? '30' : '');
            if (t > 0 && t < 1) {
                const q = dragPose(drag, t);
                css(
                    p,
                    'transform',
                    `translate3d(${q.ox.toFixed(1)}px, ${q.oy.toFixed(1)}px, 0) rotate(${q.rot.toFixed(
                        2,
                    )}deg) scale(${q.sc.toFixed(4)})`,
                );
            } else {
                css(p, 'transform', 'none');
            }
        } else if (pop) {
            const t = pop.t;
            css(p, 'opacity', t > 0 ? '1' : '0');
            css(p, 'transform', t > 0 && t < 1 ? `scale(${(0.5 + 0.5 * easeOutBack(t)).toFixed(4)})` : 'none');
        } else {
            css(p, 'opacity', '1');
        }
    },

    line(slot) {
        const { line } = slot.by;
        if (!line) return;
        const e = easeInOut(line.t);
        css(slot.piece, 'opacity', line.t > 0 ? '1' : '0');
        css(
            slot.piece,
            'transform',
            line.t >= 1 ? 'none' : slot.horizontal ? `scaleX(${e.toFixed(4)})` : `scaleY(${e.toFixed(4)})`,
        );
    },

    anchor() {},
};

export default class StudioEngine {
    constructor() {
        this.stages = new Map();
        this.order = [];
        this.slots = new Set();
        this.tasks = [];
        this.agents = AGENTS.map((a) => ({
            ...a,
            el: null,
            label: null,
            ring: null,
            sel: null,
            badge: null,
            timeline: [],
            amp: 3,
            lab: 1,
        }));
        this.mode = 'build';
        this.mounted = false;
        this.needSchedule = true;
        this.needMeasure = true;
        this.forceAll = false;
        this.y = 0;
        this.view = 0;
        this.vw = 1;
        this.vh = 1;
        this.total = 0;
        this.camY = 0;
        this.seq = 0;
        this.raf = 0;
        this.last = 0;
        this.mountedAt = 0;
        this.snapUntil = 0;
        this.tween = null;
        this.keepProgress = null;
        this.fxOn = false;
        this.fxBudget = 0;
    }

    // ---------------------------------------------------------------- registry

    addStage(stage) {
        this.stages.set(stage.id, stage);
        this.needSchedule = true;
        return () => {
            if (this.stages.get(stage.id) === stage) this.stages.delete(stage.id);
            this.needSchedule = true;
        };
    }

    addSlot(slot) {
        slot.seq = this.seq++;
        slot.n = -1;
        slot.caretIdx = -1;
        this.slots.add(slot);
        this.needSchedule = true;
        return () => {
            this.slots.delete(slot);
            this.needSchedule = true;
        };
    }

    addAgentView(index, view) {
        const agent = this.agents[index];
        Object.assign(agent, view);
        return () => {
            for (const key of Object.keys(view)) if (agent[key] === view[key]) agent[key] = null;
        };
    }

    // ---------------------------------------------------------------- lifecycle

    mount({ root, screen, spacer, bg }) {
        this.root = root;
        this.screen = screen;
        this.spacer = spacer;
        this.bg = bg;
        this.coarse = window.matchMedia('(pointer: coarse)').matches;
        window.addEventListener('resize', this.onResize);
        screen.addEventListener('load', this.onAsset, true);
        if (document.fonts) {
            document.fonts.ready.then(this.onAsset);
            if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', this.onAsset);
        }
        this.mounted = true;
        this.mountedAt = performance.now();
        this.rebuild();
        if (this.mode === 'build') {
            this.measure();
            this.y = window.scrollY;
            this.view = this.y;
            this.render(this.y, performance.now() / 1000);
        } else {
            this.enterPresent(false);
        }
        this.snapUntil = performance.now() + 700;
        this.last = performance.now();
        this.raf = requestAnimationFrame(this.tick);
    }

    unmount() {
        cancelAnimationFrame(this.raf);
        window.removeEventListener('resize', this.onResize);
        if (this.screen) this.screen.removeEventListener('load', this.onAsset, true);
        if (document.fonts && document.fonts.removeEventListener) {
            document.fonts.removeEventListener('loadingdone', this.onAsset);
        }
        this.mounted = false;
    }

    onResize = () => {
        const w = this.screen.clientWidth;
        const h = window.innerHeight;
        // mobile browsers resize the viewport while their toolbars slide in and out
        if (this.coarse && w === this.vw && Math.abs(h - this.vh) < 160) return;
        if (this.mode === 'build') this.keepProgress = this.total ? window.scrollY / this.total : 0;
        this.needMeasure = true;
    };

    onAsset = () => {
        this.needMeasure = true;
    };

    tick = (now) => {
        this.raf = requestAnimationFrame(this.tick);
        const dt = Math.min(64, now - this.last);
        this.last = now;
        if (this.needSchedule) this.rebuild();
        if (this.mode !== 'build') return;
        if (this.needMeasure) this.measure();

        const target = window.scrollY;
        const tw = this.tween;
        if (tw && Math.abs(target - tw.to) > 2) this.tween = null;
        if (this.tween) {
            const u = clamp((now - tw.t0) / tw.dur);
            this.y = lerp(tw.from, tw.to, easeInOut(u));
            if (u >= 1) this.tween = null;
        } else if (now < this.snapUntil) {
            this.y = target;
        } else {
            this.y += (target - this.y) * (1 - Math.exp(-dt / SMOOTH_MS));
            if (Math.abs(target - this.y) < 0.3) this.y = target;
        }

        const first = this.order[0];
        const intro = first ? first.start + first.len * INTRO * easeOut(clamp((now - this.mountedAt - 300) / INTRO_MS)) : 0;
        const view = Math.max(this.y, intro);
        const dv = view - this.view;
        this.view = view;
        // completion effects only while the build moves forward at a human pace
        this.fxOn = dv > 0.05 && dv < this.vh * 0.35 && !this.tween && (intro > this.y || now >= this.snapUntil);
        this.render(view, now / 1000);
    };

    // ---------------------------------------------------------------- planning

    rebuild() {
        this.needSchedule = false;
        this.order = [...this.stages.values()].sort((a, b) => a.order - b.order);
        this.order.forEach((s, i) => {
            s.index = i;
        });
        const tasks = [];
        for (const slot of this.slots) {
            slot.stage = this.stages.get(slot.stageId) || null;
            slot.tasks = [];
            slot.by = {};
            slot.complete = undefined;
            if (!slot.stage) continue;
            for (const spec of slot.specs) {
                const task = { ...spec, slot, stage: slot.stage, agent: null, t: 0, A: 0, B: 0 };
                slot.tasks.push(task);
                slot.by[spec.type] = task;
                tasks.push(task);
            }
        }
        tasks.sort((p, q) => p.stage.index - q.stage.index || p.a - q.a || p.slot.seq - q.slot.seq);
        this.tasks = tasks;
        this.schedule();
        for (const slot of this.slots) {
            const { type } = slot.by;
            if (type && slot.segs) for (const seg of slot.segs) seg.caret.style.background = type.agent.color;
        }
        this.needMeasure = true;
    }

    // Groups the tasks of an element into jobs done by one agent, then hands every job to the
    // free agent with the matching skill and the least work so far. When the whole crew is busy
    // the job waits for the first agent to free up, so nobody is ever in two places at once.
    schedule() {
        const jobs = [];
        const open = new Map();
        for (const task of this.tasks) {
            if (task.agentIndex != null) {
                jobs.push({ tasks: [task], stage: task.stage, fixed: task.agentIndex, prev: null });
                continue;
            }
            const key = task.slot.job ? `${task.stage.id}/${task.slot.job}` : task.slot;
            const last = open.get(key);
            if (last && task.a - last.b <= JOB_GAP) {
                last.tasks.push(task);
                last.b = Math.max(last.b, task.b);
            } else {
                const job = { tasks: [task], stage: task.stage, fixed: null, prev: last || null, b: task.b };
                open.set(key, job);
                jobs.push(job);
            }
        }
        for (const job of jobs) {
            job.tasks.sort((p, q) => p.a - q.a);
            for (let i = 1; i < job.tasks.length; i++) {
                const d = job.tasks[i - 1].b + 0.004 - job.tasks[i].a;
                if (d > 0) {
                    job.tasks[i].a += d;
                    job.tasks[i].b += d;
                }
            }
            job.a = job.tasks[0].a;
            job.b = Math.max(...job.tasks.map((t) => t.b));
            job.skill = SKILL[job.tasks[0].type];
            job.seq = job.tasks[0].slot.seq;
        }
        jobs.sort((p, q) => p.stage.index - q.stage.index || p.a - q.a || p.seq - q.seq);

        const n = this.agents.length;
        const state = this.agents.map(() => ({ stage: -1, until: 0, count: 0 }));
        for (const job of jobs) {
            let pick = job.fixed;
            let delay = 0;
            if (pick == null) {
                const before = job.prev && job.prev.agent;
                let best = Infinity;
                for (let i = 0; i < n; i++) {
                    const s = state[i];
                    const wait = s.stage === job.stage.index ? Math.max(0, s.until + BUSY_MARGIN - job.a) : 0;
                    const score =
                        wait * 1000 +
                        (this.agents[i].skill === job.skill ? 0 : 30) +
                        (before && before.id === i ? -25 : 0) +
                        s.count * 3 +
                        i * 1e-3;
                    if (score < best) {
                        best = score;
                        pick = i;
                        delay = wait;
                    }
                }
            }
            if (delay > 0 || job.b > 0.99) placeJob(job, job.a + delay);
            job.agent = this.agents[pick];
            for (const task of job.tasks) task.agent = job.agent;
            const s = state[pick];
            state[pick] = {
                stage: job.stage.index,
                until: s.stage === job.stage.index ? Math.max(s.until, job.b) : job.b,
                count: s.count + 1,
            };
        }
    }

    measure() {
        this.needMeasure = false;
        const vw = this.screen.clientWidth || window.innerWidth;
        const vh = window.innerHeight;
        this.vw = vw;
        this.vh = vh;
        this.root.style.setProperty('--stage-h', `${vh}px`);

        for (const s of this.order) {
            css(s.el, 'transform', 'none');
            css(s.content, 'transform', 'none');
        }
        for (const slot of this.slots) if (slot.kind === 'text') css(slot.piece, 'transform', 'none');
        // sections whose content is taller than their block get scaled down to fit
        const fits = this.order.map((s) => ({ s, h: s.content.offsetHeight, avail: s.body.clientHeight }));
        for (const { s, h, avail } of fits) {
            const k = h > avail + 1 ? avail / h : 1;
            css(s.content, 'transform', k === 1 ? 'none' : `scale(${k.toFixed(4)})`);
        }

        const stageRects = new Map();
        for (const s of this.order) stageRects.set(s, s.el.getBoundingClientRect());
        const range = document.createRange();
        for (const slot of this.slots) {
            const sr = slot.stage && stageRects.get(slot.stage);
            if (!sr) continue;
            const r = slot.el.getBoundingClientRect();
            slot.rect = { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
            slot.hidden = r.width < 1 && r.height < 1;
            if (slot.block) slot.stage.blockRect = slot.rect;
            if (slot.kind === 'text') {
                const p = slot.piece.getBoundingClientRect();
                slot.prect = { x: p.left - sr.left, y: p.top - sr.top, w: p.width, h: p.height };
                const center = getComputedStyle(slot.el).textAlign === 'center';
                slot.origin = { x: slot.prect.x + (center ? slot.prect.w / 2 : 0), y: slot.prect.y };
                css(slot.piece, 'transformOrigin', center ? '50% 0' : '0 0');
                slot.samples = sampleText(slot, range, sr);
            } else if (slot.kind === 'input') {
                const { x, y, w, h } = slot.rect;
                const x0 = x + 16;
                const y0 = y + Math.min(h, 48) / 2 + 9;
                slot.samples = [
                    { i: 0, x: x0, y: y0 },
                    { i: slot.len, x: Math.min(x + w - 12, x0 + slot.len * 7.4), y: y0 },
                ];
            } else if (slot.kind === 'line') {
                slot.horizontal = r.width >= r.height;
            }
        }

        this.layoutTimeline();
        this.prepareTasks();
        this.placeSpots();

        if (this.keepProgress != null) {
            const y = this.keepProgress * this.total;
            this.keepProgress = null;
            window.scrollTo(0, y);
            this.y = window.scrollY;
        }
        this.forceAll = true;
    }

    layoutTimeline() {
        const { vh } = this;
        const last = this.order.length - 1;
        let y = 0;
        this.order.forEach((s, i) => {
            s.start = y;
            s.len = s.build * vh;
            s.end = y + s.len + HOLD * vh;
            y = s.end + (i < last ? GAP * vh : 0);
        });
        this.total = last >= 0 ? this.order[last].end : 0;
        this.spacer.style.height = `${Math.round(this.total + vh)}px`;
    }

    prepareTasks() {
        const { vw, vh } = this;
        for (const task of this.tasks) {
            const s = task.stage;
            task.A = s.start + task.a * s.len;
            task.B = s.start + task.b * s.len;
            if (task.type !== 'drag' || !task.slot.rect) continue;
            const R = task.slot.rect;
            let dx = 0;
            let dy = 0;
            if (Array.isArray(task.from)) [dx, dy] = task.from;
            else if (task.from === 'right') dx = vw - R.x + 40;
            else if (task.from === 'top') dy = -(R.y + R.h) - 40;
            else if (task.from === 'bottom') dy = vh - R.y + 40;
            else dx = -(R.x + R.w) - 40;
            const rnd = mulberry32(task.slot.seq * 131 + 7);
            task.dx = dx;
            task.dy = dy;
            task.bend = (rnd() - 0.5) * 0.3;
            task.tilt = (rnd() < 0.5 ? -1 : 1) * (3 + rnd() * 5);
            task.gx = clamp(R.w * 0.42, 10, 72);
            task.gy = clamp(R.h * 0.5, 10, 44);
        }
        for (const ag of this.agents) ag.timeline = [];
        for (const task of this.tasks) if (task.slot.rect && !task.slot.hidden) task.agent.timeline.push(task);
        for (const ag of this.agents) ag.timeline.sort((p, q) => p.A - q.A);
    }

    // Waiting spots spread evenly (with a little randomness) in the margins around each section,
    // so idle agents never sit on top of the content.
    placeSpots() {
        const { vw, vh } = this;
        const n = this.agents.length;
        for (const s of this.order) {
            const B = s.blockRect || { x: 0, y: 0, w: vw, h: vh };
            const top = B.y;
            const bottom = vh - B.y - B.h;
            const left = B.x;
            const right = vw - B.x - B.w;
            const x0 = B.x + 24;
            const x1 = Math.max(x0, B.x + B.w - 84);
            const bands = [];
            if (top >= SPOT_BAND) bands.push([x0, top / 2 - 11, x1, top / 2 - 11]);
            if (right >= 56) bands.push([B.x + B.w + right / 2 - 9, B.y + 40, B.x + B.w + right / 2 - 9, B.y + B.h - 60]);
            if (bottom >= SPOT_BAND) bands.push([x1, B.y + B.h + bottom / 2 - 11, x0, B.y + B.h + bottom / 2 - 11]);
            if (left >= 56) bands.push([left / 2 - 9, B.y + B.h - 60, left / 2 - 9, B.y + 40]);
            if (!bands.length) bands.push([12, vh - 34, vw - 84, vh - 34]);
            const lens = bands.map(([ax, ay, bx, by]) => Math.hypot(bx - ax, by - ay) || 1);
            const total = lens.reduce((p, q) => p + q, 0);
            const rnd = mulberry32(977 + s.index * 131);
            const seats = this.agents.map((a) => a.id);
            for (let i = seats.length - 1; i > 0; i--) {
                const j = Math.floor(rnd() * (i + 1));
                [seats[i], seats[j]] = [seats[j], seats[i]];
            }
            const phase = rnd();
            s.spots = [];
            for (let k = 0; k < n; k++) {
                let d = ((((k + phase + (rnd() - 0.5) * 0.45) / n) % 1) + 1) % 1;
                d *= total;
                let j = 0;
                while (j < bands.length - 1 && d > lens[j]) {
                    d -= lens[j];
                    j++;
                }
                const [ax, ay, bx, by] = bands[j];
                const u = clamp(d / lens[j]);
                s.spots[seats[k]] = { x: lerp(ax, bx, u) + (rnd() - 0.5) * 10, y: lerp(ay, by, u) + (rnd() - 0.5) * 6 };
            }
        }
    }

    // ---------------------------------------------------------------- frame

    cameraAt(y) {
        const { order, vh } = this;
        let camY = 0;
        for (let i = 0; i < order.length; i++) {
            const s = order[i];
            const next = order[i + 1];
            if (!next || y <= s.end) {
                camY = i * vh;
                break;
            }
            if (y < next.start) {
                camY = (i + easeInOut(clamp((y - s.end) / (next.start - s.end)))) * vh;
                break;
            }
        }
        this.camY = camY;
    }

    canvas(task, p) {
        return { x: p.x, y: p.y + task.stage.index * this.vh };
    }

    spot(ag, stageIndex) {
        const s = this.order[stageIndex];
        const p = (s && s.spots && s.spots[ag.id]) || { x: this.vw / 2, y: this.vh - 30 };
        return { x: p.x, y: p.y + stageIndex * this.vh };
    }

    render(y, time) {
        const { vh } = this;
        this.cameraAt(y);
        const force = this.forceAll;
        this.forceAll = false;

        for (const s of this.order) {
            const rel = s.index * vh - this.camY;
            s.visible = Math.abs(rel) < vh - 0.5;
            css(s.el, 'visibility', s.visible ? 'visible' : 'hidden');
            if (s.visible) css(s.el, 'transform', `translate3d(0, ${rel.toFixed(2)}px, 0)`);
            if (s.off !== !s.visible) {
                s.off = !s.visible;
                s.el.classList.toggle('is-off', s.off);
            }
        }
        css(this.bg, 'transform', `translate3d(0, ${(-(this.camY / vh) * 26).toFixed(1)}px, 0)`);

        this.fxBudget = FX_PER_FRAME;
        for (const slot of this.slots) {
            if (!slot.stage || !slot.rect || slot.hidden) continue;
            if (!slot.stage.visible && !force) continue;
            this.applySlot(slot, y);
        }

        for (const ag of this.agents) this.renderAgent(ag, y, time);
    }

    applySlot(slot, y) {
        const present = this.mode !== 'build';
        let done = slot.tasks.length > 0;
        for (const task of slot.tasks) {
            task.t = present ? 1 : tAt(task, y);
            if (task.t < 1) done = false;
        }
        APPLY[slot.kind](slot);
        if (done === slot.complete) return;
        if (done && slot.complete === false && this.fxOn && this.fxBudget > 0 && slot.stage.visible) {
            this.fxBudget -= 1;
            this.celebrate(slot, y);
        }
        slot.complete = done;
        // finished elements start their idle animations from CSS
        if (slot.el) slot.el.toggleAttribute('data-done', done);
    }

    // A small reward when an element is finished: sparks in the agent's color, an outline pulse
    // and a little landing bounce for dropped elements.
    celebrate(slot, y) {
        const last = slot.tasks.reduce((p, q) => (q.B > p.B ? q : p));
        if (last.type === 'gather') return;
        if (slot.kind === 'item' && slot.piece.animate) {
            slot.piece.animate([{ transform: 'scale(1.08)' }, { transform: 'scale(0.97)' }, { transform: 'scale(1)' }], {
                duration: 420,
                easing: 'ease-out',
            });
        }
        if (!slot.block && (slot.kind === 'frame' || slot.kind === 'item' || slot.kind === 'input')) {
            this.pulse(slot, last.agent.color);
        }
        const p = this.cursorAt(last, 1, y);
        this.burst(slot.stage, p.x, p.y, last.agent.color);
    }

    pulse(slot, color) {
        const layer = slot.stage.fx;
        const R = slot.rect;
        if (!layer || R.w < 8 || R.h < 8) return;
        const shape = slot.surface || (slot.piece && slot.piece.firstElementChild) || slot.el;
        const el = document.createElement('i');
        el.className = 'st-pulse';
        el.style.cssText = `left:${R.x.toFixed(1)}px;top:${R.y.toFixed(1)}px;width:${R.w.toFixed(1)}px;height:${R.h.toFixed(1)}px;color:${color};border-radius:${getComputedStyle(shape).borderRadius}`;
        layer.appendChild(el);
        const grow = `scale(${(1 + 18 / R.w).toFixed(3)}, ${(1 + 18 / R.h).toFixed(3)})`;
        const anim = el.animate(
            [
                { transform: 'scale(1)', opacity: 0.95 },
                { transform: grow, opacity: 0 },
            ],
            { duration: 700, easing: 'cubic-bezier(.2, .8, .3, 1)' },
        );
        anim.onfinish = () => el.remove();
    }

    burst(stage, x, y, color) {
        const layer = stage.fx;
        if (!layer || typeof layer.animate !== 'function') return;
        const n = this.vw < 640 ? 6 : 8;
        for (let i = 0; i < n; i++) {
            const el = document.createElement('i');
            el.className = i % 2 ? 'st-spark' : 'st-spark is-star';
            el.style.left = `${x.toFixed(1)}px`;
            el.style.top = `${y.toFixed(1)}px`;
            el.style.background = color;
            layer.appendChild(el);
            const a = (i / n) * Math.PI * 2 + Math.random() * 0.7;
            const d = 18 + Math.random() * 26;
            const dx = Math.cos(a) * d;
            const dy = Math.sin(a) * d;
            const anim = el.animate(
                [
                    { transform: 'translate(0, 0) scale(0.2) rotate(0deg)', opacity: 0 },
                    { transform: `translate(${dx}px, ${dy}px) scale(1) rotate(60deg)`, opacity: 1, offset: 0.4 },
                    { transform: `translate(${dx * 1.4}px, ${dy * 1.4 + 8}px) scale(0.3) rotate(120deg)`, opacity: 0 },
                ],
                { duration: 640 + Math.random() * 220, easing: 'cubic-bezier(.2, .8, .3, 1)' },
            );
            anim.onfinish = () => el.remove();
        }
    }

    cursorAt(task, t, y) {
        const slot = task.slot;
        const R = slot.rect;
        switch (task.type) {
            case 'draw': {
                const e = easeInOut(t);
                return { x: R.x + R.w * e, y: R.y + R.h * e };
            }
            case 'line': {
                const e = easeInOut(t);
                return slot.horizontal ? { x: R.x + R.w * e, y: R.y + R.h / 2 } : { x: R.x + R.w / 2, y: R.y + R.h * e };
            }
            case 'type':
                return this.caretPoint(slot, t, y);
            case 'drag': {
                const p = dragPose(task, t);
                return { x: R.x + p.ox + task.gx, y: R.y + p.oy + task.gy };
            }
            case 'pop':
                return { x: R.x + R.w * 0.55 + 10 * t, y: R.y + R.h * 0.6 + 8 * t };
            case 'fill':
                return { x: R.x + R.w * task.ox + 8 * t, y: R.y + R.h * task.oy + 6 * t };
            case 'polish': {
                const d = 7 + task.radius * 0.6 * easeInOut(t);
                return { x: R.x + d, y: R.y + d };
            }
            case 'scale': {
                const P = slot.prect;
                const o = slot.origin;
                const s = scaleOf(slot, t);
                return { x: o.x + (P.x + P.w - o.x) * s, y: o.y + (P.y + P.h - o.y) * s };
            }
            case 'gather':
                return this.ringPoint(task, t);
            default:
                return { x: R.x, y: R.y };
        }
    }

    caretPoint(slot, t, y) {
        const S = slot.samples;
        const R = slot.rect;
        if (!S || !S.length) return { x: R.x, y: R.y + R.h };
        const n = slot.len * clamp((t - 0.05) / 0.95);
        let k = 0;
        while (k < S.length - 1 && S[k + 1].i <= n) k++;
        const p = S[k];
        const q = S[Math.min(k + 1, S.length - 1)];
        const u = q.i > p.i ? clamp((n - p.i) / (q.i - p.i)) : 0;
        let x = lerp(p.x, q.x, u);
        let yy = lerp(p.y, q.y, u);
        if (slot.by.scale) {
            const s = scaleOf(slot, tAt(slot.by.scale, y));
            x = slot.origin.x + (x - slot.origin.x) * s;
            yy = slot.origin.y + (yy - slot.origin.y) * s;
        }
        return { x: x + 1, y: yy + 2 };
    }

    ringPoint(task, t) {
        const R = task.slot.rect;
        const n = this.agents.length;
        const i = task.agent.id;
        if (this.vw / 2 - 48 > R.w / 2 + 60) {
            const rx = Math.min(R.w / 2 + 110, this.vw / 2 - 48);
            const ry = Math.min(R.h / 2 + 90, this.vh / 2 - 70);
            const th = -Math.PI / 2 + (i / n) * Math.PI * 2 + t * 0.8;
            return { x: R.x + R.w / 2 + rx * Math.cos(th) - 8, y: R.y + R.h / 2 + ry * Math.sin(th) - 8 };
        }
        // too narrow to circle the words: two arcs, above and below them
        const m = Math.ceil(n / 2);
        const u = (Math.floor(i / 2) + 0.5) / m;
        const lift = Math.sin(u * Math.PI) * 18;
        return {
            x: R.x + 8 + u * (R.w - 56) + Math.sin(t * Math.PI * 2 + i) * 6,
            y: i % 2 ? R.y + R.h + 24 + lift : R.y - 48 - lift,
        };
    }

    // Position of an agent that has no task right now: out of the way in its spot around the
    // section, riding along with the camera to the next one, then flying in to its next task.
    between(ag, prev, next, y) {
        const { order, vh } = this;
        const bend = ag.id % 2 ? 0.16 : -0.16;
        const fly = (from, to, a, b, state) => ({
            pos: arc(from, to, easeInOut(clamp((y - a) / Math.max(1, b - a))), bend),
            state,
        });
        const toNext = (from, readyAt) => {
            const ts = Math.max(readyAt, next.A - TRAVEL * vh);
            return y > ts ? fly(from, this.canvas(next, this.cursorAt(next, 0, y)), ts, next.A, 'travel') : null;
        };

        let at = 0;
        let pos = this.spot(ag, 0);
        let readyAt = 0;
        if (prev) {
            const end = this.canvas(prev, this.cursorAt(prev, 1, y));
            if (!next) return { pos: end, state: prev.type === 'gather' ? 'ring' : 'park' };
            if (next.stage === prev.stage && next.A - prev.B < (2 * TRAVEL + 0.1) * vh) {
                return toNext(end, prev.B) || { pos: end, state: 'park' };
            }
            at = prev.stage.index;
            pos = this.spot(ag, at);
            readyAt = prev.B + TRAVEL * vh;
            if (y < readyAt) return fly(end, pos, prev.B, readyAt, 'leave');
        }

        const target = next ? next.stage.index : at;
        while (at < target) {
            const gapA = order[at].end;
            const gapB = order[at + 1].start;
            if (y <= gapA) return { pos, state: 'around' };
            const direct = at + 1 === target && next.A - gapB < TRAVEL * vh;
            const dest = direct ? this.canvas(next, this.cursorAt(next, 0, y)) : this.spot(ag, at + 1);
            if (y < gapB) return fly(pos, dest, gapA, gapB, direct ? 'travel' : 'migrate');
            if (direct) return { pos: dest, state: 'travel' };
            pos = dest;
            readyAt = gapB;
            at += 1;
        }
        return (next && toNext(pos, readyAt)) || { pos, state: 'around' };
    }

    renderAgent(ag, y, time) {
        if (!ag.el) return;
        const T = ag.timeline;
        let i = -1;
        while (i + 1 < T.length && T[i + 1].A <= y) i++;
        const prev = i >= 0 ? T[i] : null;
        let pos;
        let state;
        let work = null;
        let wt = 0;
        if (prev && y < prev.B) {
            work = prev;
            wt = tAt(prev, y);
            pos = this.canvas(prev, this.cursorAt(prev, wt, y));
            state = 'work';
        } else {
            ({ pos, state } = this.between(ag, prev, T[i + 1] || null, y));
        }

        const first = this.order[0];
        const greeting = state === 'around' && first && y < first.start + first.len * 0.12;
        const labelOn = state === 'work' || state === 'travel' || state === 'ring' || greeting;
        ag.lab += ((labelOn ? 1 : 0) - ag.lab) * 0.16;
        css(ag.label, 'opacity', ag.lab > 0.995 ? '1' : ag.lab < 0.005 ? '0' : ag.lab.toFixed(3));

        ag.amp += ((WANDER[state] || 0) - ag.amp) * 0.08;
        let x = pos.x;
        let yy = pos.y;
        if (ag.amp > 0.05) {
            const [a, b, c, d] = ag.wander;
            x += ag.amp * (Math.sin(time * a.f + a.p) * 0.65 + Math.sin(time * b.f * 1.7 + b.p) * 0.35);
            yy += ag.amp * (Math.cos(time * c.f + c.p) * 0.65 + Math.sin(time * d.f * 1.6 + d.p) * 0.35);
        }
        css(ag.el, 'transform', `translate3d(${x.toFixed(1)}px, ${(yy - this.camY).toFixed(1)}px, 0)`);

        const u = work && work.type !== 'gather' ? clamp((y - work.A) / (this.vh * 0.06)) : 1;
        css(ag.ring, 'opacity', u < 1 ? (0.8 * (1 - u)).toFixed(3) : '0');
        if (u < 1) css(ag.ring, 'transform', `scale(${(0.35 + 1.3 * u).toFixed(3)})`);

        this.renderSelection(ag, work, wt, y);
    }

    renderSelection(ag, task, t, y) {
        const sel = ag.sel;
        if (!sel) return;
        if (!task || t <= 0 || t >= 1 || task.type === 'line' || task.type === 'gather') {
            css(sel, 'display', 'none');
            return;
        }
        const slot = task.slot;
        const R = slot.prect || slot.rect;
        let x = R.x;
        let yy = R.y;
        let w = R.w;
        let h = R.h;
        let tf = '';
        let badge = '';
        if (task.type === 'draw') {
            const e = easeInOut(t);
            w *= e;
            h *= e;
            badge = `${Math.round(w)} × ${Math.round(h)}`;
        } else if (task.type === 'drag') {
            const p = dragPose(task, t);
            x += p.ox;
            yy += p.oy;
            tf = ` rotate(${p.rot.toFixed(2)}deg) scale(${p.sc.toFixed(4)})`;
        } else if (task.type === 'polish') {
            const e = easeInOut(t);
            const d = 7 + task.radius * 0.6 * e;
            if (sel.__d !== d) {
                sel.__d = d;
                sel.style.setProperty('--d', `${d.toFixed(1)}px`);
            }
            badge = `Radius ${Math.round(task.radius * e)}`;
        } else if (slot.by.scale) {
            const s = scaleOf(slot, task.type === 'scale' ? t : tAt(slot.by.scale, y));
            const o = slot.origin;
            x = o.x + (x - o.x) * s;
            yy = o.y + (yy - o.y) * s;
            w *= s;
            h *= s;
            if (task.type === 'scale') badge = `${Math.round(w)} × ${Math.round(h)}`;
        }
        const top = yy + task.stage.index * this.vh - this.camY;
        css(sel, 'display', 'block');
        css(sel, 'transform', `translate3d(${x.toFixed(1)}px, ${top.toFixed(1)}px, 0)${tf}`);
        css(sel, 'width', `${w.toFixed(1)}px`);
        css(sel, 'height', `${h.toFixed(1)}px`);
        if (sel.__kind !== task.type) {
            sel.__kind = task.type;
            sel.setAttribute('data-kind', task.type);
        }
        if (ag.badge && ag.badge.__text !== badge) {
            ag.badge.__text = badge;
            ag.badge.textContent = badge;
        }
    }

    // ---------------------------------------------------------------- navigation & modes

    // Jumps to a section; in build mode it lands on the finished section.
    goto(id, where = 'end') {
        const s = this.stages.get(id);
        if (!s) return;
        if (this.mode !== 'build') {
            s.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        const from = this.y;
        window.scrollTo(0, Math.round(where === 'start' ? s.start : s.end));
        const to = window.scrollY;
        this.tween = { from, to, t0: performance.now(), dur: clamp(Math.abs(to - from) / 7, 450, 1800) };
    }

    setMode(mode) {
        if (mode === this.mode) return;
        this.mode = mode;
        if (!this.mounted) return;
        if (mode === 'build') this.enterBuild();
        else this.enterPresent(true);
    }

    enterPresent(keepPlace) {
        const k = this.vh ? clamp(Math.round(this.camY / this.vh), 0, Math.max(0, this.order.length - 1)) : 0;
        this.tween = null;
        for (const s of this.order) {
            css(s.el, 'transform', '');
            css(s.el, 'visibility', '');
            css(s.content, 'transform', '');
            s.off = false;
            s.el.classList.remove('is-off');
        }
        css(this.bg, 'transform', '');
        for (const slot of this.slots) if (slot.stage) this.applySlot(slot, Infinity);
        for (const ag of this.agents) css(ag.sel, 'display', 'none');
        this.spacer.style.height = '0px';
        const target = keepPlace ? this.order[k] : null;
        window.scrollTo(0, target ? target.el.getBoundingClientRect().top + window.scrollY : 0);
    }

    enterBuild() {
        let k = 0;
        this.order.forEach((s, i) => {
            if (s.el.getBoundingClientRect().top <= window.innerHeight * 0.4) k = i;
        });
        this.measure();
        const s = this.order[k];
        window.scrollTo(0, s ? Math.round(s.end) : 0);
        this.y = window.scrollY;
        this.view = this.y;
        this.tween = null;
        this.render(this.y, performance.now() / 1000);
    }
}
