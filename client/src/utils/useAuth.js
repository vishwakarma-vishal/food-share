import {
    useRecoilState
} from "recoil";
import { authAtom } from "../atoms/authAtom";
import { useNavigate } from "react-router-dom";
import api from "./interceptors";

// custom hook to mangae authentication
const useAuth = () => {
    const [auth, setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();

    const login = (role, accessToken) => {
        setAuth({
            isAuthenticated: true,
            role: role
        });
        localStorage.setItem("accessToken", accessToken);
        navigate(role === "ngo" ? "/ngo-dashboard" : "/restaurant-dashboard");
    }

    const logout = async () => {
        try {
            const response = await api({
                url: `${import.meta.env.VITE_API_URL}/auth/logout`,
                method: 'post'
            })

            console.log("Logged out successfully", response);

            localStorage.removeItem("accessToken");
            setAuth({
                isAuthenticated: false,
                role: null
            }); 
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return { auth, login, logout }
}

export default useAuth;