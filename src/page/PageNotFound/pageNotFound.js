import pageNotFound from '~/assets/img/pageNotFound.svg';
import Button from '~/components/Button';
import config from '~/routes/configRoutes';

function PageNotFound() {
    const route = config.routeConfig;

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-2t-bg-page-not-found  bg-no-repeat bg-cover">
            <img src={pageNotFound} alt="pageNotFound" className="h-1/3 object-contain" />
            <Button
                to={route.home}
                className="bg-2t-yellow-1 text-xl pr-3 pl-3 mt-10 p-2 text-white w-52 justify-center"
            >
                Trang chủ
            </Button>
        </div>
    );
}

export default PageNotFound;
