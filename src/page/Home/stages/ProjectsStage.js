import { useCallback, useState } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

import deco1 from '~/assets/img/deco-1.webp';
import deco7 from '~/assets/img/deco-7.webp';
import { dataProject } from '~/lib/templateData';
import { Box, Drag, Pop, Stage, Type } from '~/studio';
import ProjectDialog from './ProjectDialog';
import { Blob, Btn, Heading, Sticker } from './shared';

const decor = (
    <>
        <Blob at={[0.04, 0.13]} from="right" color="rgba(236, 72, 153, 0.12)" className="-right-[14%] -top-[28%] w-[84%] sm:w-[44%]" />
        <Sticker
            src={deco1}
            at={[0.04, 0.15]}
            from="top"
            className="right-[5%] top-[2%] lg:right-[6%] lg:top-[5%]"
            size="h-[110px] lg:h-[180px]"
            tilt={-6}
            delay={2}
        />
        <Sticker
            src={deco7}
            at={[0.82, 0.94]}
            from="right"
            className="-bottom-8 -right-14 lg:-bottom-12 lg:-right-10"
            size="h-[130px] lg:h-[230px]"
            drift={11}
            delay={6}
        />
    </>
);

function ProjectCard({ project: p, index, onOpen }) {
    const o = index * 0.08;
    return (
        <Box
            draw={[0.07 + o, 0.15 + o]}
            base="#ECECEC"
            fill={[0.44 + o, 0.52 + o]}
            color="#FFFFFF"
            fillClassName="border border-zinc-200"
            polish={[0.7 + o / 2, 0.78 + o / 2]}
            radius={22}
            shadow
            label={`${p.title} card`}
            className="st-card group flex gap-3 p-2.5 md:flex-col md:gap-0 md:p-3 lg:p-3.5"
        >
            <Drag
                at={[0.12 + o, 0.28 + o]}
                from={index % 2 ? 'right' : 'left'}
                label={`${p.title} screenshot`}
                className="w-[40%] max-w-[160px] shrink-0 md:w-auto md:max-w-none"
            >
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-zinc-100 bg-zinc-100 md:aspect-[16/10] md:rounded-2xl">
                    <img
                        src={p.img}
                        alt={`${p.title} screenshot`}
                        className="h-full w-full object-cover object-left-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        draggable={false}
                    />
                </div>
            </Drag>
            <div className="flex min-w-0 flex-1 flex-col py-0.5 md:px-1.5 md:pb-0.5 md:pt-4">
                <div className="flex items-center gap-2">
                    <Type as="h3" at={[0.2 + o, 0.28 + o]} className="text-base font-bold text-zinc-900 md:text-xl lg:text-2xl" label="project title">
                        {p.title}
                    </Type>
                    {p.badge && (
                        <Pop at={[0.3 + o, 0.35 + o]} label={`“${p.badge}” badge`}>
                            <span className="st-wiggle rounded-full bg-tp-orange px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                {p.badge}
                            </span>
                        </Pop>
                    )}
                </div>
                <Type at={[0.26 + o, 0.36 + o]} className="mt-0.5 text-[13px] leading-snug text-zinc-600 md:hidden" label="tagline">
                    {p.tagline}
                </Type>
                <Type
                    at={[0.26 + o, 0.42 + o]}
                    className="mt-1.5 hidden text-[15px] leading-relaxed text-zinc-600 md:block"
                    label="summary"
                >
                    {p.summary}
                </Type>
                <div className="mt-3 hidden flex-wrap gap-1.5 md:flex">
                    {p.stack.map((t, j) => (
                        <Drag key={t} at={[0.36 + o + j * 0.03, 0.46 + o + j * 0.03]} from="bottom" label={`${t} tag`}>
                            <span className="inline-flex rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">{t}</span>
                        </Drag>
                    ))}
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2 md:pt-4">
                    <Type at={[0.48 + o, 0.55 + o]} className="hidden text-sm text-zinc-500 md:block" label="project meta">
                        {p.meta || `${p.member} members · ${p.position[0]}`}
                    </Type>
                    <Btn
                        as="button"
                        type="button"
                        onClick={() => onOpen(p)}
                        at={0.56 + o}
                        color="#18181B"
                        text="Details"
                        icon={<FiArrowUpRight />}
                        motion="rise"
                        size="sm"
                    />
                </div>
            </div>
        </Box>
    );
}

function ProjectsStage() {
    const [open, setOpen] = useState(null);
    const close = useCallback(() => setOpen(null), []);
    return (
        <Stage id="projects" order={4} label="Projects" build={1.45} decor={decor}>
            <div className="flex flex-col justify-center px-4 py-6 sm:px-8 lg:px-14">
                <Heading eyebrow="Projects" title="Things I've built" at={0.03} />
                <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-5 lg:mt-10 lg:gap-6">
                    {dataProject.map((p, i) => (
                        <ProjectCard key={p.name} project={p} index={i} onOpen={setOpen} />
                    ))}
                </div>
            </div>
            <ProjectDialog project={open} onClose={close} />
        </Stage>
    );
}

export default ProjectsStage;
