import {
    useRecoilState
} from "recoil";
import { authAtom } from "../atoms/authAtom";
import { useNavigate } from "react-router-dom";

// custom hook to mangae authentication
const useAuth = () => {
    const [auth, setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();

    const login = (role, token, safeUser) => {
        setAuth({
            isAuthenticated: true,
            role: role,
            safeUser: safeUser
        });
        localStorage.setItem("token", token);
        navigate(role === "ngo" ? "/ngo-dashboard" : "/restaurant-dashboard");
    }

    const logout = () => {
        setAuth({
            isAuthenticated: false,
            role: null,
            safeUser: null
        });
        localStorage.removeItem("token");
        navigate("/login");
    }

    const updateUser = (user) => {
        setAuth({
            ...auth,
            safeUser: user,
        })
    }

    return { auth, login, logout, updateUser }
}

export default useAuth;