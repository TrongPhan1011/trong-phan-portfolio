import deco3 from '~/assets/img/deco-3.webp';
import deco8 from '~/assets/img/deco-8.webp';
import { skillGroups } from '~/lib/skillData';
import { Drag, Stage, Type } from '~/studio';
import { Blob, Heading, Sticker } from './shared';

const tiles = skillGroups.flatMap((g) => g.items);

const decor = (
    <>
        <Blob at={[0.05, 0.14]} from="left" color="rgba(132, 204, 22, 0.14)" className="-bottom-[30%] -left-[12%] w-[80%] sm:w-[42%]" />
        <Sticker
            src={deco3}
            at={[0.05, 0.16]}
            from="right"
            className="right-[4%] top-[2%] lg:right-[5%] lg:top-[5%]"
            size="h-[110px] lg:h-[200px]"
            tilt={5}
        />
        <Sticker
            src={deco8}
            at={[0.8, 0.92]}
            from="left"
            className="-bottom-10 -left-14 lg:-bottom-16 lg:-left-20"
            size="h-[150px] lg:h-[220px]"
            drift={12}
            tilt={3}
            delay={2}
        />
    </>
);

function SkillsStage() {
    return (
        <Stage id="skills" order={3} label="Skills" build={1.25} decor={decor}>
            <div className="flex flex-col justify-center px-4 py-6 sm:px-8 lg:px-14">
                <Heading eyebrow="Skills" title="The toolbox" at={0.04} />
                <div className="mt-5 grid gap-4 lg:mt-10 lg:gap-7">
                    {skillGroups.map((g, gi) => (
                        <div key={g.name} className="grid items-start gap-2 lg:grid-cols-[150px_1fr] lg:gap-6">
                            <Type
                                at={[0.1 + gi * 0.04, 0.17 + gi * 0.04]}
                                className="text-[15px] font-semibold text-zinc-800 lg:pt-8 lg:text-lg"
                                label="group label"
                            >
                                {g.name}
                            </Type>
                            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-7 lg:gap-3">
                                {g.items.map((s) => {
                                    const k = tiles.indexOf(s);
                                    return (
                                        <Drag
                                            key={s.name}
                                            at={[0.15 + k * 0.042, 0.31 + k * 0.042]}
                                            from={k % 2 ? 'right' : 'left'}
                                            label={`${s.name} logo`}
                                        >
                                            <div className="st-lift flex h-[74px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white px-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:h-[100px]">
                                                <img
                                                    src={s.img}
                                                    alt=""
                                                    style={{ '--i': k }}
                                                    className="st-hop h-7 w-7 object-contain lg:h-10 lg:w-10"
                                                    draggable={false}
                                                />
                                                <span className="mt-1.5 text-center text-[10.5px] font-medium leading-tight text-zinc-600 lg:mt-2 lg:text-xs">
                                                    {s.name}
                                                </span>
                                            </div>
                                        </Drag>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Stage>
    );
}

export default SkillsStage;
