import Studio from '~/studio';
import AboutStage from './stages/AboutStage';
import ContactStage from './stages/ContactStage';
import ExperienceStage from './stages/ExperienceStage';
import HeroStage from './stages/HeroStage';
import ProjectsStage from './stages/ProjectsStage';
import SkillsStage from './stages/SkillsStage';
import ThanksStage from './stages/ThanksStage';

function Home() {
    return (
        <Studio>
            <HeroStage />
            <AboutStage />
            <ExperienceStage />
            <SkillsStage />
            <ProjectsStage />
            <ContactStage />
            <ThanksStage />
        </Studio>
    );
}

export default Home;
