import { useEffect } from "react";
import api from "./interceptors";
import useAuth from "./useAuth";

const useAuthInitialization = () => {
    const { login, logout } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = localStorage.getItem("accessToken");

            try {
                const response = await api({
                    url: `${import.meta.env.VITE_API_URL}/auth/verify`,
                    method: "post",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                console.log("Access token is valid:", response.data);
                login(response.data.role, accessToken);
            } catch (error) {
                if (error.status == 400) logout();
                console.log("User is not authenticated:", error);
            }
        };

        checkAuth();
    }, []); 
};

export default useAuthInitialization;
