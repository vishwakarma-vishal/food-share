import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineCancel } from "react-icons/md";

import api from "../utils/interceptors";

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await api({
                url: `${import.meta.env.VITE_API_URL}/auth/forget-password`,
                method: 'post',
                data: {
                    email
                }
            });

            const data = response.data;

            if (data.success) {
                setShowMessage(true);
            }
        }
        catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-10 flex flex-col lg:flex-row justify-between items-center gap-10">

            <div className=" space-y-2 text-center">
                <h2 className="text-3xl font-semibold">Forget Password</h2>
                <p className="py-2">"Enter your email id to reset password"</p>
            </div>

            <div className="w-full sm:w-2/3 lg:w-1/2 bg-white p-8 rounded-lg shadow-xl">

                <form onSubmit={submitHandler} className="space-y-2">
                    <div className="space-y-2">
                        <label htmlFor="email" className="font-medium text-gray-800">Email</label><br />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="yourmail@gmail.com"
                            className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                            required
                        />
                    </div>

                    <p className="text-right text-gray-500 hover:underline text-sm cursor-pointer"
                        onClick={() => navigate('/login')}>
                        Login
                    </p>

                    <button type="submit" className="bg-green-500 hover:bg-green-600 transition-all duration-200 text-white py-2 w-full rounded-lg font-semibold">Reset password</button>
                </form>

            </div>

            {/* modal */}
            {showMessage && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-96 relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setShowMessage(false)
                                navigate("/login")
                            }}
                        >
                            <MdOutlineCancel className="text-2xl" />
                        </button>

                        <h2 className="text-xl font-semibold text-center text-gray-800">Mail Sent</h2>

                        <p className="text-gray-600 text-center mt-2">
                            Password reset link has been sent to your email.
                            Please check your inbox.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ForgetPassword;