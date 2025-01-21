import { useNavigate } from "react-router-dom";
import useAuth from "../../utils/useAuth";

const Header = () => {
    const navigate = useNavigate();
    const {auth, logout} = useAuth();

    return (
        <header className="flex justify-between items-center px-4 md:px-8 lg:px-10 py-4 bg-white shadow-md">
            <div
                className="flex items-center gap-x-5 cursor-pointer"
                onClick={() => navigate('/')}>
                <div className="w-8 h-8 sm:w-10 sm:h-10">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                    </svg>
                </div>
                <span className="text-xl font-bold">Food Share</span>
            </div>

            <div className="hidden md:block">
                <nav className="flex gap-x-8 text-base font-semibold">
                    <a className="cursor-pointer" href="#Work">How it works</a>
                    <a className="cursor-pointer" href="#WhyUs">Why use FoodShare?</a>
                    <a className="cursor-pointer" href="#faq">FAQ</a>
                </nav>
            </div>

            {auth.isAuthenticated ?
                <div className="flex gap-4">
                    <button
                        className="px-4 py-2 bg-green-500 rounded-full text-white font-semibold"
                        onClick={() => navigate(auth.role === "ngo" ? '/ngo-dashboard' : '/restaurant-dashboard')}>
                        Dashboard
                    </button>
                    <button
                        className="px-4 py-2 border bg-red-500 rounded-full text-white font-semibold"
                        onClick={logout}>
                        Log out
                    </button>
                </div>
                :
                <div className="flex gap-4">
                    <button
                        className="px-4 py-2 bg-green-500 rounded-full text-white font-semibold"
                        onClick={() => navigate('/signup')}>
                        Sign up
                    </button>
                    <button
                        className="px-4 py-2 border border-green-500 rounded-full text-green-500 font-semibold"
                        onClick={() => navigate('/login')}>
                        Log in
                    </button>
                </div>
            }


        </header>
    )
}

export default Header;