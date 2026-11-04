import { memo, useLayoutEffect, useRef } from 'react';

import { AGENTS } from './agents';
import { useEngine } from './context';

const tone = (agent) => ({ '--c': agent.color, '--ink': agent.ink });

function Selection({ agent }) {
    const engine = useEngine();
    const sel = useRef(null);
    const badge = useRef(null);
    useLayoutEffect(
        () => engine.addAgentView(agent.id, { sel: sel.current, badge: badge.current }),
        [engine, agent.id],
    );
    return (
        <div ref={sel} className="st-sel" style={tone(agent)}>
            <span ref={badge} className="st-badge" />
            <i className="st-h st-h1" />
            <i className="st-h st-h2" />
            <i className="st-h st-h3" />
            <i className="st-h st-h4" />
        </div>
    );
}

function Cursor({ agent }) {
    const engine = useEngine();
    const el = useRef(null);
    const ring = useRef(null);
    const label = useRef(null);
    useLayoutEffect(
        () => engine.addAgentView(agent.id, { el: el.current, ring: ring.current, label: label.current }),
        [engine, agent.id],
    );
    return (
        <div ref={el} className="st-agent" style={tone(agent)}>
            <span ref={ring} className="st-ring" />
            <svg className="st-arrow" width="18" height="22" viewBox="0 0 18 22">
                <path
                    d="M1.5 1.5v16.2l4.3-4.1 2.9 6.6 3-1.3-2.9-6.5h6z"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
            <span ref={label} className="st-label">
                {agent.name}
            </span>
        </div>
    );
}

function AgentLayer() {
    return (
        <div className="st-agents" aria-hidden="true">
            {AGENTS.map((a) => (
                <Selection key={a.id} agent={a} />
            ))}
            {AGENTS.map((a) => (
                <Cursor key={a.id} agent={a} />
            ))}
        </div>
    );
}

export default memo(AgentLayer);
