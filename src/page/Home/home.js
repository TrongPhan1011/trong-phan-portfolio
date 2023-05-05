import classNames from 'classnames';
import avatar from '~/assets/img/avatar.png';
import Button from '~/components/Button';
import { FaFacebookF, FaLinkedinIn, FaGit } from 'react-icons/fa';
import About from './About';
import Skill from './Skill';
import Project from './Project';
import Contact from './Contact';

const cx = classNames;
function Home() {
    return (
        <div className={cx('w-full')}>
            <div
                className={cx(
                    'w-full h-screen bg-tp-slider bg-cover flex pr-36 pl-36',
                    'max-xs:flex-col-reverse',
                    'max-xs:pr-5 max-xs:pl-5',
                )}
            >
                <div
                    className={cx(
                        'w-1/2 flex flex-col h-full justify-center space-y-4',
                        'max-xs:w-full max-xs:text-center',
                    )}
                >
                    <div className={cx('text-3xl font-medium text-tp-orange', 'max-xs:text-2xl')}>Hello, I'm</div>
                    <span className={cx('text-5xl font-bold', 'max-xs:text-4xl')}>Phan Huu Trong</span>
                    <div className={cx('text-xl ')}>A Web Developer</div>
                    <div
                        className={cx(
                            'flex space-x-3 justify-center items-center pt-5',
                            'max-xs:flex-col max-xs:w-full',
                        )}
                    >
                        <Button
                            href="#about"
                            className={cx('bg-tp-orange p-3 pr-5 pl-5 w-40 text-white justify-center text-lg mr-5')}
                        >
                            About me
                        </Button>
                        <div className={cx('flex justify-center', 'max-xs:space-x-5 max-xs:mt-2')}>
                            <Button
                                href="https://www.facebook.com/phan.trong.319452"
                                className={cx(' text-lg hover:text-blue-700')}
                            >
                                <FaFacebookF />
                            </Button>
                            <Button
                                href="https://www.linkedin.com/in/phan-hữu-tr%E1%BB%8Dng-22b736229/"
                                className={cx('text-lg hover:text-blue-400')}
                            >
                                <FaLinkedinIn />
                            </Button>
                            <Button
                                href="https://github.com/TrongPhan1011"
                                className={cx('text-2xl hover:text-slate-600')}
                            >
                                <FaGit />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={cx('w-1/2 flex h-full justify-center items-center', 'max-xs:w-full max-xs:mt-28')}>
                    <img src={avatar} alt="trongphan-avatar" className={cx(' object-contain')} />
                </div>
            </div>
            <About />
            <Skill />
            <Project />
            <Contact />
            <div className={cx('w-full bg-slate-300 text-center p-5 text-white')}>TrongPhan</div>
        </div>
    );
}

export default Home;
