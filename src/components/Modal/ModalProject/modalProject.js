import classNames from 'classnames';

import Button from '~/components/Button';

import { useState, memo } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

import Modal from '~/components/Modal';

const cx = classNames;
function ModalProject({ data, children }) {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = async () => {
        setShowModal(true);
    };
    const handleHideModal = () => {
        setShowModal(false);
    };

    const renderTech = () => {
        return data.technology.map((item, index) => {
            return (
                <div key={index} className={cx('pl-20', 'max-xs:pl-0')}>
                    <p className={cx(' font-light   ')}>
                        - <span className={cx('font-medium')}>{item.type}:</span> {item.detail.join(', ')}
                    </p>
                </div>
            );
        });
    };
    const renderSrcCode = () => {
        return data.src.map((item, index) => {
            return (
                <div key={index} className={cx('pl-20 flex font-light items-center break-words', 'max-xs:pl-0')}>
                    - <span className={cx('font-medium')}>{item.type}:</span>{' '}
                    <Button href={item.url} target="blank" className={'underline italic text-blue-500'}>
                        {item.url}
                    </Button>
                </div>
            );
        });
    };

    const renderModal = () => {
        return (
            <Modal
                isShow={showModal}
                isHidden={handleHideModal}
                className={cx('w-3/4 max-h-[800px] text-black p-2 overflow-auto  pr-3 pl-3', 'max-xs:w-full')}
            >
                <div className={cx('p-5 lg:px-52 text-slate-600')}>
                    <div className={cx('hidden w-full justify-end ', 'max-xs:flex')}>
                        <Button onClick={handleHideModal} className={cx('text-red-500 text-3xl')}>
                            <FaTimesCircle />
                        </Button>
                    </div>
                    <div>
                        <img src={data.img} alt={data.name} className={cx('w-full h-80 object-contain')} />
                        <p className={cx('break-words text-center  text-2xl font-medium text-tp-orange mt-3 mb-3')}>
                            {data.name}
                        </p>
                    </div>

                    {data.demo && (
                        <div className={cx(' flex font-light items-center')}>
                            <span className={cx('font-medium')}>Demo:</span>{' '}
                            <Button href={data.demo} target="blank" className={'underline italic text-blue-500'}>
                                {data.demo}
                            </Button>
                        </div>
                    )}
                    <p className={cx(' font-light ')}>
                        <span className={cx('font-medium')}>Description:</span> {data.description}
                    </p>
                    <p className={cx(' font-light  ')}>
                        <span className={cx('font-medium')}>Member:</span> {data.member}
                    </p>
                    <p className={cx('  font-medium ')}>
                        Position: <span className={cx('font-bold text-tp-orange')}>{data.position.join(', ')}</span>
                    </p>
                    <p className={cx(' font-light   ')}>
                        <span className={cx('font-medium')}>OS:</span> {data.type.join(', ')}
                    </p>
                    <p className={cx(' font-light   ')}>
                        <span className={cx('font-medium')}>Technology:</span>
                    </p>
                    {renderTech()}
                    {data.src.length > 0 && (
                        <p className={cx(' font-light   ')}>
                            <span className={cx('font-medium')}>Source code:</span>
                        </p>
                    )}
                    {renderSrcCode()}
                </div>
            </Modal>
        );
    };

    return (
        <>
            <div className="hvr-grow">
                <Button className={cx('drop-item', 'w-96 h-80 m-5')} onClick={handleShowModal}>
                    {children}
                </Button>
            </div>

            {showModal && renderModal()}
        </>
    );
}

export default memo(ModalProject);
