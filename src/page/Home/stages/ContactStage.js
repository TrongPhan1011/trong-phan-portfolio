import classNames from 'classnames';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';

import deco10 from '~/assets/img/deco-10.webp';
import deco9 from '~/assets/img/deco-9.webp';
import { profile } from '~/lib/profile';
import { Box, Pop, Stage, Type, TypedInput } from '~/studio';
import { Blob, Btn, Heading, Sticker } from './shared';

const cx = classNames;

const CONTACTS = [
    {
        icon: <FiMail />,
        label: 'Email',
        value: profile.email,
        href: `mailto:${profile.email}`,
        tone: 'bg-orange-50 text-tp-orange',
    },
    {
        icon: <FiPhone />,
        label: 'Phone',
        value: profile.phone,
        href: `tel:${profile.phone}`,
        tone: 'bg-emerald-50 text-emerald-600',
    },
    { icon: <FiMapPin />, label: 'Based in', value: profile.address, tone: 'bg-sky-50 text-sky-600' },
];

const decor = (
    <>
        <Blob at={[0.04, 0.13]} from="left" color="rgba(248, 80, 35, 0.12)" className="-bottom-[34%] -left-[16%] w-[84%] sm:w-[46%]" />
        <Sticker
            src={deco9}
            at={[0.04, 0.15]}
            from="top"
            className="-right-6 -top-4 lg:-right-3 lg:-top-6"
            size="h-[100px] lg:h-[170px]"
            tilt={5}
        />
        <Sticker
            src={deco10}
            at={[0.66, 0.78]}
            from="left"
            className="right-[2%] top-[30%] lg:bottom-[3%] lg:left-[2%] lg:right-auto lg:top-auto"
            size="h-[90px] lg:h-[160px]"
            drift={10}
            delay={3}
        />
    </>
);

// One agent draws the field, types its placeholder, then turns it into a white input.
function Field({ at, text, as, className, ...rest }) {
    const job = `field:${text}`;
    return (
        <Box
            draw={[at, at + 0.05]}
            base="#E4E4E7"
            fill={[at + 0.15, at + 0.2]}
            color="#FFFFFF"
            fillClassName="border border-zinc-300"
            origin={[0.08, 0.5]}
            radius={12}
            job={job}
            label={`“${text}” field`}
            className={cx('block rounded-xl focus-within:ring-2 focus-within:ring-tp-orange/30', className)}
        >
            <TypedInput
                as={as}
                at={[at + 0.055, at + 0.145]}
                text={text}
                job={job}
                className="relative block w-full resize-none bg-transparent px-4 py-2.5 text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400 sm:py-3"
                {...rest}
            />
        </Box>
    );
}

function sendMail(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = `Hello from ${name || 'your portfolio'}`;
    const body = `${message}\n\n${[name, email].filter(Boolean).join(' · ')}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function ContactStage() {
    return (
        <Stage id="contact" order={5} label="Contact" build={1.3} decor={decor}>
            <div className="grid items-center gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:px-14">
                <div>
                    <Heading eyebrow="Contact" title="Let's build something together" at={0.03} />
                    <Type at={[0.1, 0.22]} className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-600 sm:mt-4 lg:text-lg" label="subtitle">
                        Have an idea, a role or a bug that needs squashing? My inbox is open.
                    </Type>
                    <ul className="mt-4 space-y-2.5 sm:mt-6 lg:mt-8 lg:space-y-3">
                        {CONTACTS.map((c, i) => {
                            const o = i * 0.07;
                            const job = `contact:${c.label}`;
                            return (
                                <li key={c.label} className="flex items-center gap-3 sm:gap-4">
                                    <Pop at={[0.16 + o, 0.2 + o]} job={job} label={`${c.label} icon`} className="shrink-0">
                                        <span
                                            style={{ '--i': i }}
                                            className={cx('st-hop grid h-10 w-10 place-items-center rounded-2xl text-lg sm:h-12 sm:w-12 sm:text-xl', c.tone)}
                                        >
                                            {c.icon}
                                        </span>
                                    </Pop>
                                    <div className="min-w-0">
                                        <Type at={[0.205 + o, 0.24 + o]} job={job} className="text-xs text-zinc-500 sm:text-sm" label="contact label">
                                            {c.label}
                                        </Type>
                                        <Type
                                            as={c.href ? 'a' : 'p'}
                                            href={c.href}
                                            at={[0.245 + o, 0.33 + o]}
                                            job={job}
                                            className="block text-[15px] font-medium text-zinc-900 transition-colors hover:text-tp-orange lg:text-lg"
                                            label="contact value"
                                        >
                                            {c.value}
                                        </Type>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <Box
                    as="form"
                    onSubmit={sendMail}
                    draw={[0.08, 0.17]}
                    base="#E7E5E4"
                    fill={[0.34, 0.42]}
                    color="#FAFAF9"
                    fillClassName="border border-zinc-200"
                    polish={[0.8, 0.88]}
                    radius={24}
                    shadow
                    label="contact form"
                    className="grid gap-2.5 p-4 sm:gap-3 lg:p-7"
                >
                    <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                        <Field at={0.18} text="Your name" name="name" autoComplete="name" />
                        <Field at={0.26} text="Your email" name="email" type="email" autoComplete="email" />
                    </div>
                    <Field at={0.34} as="textarea" rows={3} text="Tell me about your project…" name="message" />
                    <Btn as="button" type="submit" at={0.6} text="Send message" icon={<FiSend />} motion="send" cta className="w-full" />
                </Box>
            </div>
        </Stage>
    );
}

export default ContactStage;
