import { luminance, mulberry32 } from './math';

// skill: which kind of task the scheduler prefers to hand to this agent
const ROSTER = [
    ['Frame', 'draw', '#F85023'],
    ['Kern', 'type', '#7B61FF'],
    ['Snap', 'move', '#0D99FF'],
    ['Hue', 'color', '#14AE5C'],
    ['Glyph', 'type', '#E83E8C'],
    ['Align', 'move', '#F59E0B'],
    ['Grid', 'draw', '#0891B2'],
    ['Nudge', 'move', '#65A30D'],
];

export const AGENTS = ROSTER.map(([name, skill, color], i) => {
    const rnd = mulberry32(i * 7919 + 17);
    return {
        id: i,
        name,
        skill,
        color,
        ink: luminance(color) > 0.42 ? '#18181B' : '#FFFFFF',
        wander: [0, 1, 2, 3].map(() => ({ f: 0.35 + rnd() * 0.6, p: rnd() * Math.PI * 2 })),
    };
});
