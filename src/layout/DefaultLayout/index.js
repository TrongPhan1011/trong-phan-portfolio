import { memo } from 'react';
import classNames from 'classnames';

import Header from './Header';

const cx = classNames;
function DefaultLayout({ children }) {
    return (
        <div className={cx('w-full  ')}>
            <Header />
            {children}
        </div>
    );
}

export default memo(DefaultLayout);
