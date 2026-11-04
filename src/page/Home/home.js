import softPiano from '~/assets/audio/soft-piano.m4a';
import Studio from '~/studio';
import AboutStage from './stages/AboutStage';
import ContactStage from './stages/ContactStage';
import ExperienceStage from './stages/ExperienceStage';
import HeroStage from './stages/HeroStage';
import ProjectsStage from './stages/ProjectsStage';
import SkillsStage from './stages/SkillsStage';
import ThanksStage from './stages/ThanksStage';
import WelcomeGate from './WelcomeGate';

function Home() {
    return (
        <Studio music={softPiano} gate={WelcomeGate}>
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
