let isRefreshing = false;
let failedRequestsQueue = [];

import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response, // Pass through if successful
    
    async (error) => {
        const originalRequest = error.config;
        console.log("Interceptor triggered for error:", error.response?.status);

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("401 Unauthorized detected. Handling token refresh...");

            if (isRefreshing) {
                console.log("Refresh token request already in progress. Queuing this request...");
                // Queue failed requests while refresh token is being processed
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({ resolve, reject });
                })
                .then((token) => {
                    console.log("Retrying request with new access token:", token);
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => {
                    console.log("Failed to retry queued request:", err);
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log("Sending refresh token request...");
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {}, // Refresh token request body
                    { withCredentials: true } // Ensure cookies are sent
                );

                const newAccessToken = response.data.accessToken;
                console.log("Received new access token:", newAccessToken);

                localStorage.setItem("accessToken", newAccessToken);

                // Process queued requests
                console.log("Processing queued requests...");
                failedRequestsQueue.forEach((req) =>
                    req.resolve(newAccessToken)
                );
                failedRequestsQueue = [];

                // Retry the original request
                console.log("Retrying the original request...");
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.log("Failed to refresh token:", refreshError);

                // Reject all queued requests
                failedRequestsQueue.forEach((req) =>
                    req.reject(refreshError)
                );
                failedRequestsQueue = [];
                localStorage.removeItem("accessToken");

                console.log("Redirecting to login page...");
                // window.location.href = "/login"; // Redirect to login
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        console.log("Request failed with error:", error);
        return Promise.reject(error);
    }
);

export default api;
