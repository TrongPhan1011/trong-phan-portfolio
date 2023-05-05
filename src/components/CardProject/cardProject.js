import classNames from 'classnames';
import ModalProject from '../Modal/ModalProject';

const cx = classNames;

function CardProject({ data }) {
    return (
        <>
            <ModalProject data={data}>
                <div className={cx('w-full h-full p-3 flex flex-col justify-between')}>
                    <div>
                        <img src={data.img} alt={data.name} className={cx('w-full h-32 object-contain')} />
                        <p className={cx('break-words  text-xl font-medium text-tp-orange mt-3')}>{data.name}</p>
                    </div>
                    <p className={cx('text-sm text-slate-600 font-light ')}>{data.description}</p>
                </div>
            </ModalProject>
        </>
    );
}

export default CardProject;
