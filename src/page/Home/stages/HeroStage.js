import { FiArrowRight, FiDownload, FiFacebook, FiFeather, FiGithub, FiLayers, FiLinkedin, FiServer } from 'react-icons/fi';

import avatar from '~/assets/img/avatar.webp';
import deco10 from '~/assets/img/deco-10.webp';
import deco7 from '~/assets/img/deco-7.webp';
import { profile } from '~/lib/profile';
import { Box, Drag, Pop, Stage, Type } from '~/studio';
import { Blob, Btn, Chip, Sticker, useGoto } from './shared';

const NAV = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
];

const SOCIAL_ICONS = { github: <FiGithub />, linkedin: <FiLinkedin />, facebook: <FiFacebook /> };

const decor = (
    <>
        <Blob at={[0.07, 0.17]} from="right" color="rgba(248, 80, 35, 0.2)" className="-right-[12%] -top-[22%] w-[62%] sm:w-[46%]" />
        <Blob at={[0.1, 0.2]} from="left" color="rgba(139, 92, 246, 0.14)" className="-bottom-[26%] -left-[14%] w-[70%] sm:w-[40%]" />
        <Sticker
            src={deco10}
            at={[0.12, 0.24]}
            from="left"
            className="-left-3 bottom-[3%] lg:bottom-[4%] lg:left-[2%]"
            size="h-[104px] lg:h-[170px]"
            tilt={-5}
        />
        <Sticker
            src={deco7}
            at={[0.8, 0.92]}
            from="right"
            className="-right-14 top-[11%] lg:-bottom-10 lg:-right-12 lg:top-auto"
            size="h-[130px] lg:h-[240px]"
            drift={11}
            delay={3}
        />
    </>
);

function HeroStage() {
    const go = useGoto();
    return (
        <Stage id="hero" order={0} label="Hero" build={1.5} decor={decor}>
            <div className="flex flex-col px-3 pb-3 pt-3 sm:px-6 lg:px-10 lg:pt-5">
                <Box
                    as="nav"
                    draw={[0.08, 0.15]}
                    base="#ECECEC"
                    fill={[0.76, 0.82]}
                    color="#FFFFFF"
                    fillClassName="border border-zinc-100 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.35)]"
                    radius={16}
                    label="navbar"
                    className="flex h-12 items-center justify-between px-3 sm:h-14 sm:px-5"
                >
                    <Type
                        at={[0.13, 0.22]}
                        parts={[
                            { text: 'T', className: 'text-tp-orange' },
                            { text: 'rong' },
                            { text: 'P', className: 'text-tp-orange' },
                            { text: 'han' },
                        ]}
                        className="text-xl font-bold tracking-tight sm:text-2xl"
                        label="logo"
                    />
                    <div className="hidden items-center gap-7 text-[15px] font-medium text-zinc-700 md:flex">
                        {NAV.map((n, i) => (
                            <Drag
                                key={n.id}
                                at={[0.16 + i * 0.035, 0.27 + i * 0.035]}
                                from="top"
                                label={`“${n.label}” link`}
                            >
                                <a href={`#${n.id}`} onClick={go(n.id)} className="st-navlink transition-colors hover:text-tp-orange">
                                    {n.label}
                                </a>
                            </Drag>
                        ))}
                    </div>
                    <Pop at={[0.2, 0.25]} className="md:hidden" label="“Contact” pill">
                        <a
                            href="#contact"
                            onClick={go('contact')}
                            className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                            Contact
                        </a>
                    </Pop>
                </Box>

                <div className="flex flex-1 flex-col-reverse items-center justify-center gap-4 pt-3 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pt-0">
                    <div className="w-full text-center lg:text-left">
                        <Pop at={[0.17, 0.23]} className="inline-block" label="status pill">
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-xs font-medium text-emerald-700 sm:text-sm">
                                <span className="st-dot h-2 w-2 rounded-full bg-emerald-500" />
                                {profile.current}
                            </span>
                        </Pop>
                        <Type at={[0.19, 0.27]} className="mt-3 text-lg font-medium text-tp-orange sm:mt-4 lg:mt-6 lg:text-2xl" label="greeting">
                            Hello, I'm
                        </Type>
                        <Type
                            as="h1"
                            at={[0.22, 0.4]}
                            scale={[0.46, 0.58]}
                            from={0.6}
                            className="mt-1 text-[40px] font-bold leading-[1.02] tracking-tight text-zinc-900 sm:text-6xl lg:text-[80px]"
                            label="name"
                        >
                            {profile.name}
                        </Type>
                        <Type at={[0.3, 0.42]} className="mt-2 text-base font-medium text-zinc-800 sm:mt-3 lg:mt-5 lg:text-2xl" label="role">
                            {profile.role}
                        </Type>
                        <Type
                            at={[0.36, 0.58]}
                            className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-zinc-500 lg:mx-0 lg:mt-3 lg:text-lg"
                            label="intro"
                        >
                            I build complete products: databases, APIs, deployments and the interfaces on top of
                            them.
                        </Type>
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:mt-8 lg:justify-start">
                            <Btn
                                href={profile.cv}
                                download={profile.cvFileName}
                                at={0.46}
                                text="Download CV"
                                icon={<FiDownload />}
                                motion="drop"
                                cta
                                size="md"
                            />
                            <Btn
                                href="#contact"
                                onClick={go('contact')}
                                at={0.52}
                                color="#18181B"
                                text="Let's talk"
                                icon={<FiArrowRight />}
                                size="md"
                            />
                            <div className="flex w-full items-center justify-center gap-2 sm:ml-2 sm:w-auto">
                                {profile.socials.map((s, i) => (
                                    <Drag key={s.id} at={[0.62 + i * 0.05, 0.74 + i * 0.05]} from="left" label={`${s.name} icon`}>
                                        <a
                                            href={s.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={s.name}
                                            style={{ '--i': i }}
                                            className="st-hop grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white text-lg text-zinc-700 transition-colors hover:border-tp-orange hover:text-tp-orange sm:h-11 sm:w-11"
                                        >
                                            {SOCIAL_ICONS[s.id]}
                                        </a>
                                    </Drag>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative flex w-full justify-center">
                        <Drag at={[0.26, 0.44]} from="right" label="portrait" className="w-[140px] sm:w-[210px] lg:w-[min(410px,100%)]">
                            <img
                                src={avatar}
                                alt={profile.name}
                                className="st-float h-auto w-full select-none"
                                style={{ '--fd': '7s', '--fr': '0deg', '--fy': '-8px' }}
                                draggable={false}
                            />
                        </Drag>
                        <Drag at={[0.66, 0.78]} from="right" label="“Fullstack” chip" className="absolute right-0 top-[8%] hidden lg:block">
                            <Chip icon={<FiLayers />} className="st-bob">
                                Fullstack
                            </Chip>
                        </Drag>
                        <Drag at={[0.7, 0.82]} from="bottom" label="“UI / UX” chip" className="absolute bottom-[10%] left-0 hidden lg:block">
                            <Chip icon={<FiFeather />} className="st-bob" style={{ '--bdl': '-1.3s' }}>
                                UI / UX
                            </Chip>
                        </Drag>
                        <Drag
                            at={[0.74, 0.86]}
                            from="right"
                            label="“Systems” chip"
                            className="absolute bottom-[34%] right-[-12px] hidden lg:block"
                        >
                            <Chip icon={<FiServer />} className="st-bob" style={{ '--bdl': '-2.4s' }}>
                                Systems & DevOps
                            </Chip>
                        </Drag>
                    </div>
                </div>
            </div>
        </Stage>
    );
}

export default HeroStage;
