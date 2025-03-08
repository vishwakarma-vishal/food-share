import { useNavigate } from "react-router-dom";
import useAuth from "../../utils/useAuth";
import HeroImg from "../../../public/heroImg.jpg";

const HeroSection = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();

    return (
        <div className="bg-white flex flex-col-reverse sm:flex-row rounded-lg p-6 sm:p-10 items-center gap-6 sm:gap-12">
            {/* Text Section */}
            <div className="sm:w-1/2 text-center sm:text-left">
                <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-4">
                    Welcome to FoodShare
                </h2>
                <p className="text-base sm:text-md text-gray-700 lg:text-lg mb-6">
                    Millions of people go hungry every day while perfectly good food is thrown away.
                    <span className="text-green-500 font-semibold italic">"We're here to change that."</span>
                </p>
                <button
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 transition-all duration-200 rounded-full text-sm sm:text-lg font-semibold text-white"
                    onClick={() => navigate(auth.isAuthenticated ?
                        (auth.role === "ngo" ? "/ngo-dashboard" : "/restaurant-dashboard") : "/login")}
                >
                    {auth.isAuthenticated ? "Dashboard" : "Get started"}
                </button>
            </div>

            {/* Image Section */}
            <div className="sm:w-1/2">
                <img src={HeroImg} alt="Hero Image" className="w-full h-auto max-h-[300px] sm:max-h-none object-cover rounded-lg" />
            </div>
        </div>

    )
}

export default HeroSection;