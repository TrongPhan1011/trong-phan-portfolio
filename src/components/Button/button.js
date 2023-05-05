import classNames from 'classnames';

import { Link, NavLink } from 'react-router-dom';

const cx = classNames;
function Button({ children, className, type, to, href, target, onClick, navLink, ...passProps }) {
    let Comp = 'button';
    const _props = {
        onClick,
        type,
        target,
        ...passProps,
    };

    if (to) {
        _props.to = to;

        Comp = Link;
    } else if (href) {
        _props.href = href;
        Comp = 'a';
    }

    var _className = cx('p-1 flex items-center  rounded-full', className);
    if (navLink) {
        Comp = NavLink;
        _className = (nav) =>
            cx('p-1 rounded-full flex items-center ', className, {
                active: nav.isActive,
            });
    }

    return (
        <Comp className={_className} {..._props}>
            {children}
        </Comp>
    );
}

export default Button;
