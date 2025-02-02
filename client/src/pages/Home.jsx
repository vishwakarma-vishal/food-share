import HeroSection from "../components/homepage/HeroSection";
import WorkSection from "../components/homepage/WorkSection";
import WhyUsSection from "../components/homepage/WhyUsSection";
import FAQSection from "../components/homepage/FAQSection";

const Home = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-4 space-y-10 flex flex-col gap-4 sm:gap-10 lg:gap-12 my-8">
            <HeroSection />
            <WorkSection />
            <WhyUsSection />
            <FAQSection />
        </div>
    )
}

export default Home;