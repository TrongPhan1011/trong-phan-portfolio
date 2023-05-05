import classNames from 'classnames';

import Button from '~/components/Button';

import { memo, useEffect, useState } from 'react';

import { RxTextAlignJustify } from 'react-icons/rx';

const cx = classNames;

function Header() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [changeBlockHeader, setChangeBlockHeader] = useState('');
    const [showMenu, setShowMenu] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const position = window.pageYOffset;
            setScrollPosition(position);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (scrollPosition > 100) {
            setChangeBlockHeader('fadeIn');
        } else setChangeBlockHeader('fadeOut');
    }, [scrollPosition]);

    return (
        <>
            <div
                className={cx(
                    'w-full h-20 fixed top-0 z-20 flex items-center p-3 pr-36 pl-36  ',
                    'max-xs:pr-3 max-xs:pl-3 ',
                    changeBlockHeader,
                )}
            >
                <div className={cx('font-bold text-4xl w-1/4', 'max-xs:text-center max-xs:w-full max-xs:text-3xl ')}>
                    <span className="text-tp-orange">T</span>rong<span className="text-tp-orange">P</span>han
                </div>
                <Button
                    onClick={() => {
                        if (!!showMenu) setShowMenu('');
                        else setShowMenu('max-xs:flex');
                    }}
                    className={cx('hidden text-3xl', 'max-xs:block')}
                >
                    <RxTextAlignJustify />
                </Button>

                <div className={cx('w-3/4 flex items-center space-x-10  text-lg font-medium', 'max-xs:hidden')}>
                    <Button to="#home">Home</Button>
                    <Button href="#about">About</Button>
                    <Button href="#skill">Skill</Button>

                    <Button href="#project">Project</Button>
                    <Button href="#contact">Contact</Button>
                    <Button
                        href="../../../file/cv/mycv.pdf"
                        className={cx('border-2  border-tp-orange p-2  pr-5 pl-5')}
                        download="CV_Phan Hữu Trọng_Fresher_Web developer.pdf"
                    >
                        Download CV
                    </Button>
                </div>
            </div>
            <div
                className={cx(
                    'w-full hidden items-center pb-5 z-10 flex-col text-lg font-medium fixed top-0 pt-20 bg-white',
                    showMenu,
                )}
            >
                <Button href="#home">Home</Button>
                <Button href="#about">About</Button>
                <Button href="#skill">Skill</Button>

                <Button href="#project">Project</Button>
                <Button href="#contact">Contact</Button>
                <Button
                    href="../../../file/cv/mycv.pdf"
                    className={cx('border-2  border-tp-orange p-2  pr-5 pl-5 max-w-[200px] justify-center')}
                    download="CV_Phan Hữu Trọng_Fresher_Web developer.pdf"
                >
                    Download CV
                </Button>
            </div>
        </>
    );
}

export default memo(Header);
