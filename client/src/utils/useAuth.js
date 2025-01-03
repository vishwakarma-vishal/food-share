import {
    useRecoilState
} from "recoil";
import { authAtom } from "../atoms/authAtom";
import { useNavigate } from "react-router-dom";

// custom hook to mangae authentication
const useAuth = () => {
    const [auth, setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();

    const login = (role, token) => {
        setAuth({
            isAuthenticated: true,
            role: role
        });
        localStorage.setItem("token", token);
        navigate(role === "ngo" ? "/ngo-dashboard" : "/restaurant-dashboard");
    }

    const logout = () => {
        setAuth({
            isAuthenticated: false,
            role: null
        });
        localStorage.removeItem("token");
        navigate("/login");
    }

    return { auth, login, logout }
}

export default useAuth;