import classNames from 'classnames';
import img1 from '~/assets/img/9.png';

import img2 from '~/assets/img/7.png';
import { experiences } from '../../../lib/experienceData';
import CardExperience from '../../../components/CardExperience/CardExperience';

const cx = classNames;
function Experience() {
    const renderExperienceCard = () => {
        return experiences.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === experiences.length - 1;
            return <CardExperience key={item} data={item} isLast={isLast} isFirst={isFirst} />;
        });
    };
    return (
        <>
            <div id="about" className={cx('w-full h-screen relative text-lg')}>
                <img src={img1} alt="img1" className={cx('absolute -z-20 top-32 left-5 h-56 object-contain')} />
                <img src={img2} alt="img2" className={cx('absolute -z-20 bottom-1 right-5 h-40 object-contain')} />
                <div className={cx('w-full h-full flex pr-36 pl-36 pt-20 items-center', 'max-xs:pr-5 max-xs:pl-5')}>
                    <div className="p-4 w-1/2 mx-auto dark:bg-gray-800">
                        <p className={cx('text-3xl text-center text-tp-orange font-medium mb-10 ')}>Experience</p>

                        {renderExperienceCard()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Experience;
