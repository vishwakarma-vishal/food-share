import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "./useAuth";

const ProtectedRoute = ({ element, requiredRole }) => {
    const navigate = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate("/login");
        } else if (auth.isAuthenticated && auth.role !== requiredRole) {
            navigate("/");
        }
    }, [auth.isAuthenticated, auth.role, requiredRole, navigate]);

    // Prevent flashing of protected content
    if (!auth.isAuthenticated || (auth.isAuthenticated && auth.role !== requiredRole)) {
        return null; // or a loading spinner
    }

    return element;
}

export default ProtectedRoute;