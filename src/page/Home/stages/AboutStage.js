import { FiArrowRight } from 'react-icons/fi';

import aboutArt from '~/assets/img/about.svg';
import deco1 from '~/assets/img/deco-1.webp';
import deco2 from '~/assets/img/deco-2.webp';
import { Box, Drag, Stage, Type } from '~/studio';
import { Blob, Btn, Heading, Sticker, useGoto } from './shared';

const FOCUS = ['Full-stack', 'System design', 'Databases', 'VM deployment', 'Security', 'UI / UX'];

const decor = (
    <>
        <Blob at={[0.05, 0.15]} from="left" color="rgba(251, 146, 60, 0.16)" className="-left-[18%] -top-[30%] w-[80%] sm:w-[48%]" />
        <Sticker
            src={deco1}
            at={[0.08, 0.2]}
            from="top"
            className="right-[5%] top-[2%] lg:left-[2%] lg:right-auto lg:top-[5%]"
            size="h-[110px] lg:h-[200px]"
            tilt={6}
        />
        <Sticker
            src={deco2}
            at={[0.76, 0.88]}
            from="right"
            className="-bottom-3 -right-5 lg:-bottom-4 lg:-right-6"
            size="h-[90px] lg:h-[150px]"
            drift={10}
            delay={4}
        />
    </>
);

function AboutStage() {
    const go = useGoto();
    return (
        <Stage id="about" order={1} label="About" build={1.25} decor={decor}>
            <div className="grid items-center gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:px-14">
                <Box
                    draw={[0.06, 0.16]}
                    base="#E7E5E4"
                    fill={[0.36, 0.44]}
                    color="#FFF1EB"
                    origin={[0.5, 0.5]}
                    polish={[0.64, 0.72]}
                    radius={28}
                    label="illustration card"
                    className="hidden aspect-[5/4] items-center justify-center p-10 lg:flex"
                >
                    <Drag at={[0.14, 0.32]} from="left" label="illustration" className="w-full">
                        <img
                            src={aboutArt}
                            alt=""
                            className="st-float w-full select-none"
                            style={{ '--fd': '8s', '--fr': '0deg', '--fy': '-8px' }}
                            draggable={false}
                        />
                    </Drag>
                </Box>

                <div>
                    <Heading eyebrow="About me" title="Welcome to my portfolio!" at={0.06} />
                    <Type at={[0.2, 0.44]} className="mt-4 text-[15px] leading-relaxed text-zinc-600 sm:mt-5 lg:text-lg" label="paragraph">
                        I'm a software engineer at NVIDIA, a global leader in graphics processing, AI and
                        high-performance computing.
                    </Type>
                    <Type at={[0.27, 0.6]} className="mt-3 text-[15px] leading-relaxed text-zinc-600 lg:text-lg" label="paragraph">
                        I enjoy solving full-stack problems: building and deploying software systems to VMs, optimizing
                        database performance, keeping systems secure and designing UI/UX. I stay curious about new
                        technology and keep improving how we ship.
                    </Type>
                    <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                        {FOCUS.map((f, i) => (
                            <Drag
                                key={f}
                                at={[0.46 + i * 0.04, 0.6 + i * 0.04]}
                                from={i % 2 ? 'right' : 'left'}
                                label={`“${f}” tag`}
                            >
                                <span className="st-lift inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[13px] font-medium text-zinc-700 sm:px-3.5 sm:text-sm">
                                    {f}
                                </span>
                            </Drag>
                        ))}
                    </div>
                    <Btn
                        href="#contact"
                        onClick={go('contact')}
                        at={0.72}
                        text="Hire me"
                        icon={<FiArrowRight />}
                        cta
                        className="mt-6 sm:mt-8"
                    />
                </div>
            </div>
        </Stage>
    );
}

export default AboutStage;
