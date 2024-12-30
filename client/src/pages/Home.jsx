import HeroSection from "../components/homepage/HeroSection";
import WorkSection from "../components/homepage/WorkSection";
import WhyUsSection from "../components/homepage/WhyUsSection";
import FAQSection from "../components/homepage/FAQSection";

const Home = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-4 space-y-10">
            <HeroSection />
            <WorkSection />
            <WhyUsSection />
            <FAQSection />
        </div>
    )
}

export default Home;