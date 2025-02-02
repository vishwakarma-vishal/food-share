import { useNavigate } from "react-router-dom";
import useAuth from "../../utils/useAuth";

const HeroSection = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();

    return (
        <section
            className="min-h-[400px] lg:min-h-[480px] text-white flex flex-col bg-cover bg-center bg-no-repeat items-start justify-end pb-2 lg:pb-10 rounded-md sm:rounded-xl px-4 sm:px-10"
            style={{
                backgroundImage:
                    'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%), url("https://cdn.usegalileo.ai/sdxl10/1209d0c1-0be6-4eff-8e7d-abf045fa00b5.png")',
            }}>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-1 mb-2">Welcome to FoodShare</h2>
            <p className="text-base md:text-medium lg:text-lg mb-6">Millions of people go hungry every day while perfectly good food is thrown away. We're here to change that.</p>
            <button
                className="px-6 py-2 bg-green-500 hover:bg-green-600 transition-all duration-200 rounded-full text-sm sm:text-lg font-semibold"
                onClick={() => navigate(auth.isAuthenticated ? auth.role === "ngo" ? '/ngo-dashboard' : 'restaurant-dashboard' : '/login')}
            >
                {auth.isAuthenticated ? "Dashboard" : "Get started"}
            </button>
        </section>
    )
}

export default HeroSection;