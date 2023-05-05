import classNames from 'classnames';

import img1 from '~/assets/img/9.png';
import img2 from '~/assets/img/10.png';

import Button from '~/components/Button';

import { HiLocationMarker, HiMail, HiPhone } from 'react-icons/hi';

const cx = classNames;

function Contact() {
    return (
        <>
            <div id="contact" className={cx('w-full min-h-screen relative text-lg')}>
                <img src={img1} alt="img1" className={cx('absolute -z-20 top-32  h-60 object-contain')} />
                <img src={img2} alt="img2" className={cx('absolute -z-20 bottom-1 right-5 h-60 object-contain')} />
                <div className={cx('w-full h-full  pr-36 pl-36 pt-20 ', 'max-xs:pl-5 max-xs:pr-5')}>
                    <div className={cx('text-3xl text-center text-tp-orange font-medium mb-10 ')}>Contact Me</div>
                    <p className={cx('text-slate-600 text-xl font-light text-center')}>
                        Please fill out the form on this section or call to contact with me.
                    </p>
                    <div className={cx('w-full flex  justify-between items-center pt-10', 'max-xs:flex-col')}>
                        <div className={cx(' p-5 mt-5')}>
                            <div className={cx('flex ')}>
                                <div
                                    className={cx(
                                        'w-20 h-20  rounded-full bg-tp-orange bg-opacity-20 text-tp-orange text-3xl flex justify-center items-center',
                                    )}
                                >
                                    <HiLocationMarker />
                                </div>
                                <div className="w-72">
                                    <p className={cx('text-2xl font-medium ml-5')}>Address</p>
                                    <p className={cx('font-light ml-5')}>Tan Phu District, Ho Chi Minh City</p>
                                </div>
                            </div>
                            <div className={cx('flex  mt-5')}>
                                <div
                                    className={cx(
                                        'w-20 h-20  rounded-full bg-green-500 bg-opacity-20 text-green-500 text-3xl flex justify-center items-center',
                                    )}
                                >
                                    <HiMail />
                                </div>
                                <div className="w-72">
                                    <p className={cx('text-2xl font-medium ml-5')}>Phone</p>
                                    <p className={cx('font-light ml-5')}>0363435019</p>
                                </div>
                            </div>
                            <div className={cx('flex  mt-5')}>
                                <div
                                    className={cx(
                                        'w-20 h-20  rounded-full bg-yellow-400 bg-opacity-20 text-yellow-400 text-3xl flex justify-center items-center',
                                    )}
                                >
                                    <HiPhone />
                                </div>
                                <div className="w-72">
                                    <p className={cx('text-2xl font-medium ml-5')}>Email</p>
                                    <p className={cx('font-light ml-5')}>huutrong2k1@gmail.com</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex mb-3 w-full justify-between space-x-3">
                                <input
                                    type="text"
                                    className={cx(
                                        'w-1/2 border border-slate-400 rounded-md pl-5 pr-5 p-2 outline-tp-orange caret-tp-orange',
                                    )}
                                    placeholder="Your name"
                                />
                                <input
                                    type="text"
                                    className={cx(
                                        'w-1/2 border border-slate-400 rounded-md pl-5 pr-5 p-2 outline-tp-orange caret-tp-orange',
                                    )}
                                    placeholder="Your email"
                                />
                            </div>
                            <div className="flex mb-3 w-full justify-between space-x-3">
                                <input
                                    type="text"
                                    className={cx(
                                        'w-1/2 border border-slate-400 rounded-md pl-5 pr-5 p-2 outline-tp-orange caret-tp-orange',
                                    )}
                                    placeholder="Your phone"
                                />
                                <input
                                    type="text"
                                    className={cx(
                                        'w-1/2 border border-slate-400 rounded-md pl-5 pr-5 p-2 outline-tp-orange caret-tp-orange',
                                    )}
                                    placeholder="Subject"
                                />
                            </div>
                            <textarea
                                className={cx(
                                    ' border border-slate-400 rounded-md pl-5 pr-5 p-2 outline-tp-orange caret-tp-orange w-full ',
                                )}
                                placeholder="Write your message here"
                                rows={4}
                            />
                            <Button
                                onClick={() => alert('ERROR: Can not submit this form!')}
                                className={cx(
                                    'bg-tp-orange text-white p-3 pr-6 pl-6 mt-3',
                                    'max-xs:m-auto max-xs:mb-3',
                                )}
                            >
                                Submit Now
                            </Button>
                        </div>

                        <div></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;
