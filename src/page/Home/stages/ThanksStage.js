import { FiArrowRight, FiRotateCcw } from 'react-icons/fi';

import deco2 from '~/assets/img/deco-2.webp';
import deco3 from '~/assets/img/deco-3.webp';
import deco4 from '~/assets/img/deco-4.webp';
import deco8 from '~/assets/img/deco-8.webp';
import { Gather, Stage, Type, useEngine, useStudioMode } from '~/studio';
import { Blob, Btn, Sticker } from './shared';

const decor = (
    <>
        <Blob
            at={[0.05, 0.14]}
            from="right"
            color="rgba(248, 80, 35, 0.16)"
            className="-right-[14%] -top-[30%] w-[80%] sm:w-[40%]"
        />
        <Blob
            at={[0.07, 0.16]}
            from="left"
            color="rgba(139, 92, 246, 0.13)"
            className="-bottom-[30%] -left-[12%] w-[80%] sm:w-[40%]"
        />
        <Sticker
            src={deco3}
            at={[0.1, 0.22]}
            from="left"
            className="left-[4%] top-[5%]"
            size="h-[110px] lg:h-[190px]"
            tilt={5}
        />
        <Sticker
            src={deco2}
            at={[0.14, 0.26]}
            from="right"
            className="right-[3%] top-[8%]"
            size="h-[70px] lg:h-[130px]"
            tilt={-4}
            delay={2}
        />
        <Sticker
            src={deco8}
            at={[0.2, 0.32]}
            from="left"
            className="-bottom-14 -left-16"
            size="h-[160px] lg:h-[280px]"
            drift={11}
            tilt={3}
            delay={7}
        />
        <Sticker
            src={deco4}
            at={[0.26, 0.38]}
            from="right"
            className="-bottom-12 -right-10"
            size="h-[150px] lg:h-[260px]"
            drift={12}
            delay={5}
        />
    </>
);

function ThanksStage() {
    const engine = useEngine();
    const { mode, setMode } = useStudioMode();

    const replay = () => {
        if (mode === 'present') {
            setMode('build');
            requestAnimationFrame(() => engine.goto('hero', 'start'));
        } else {
            engine.goto('hero', 'start');
        }
    };
    const viewFinal = () => {
        if (mode === 'build') setMode('present');
        requestAnimationFrame(() => window.scrollTo(0, 0));
    };

    return (
        <Stage id="thanks" order={6} label="Thanks" build={1} polish={[0.3, 0.37]} decor={decor}>
            <div className="relative flex flex-col items-center justify-center px-6 py-10 text-center">
                <Gather at={[0.42, 1]} className="flex max-w-2xl flex-col items-center">
                    <Type at={[0.06, 0.13]} className="text-lg font-medium text-tp-orange" label="eyebrow">
                        That's a wrap
                    </Type>
                    <Type
                        as="h2"
                        at={[0.08, 0.2]}
                        className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl"
                        label="heading"
                    >
                        Thanks for scrolling.
                    </Type>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Btn
                            as="button"
                            type="button"
                            onClick={replay}
                            at={0.14}
                            color="#18181B"
                            text="Replay the build"
                            icon={<FiRotateCcw />}
                            motion="spin"
                        />
                        <Btn
                            as="button"
                            type="button"
                            onClick={viewFinal}
                            at={0.2}
                            text="View final design"
                            icon={<FiArrowRight />}
                            cta
                        />
                    </div>
                </Gather>
                <Type
                    at={[0.24, 0.34]}
                    className="absolute bottom-4 left-0 right-0 text-sm text-zinc-400"
                    label="footer"
                >
                    {`© ${new Date().getFullYear()} Trong Phan`}
                </Type>
            </div>
        </Stage>
    );
}

export default ThanksStage;
