import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import useAuth from "../../utils/useAuth";

const Header = () => {
    const navigate = useNavigate();
    const { auth, logout } = useAuth();
    const location = useLocation();


    return (
        <header className="flex justify-between items-center px-4 md:px-8 lg:px-10 py-4 bg-white shadow-md">
            <div
                className="flex items-center gap-x-2 cursor-pointer"
                onClick={() => navigate('/')}>
                <div className="w-8 h-8 sm:w-12 sm:h-12">
                    <img src="/logo.svg"></img>
                </div>
                <span className="text-lg sm:text-xl font-bold">Food Share</span>
            </div>

            {/* only showing the menu item on homepage */}
            {
                location.pathname === "/" &&
                <div className="hidden md:block">
                    <nav className="flex gap-x-4 lg:gap-x-6 text-base font-semibold text-gray-800">
                        <a className="cursor-pointer hover:text-black transition-all duration-200" href="#Work">How it works</a>
                        <a className="cursor-pointer hover:text-black transition-all duration-200" href="#WhyUs">Why FoodShare?</a>
                        <a className="cursor-pointer hover:text-black transition-all duration-200" href="#faq">FAQs</a>
                    </nav>
                </div>
            }

            {auth.isAuthenticated ?
                <div className="flex gap-2 sm:gap-4 text-sm sm:text-base">
                    <button
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 transition-all duration-200 rounded-full text-white font-semibold"
                        onClick={() => navigate(auth.role === "ngo" ? '/ngo-dashboard' : '/restaurant-dashboard')}>
                        Dashboard
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 transition-all duration-200 rounded-full text-white font-semibold"
                        onClick={logout}>
                        Log out
                    </button>
                </div>
                :
                <div className="flex gap-2 sm:gap-4 text-sm sm:text-base">
                    <button
                        className="px-4 py-2 border border-green-500 bg-green-500 hover:bg-green-600 transition-all duration-200 rounded-full text-white font-semibold"
                        onClick={() => navigate('/signup')}>
                        Sign up
                    </button>
                    <button
                        className="px-4 py-2 border border-green-500 hover:bg-green-500 transition-all duration-200 hover:text-white rounded-full text-green-500 font-semibold"
                        onClick={() => navigate('/login')}>
                        Log in
                    </button>
                </div>
            }
        </header>
    )
}

export default Header;