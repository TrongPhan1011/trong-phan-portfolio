import routeConfig from './configRoutes';

import Home from '~/page/Home';

//public

const route = routeConfig.routeConfig;

const publicRoutes = [
    {
        path: route.home,
        component: Home,
    },
];
const privateRoutes = [];

export { publicRoutes, privateRoutes };
