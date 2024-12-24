import HeroSection from "../components/homepage/HeroSection";
import WorkSection from "../components/homepage/WorkSection";
import WhyUsSection from "../components/homepage/WhyUsSetion";
import FAQSection from "../components/homepage/FAQSection";

const Home = () => {
    return (
        <div className="space-y-10">
            <HeroSection />
            <WorkSection/>
            <WhyUsSection/>
            <FAQSection/>
        </div>
    )
}

export default Home;