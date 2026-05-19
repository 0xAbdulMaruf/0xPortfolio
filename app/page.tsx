import AboutMe from './_components/AboutMe';
import Banner from './_components/Banner';
import Experiences from './_components/Experiences';
import Skills from './_components/Skills';
import ProjectList from './_components/ProjectList';
import CVEList from './_components/CVEList';
import ClickSpark from '@/components/ClickSpark';

export default function Home() {
    return (
        <ClickSpark
            sparkColor="#00ff41"
            sparkSize={12}
            sparkRadius={20}
            sparkCount={8}
            duration={400}
        >
            <div className="page-">
                <Banner />
                <AboutMe />
                <Skills />
                <Experiences />
                <CVEList />
                <ProjectList />
            </div>
        </ClickSpark>
    );
}
