import deco4 from '~/assets/img/deco-4.webp';
import deco9 from '~/assets/img/deco-9.webp';
import { experiences } from '~/lib/experienceData';
import { Box, Line, Pop, Stage, Type } from '~/studio';
import { Blob, Heading, Sticker } from './shared';

// oldest first, so the timeline reads left to right towards the current role
const jobs = [...experiences].reverse();

const decor = (
    <>
        <Blob at={[0.05, 0.15]} from="right" color="rgba(56, 189, 248, 0.14)" className="-right-[16%] -top-[34%] w-[80%] sm:w-[44%]" />
        <Sticker
            src={deco9}
            at={[0.06, 0.18]}
            from="right"
            className="-right-4 top-[3%] lg:-right-3 lg:top-[6%]"
            size="h-[120px] lg:h-[190px]"
            tilt={-6}
        />
        <Sticker
            src={deco4}
            at={[0.78, 0.9]}
            from="left"
            className="-bottom-10 -left-8 lg:-bottom-16 lg:-left-10"
            size="h-[140px] lg:h-[260px]"
            drift={12}
            delay={5}
        />
    </>
);

function ExperienceStage() {
    return (
        <Stage id="experience" order={2} label="Experience" build={1.35} decor={decor}>
            <div className="flex flex-col justify-center px-5 py-6 sm:px-8 lg:px-14">
                <Heading eyebrow="Experience" title="Where I've been shipping" at={0.05} />

                <div className="relative mt-6 lg:mt-14">
                    <Line
                        at={[0.12, 0.3]}
                        label="timeline"
                        className="absolute bottom-7 left-[41px] top-7 w-[2px] lg:bottom-auto lg:left-0 lg:right-0 lg:top-[43px] lg:h-[2px] lg:w-auto"
                    >
                        <span className="st-comet">
                            <i />
                        </span>
                    </Line>
                    <ol className="relative grid gap-3 lg:grid-cols-4 lg:gap-5">
                        {jobs.map((job, i) => {
                            const o = i * 0.1;
                            const current = i === jobs.length - 1;
                            return (
                                <li key={job.id} className="relative flex items-start gap-3 lg:block">
                                    <Pop at={[0.16 + o, 0.21 + o]} label={`${job.companyName} logo`} className="relative z-[1] shrink-0">
                                        <div className="st-lift grid h-14 w-[84px] place-items-center rounded-2xl border border-zinc-200 bg-white px-2.5 py-2 shadow-sm lg:h-[88px] lg:w-[132px] lg:px-4 lg:py-3">
                                            <img
                                                src={job.logoCompanySource}
                                                alt={job.companyName}
                                                className="max-h-full max-w-full object-contain"
                                                draggable={false}
                                            />
                                        </div>
                                    </Pop>
                                    <Box
                                        draw={[0.19 + o, 0.27 + o]}
                                        base="#ECECEC"
                                        fill={[0.46 + o, 0.53 + o]}
                                        color="#FFFFFF"
                                        fillClassName="border border-zinc-200"
                                        radius={18}
                                        label={`${job.companyName} card`}
                                        className="min-w-0 flex-1 px-4 py-3 lg:mt-6 lg:p-5"
                                    >
                                        <Type at={[0.26 + o, 0.34 + o]} className="text-[13px] font-medium text-zinc-500 lg:text-sm" label="period">
                                            {job.workTime}
                                        </Type>
                                        <Type
                                            as="h3"
                                            at={[0.3 + o, 0.41 + o]}
                                            className="mt-0.5 text-base font-bold text-zinc-900 lg:mt-1 lg:text-xl"
                                            label="company"
                                        >
                                            {job.companyName}
                                        </Type>
                                        <Type at={[0.34 + o, 0.45 + o]} className="text-sm text-zinc-600 lg:text-base" label="position">
                                            {job.position}
                                        </Type>
                                        {current && (
                                            <Pop at={[0.84, 0.89]} className="mt-2 inline-block lg:mt-3" label="“Current” badge">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-tp-orange/10 px-2.5 py-1 text-xs font-semibold text-tp-orange">
                                                    <span className="st-dot h-1.5 w-1.5 rounded-full bg-tp-orange" />
                                                    Current role
                                                </span>
                                            </Pop>
                                        )}
                                    </Box>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </Stage>
    );
}

export default ExperienceStage;
