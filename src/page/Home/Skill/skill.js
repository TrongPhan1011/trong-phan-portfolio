import classNames from 'classnames';

import ItemSkill from '~/components/ItemSkill';

import img1 from '~/assets/img/5.png';
import img2 from '~/assets/img/6.png';
import imgNodeJS from '~/assets/img/nodejs.png';
import imgJava from '~/assets/img/java.svg';
import imgSpring from '~/assets/img/spring.png';
import imgSqlServer from '~/assets/img/sqlserver.png';
import imgMySql from '~/assets/img/mysql.png';
import imgMongoDB from '~/assets/img/mongodb.png';
import imgJS from '~/assets/img/js.png';
import imgReactJS from '~/assets/img/reactjs.png';
import imgTailWind from '~/assets/img/tailwind.png';
import imgMUI from '~/assets/img/mui.png';
import imgGit from '~/assets/img/git.svg';
import imgFigma from '~/assets/img/figma.svg';
import imgAWS from '~/assets/img/aws.png';
import typescript from '~/assets/img/typescript.png';
import nextjs from '~/assets/img/nextjs.png';
import nestjs from '~/assets/img/nestjs.png';

const cx = classNames;

function Skill() {
    return (
        <>
            <div id="skill" className={cx('w-full min-h-screen relative text-lg')}>
                <img src={img1} alt="img1" className={cx('absolute -z-20 top-32 left-5 h-60 object-contain')} />
                <img src={img2} alt="img2" className={cx('absolute -z-20 bottom-1 right-5 h-60 object-contain')} />
                <div className={cx('w-full h-full  pr-36 pl-36 pt-20 ', 'max-xs:pl-5 max-xs:pr-5')}>
                    <div className={cx('text-3xl text-center text-tp-orange font-medium mb-10 ')}>My Skill</div>
                    <p className={cx('text-2xl font-medium')}>- Back-end</p>
                    <div className={cx('flex flex-wrap justify-center ')}>
                        <ItemSkill src={nestjs} />
                        <ItemSkill src={imgNodeJS} />
                        <ItemSkill src={imgJava} />
                        <ItemSkill src={imgSpring} />
                        <ItemSkill src={imgSqlServer} />
                        <ItemSkill src={imgMySql} />
                        <ItemSkill src={imgMongoDB} />
                    </div>
                    <p className={cx('text-2xl font-medium mt-10')}>- Front-end</p>
                    <div className={cx('flex flex-wrap justify-center ')}>
                        <ItemSkill src={nextjs} />
                        <ItemSkill src={imgJS} />
                        <ItemSkill src={imgReactJS} />
                        <ItemSkill src={imgTailWind} />
                        <ItemSkill src={imgMUI} />
                    </div>
                    <p className={cx('text-2xl font-medium mt-10')}>- Other</p>
                    <div className={cx('flex flex-wrap justify-center ')}>
                        <ItemSkill src={typescript} />
                        <ItemSkill src={imgGit} />
                        <ItemSkill src={imgFigma} />
                        <ItemSkill src={imgAWS} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Skill;
