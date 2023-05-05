import classNames from 'classnames';
import img1 from '~/assets/img/1.png';
import img2 from '~/assets/img/2.png';
import about from '~/assets/img/about.svg';
import Button from '~/components/Button';

const cx = classNames;
function About() {
    return (
        <>
            <div id="about" className={cx('w-full h-screen relative text-lg')}>
                <img src={img1} alt="img1" className={cx('absolute -z-20 top-32 left-5 h-56 object-contain')} />
                <img src={img2} alt="img2" className={cx('absolute -z-20 bottom-1 right-5 h-40 object-contain')} />
                <div className={cx('w-full h-full flex pr-36 pl-36 pt-20 items-center', 'max-xs:pr-5 max-xs:pl-5')}>
                    <div className={cx('w-1/2', 'max-xs:hidden')}>
                        <img src={about} alt="about" className={cx('h-3/4 object-contain')} />
                    </div>
                    <div className={cx('w-1/2 h-2/3  pl-20 space-y-6', 'max-xs:w-full max-xs:pl-0 max-xs:text-center')}>
                        <div className={cx('text-3xl text-tp-orange font-medium')}>About me</div>
                        <p className={cx('text-justify font-bold text-4xl', 'max-xs:text-3xl')}>
                            Welcome to my portfolio!
                        </p>
                        <p className={cx(' leading-8 text-xl text-slate-500')}>
                            Hello there! I'm Trong, a <span className={cx('text-tp-orange')}>Web developer</span>. I'm
                            very passionate and dedicated to my work. I'm from Thua Thien Hue province and I'm currently
                            studying at IUH (Industrial University of Ho Chi Minh City). My major is Sofware
                            engineering.
                        </p>
                        <Button
                            href="#contact"
                            className={cx(
                                'bg-tp-orange text-white p-3 pr-6 pl-6 mt-3 w-40 justify-center text-xl',
                                'max-xs:m-auto',
                            )}
                        >
                            Hire me
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;
