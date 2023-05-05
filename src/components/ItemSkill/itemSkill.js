import classNames from 'classnames/bind';
import styles from './itemSkill.module.scss';

const cx = classNames.bind(styles);
function ItemSkill({ src, ...passProps }) {
    return (
        <div className={cx('drop-item', 'w-36 h-36 overflow-hidden bg-opacity-10 backdrop-blur-sm relative m-3')}>
            <img src={src} alt="img" {...passProps} className={cx('w-36 h-36 p-3 object-scale-down', 'hvr-grow')} />
        </div>
    );
}

export default ItemSkill;
