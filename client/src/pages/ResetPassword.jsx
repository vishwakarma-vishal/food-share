import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import api from "../utils/interceptors";
import { MdOutlineLockReset } from "react-icons/md";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [isPassVisible, setIsPassVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { token } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setError("Password are not same.");
            return;
        }

        try {
            const response = await api({
                url: `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
                method: 'post',
                data: {
                    password
                }
            });

            const data = response.data;

            if (data.success) {
                setPassword("");
                setConfirmPassword("");
                toast.success("Password reset successfully.");
                navigate('/login');
            }
        }
        catch (e) {
            console.log(e);
            toast.error(e.response?.data?.message);
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-10 flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-10">

            <div className="flex flex-col gap-1 text-center">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Reset Password</h2>
                <p className="text-gray-600">"Enter a new password to regain access to your account."</p>
                <MdOutlineLockReset className="size-20 sm:size-40 text-center text-gray-400 mx-auto mt-4 inline-block" />
            </div>

            <div className="w-full max-w-xl bg-white p-6 sm:p-8 rounded-lg shadow-xl">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center">Reset Password</h2>
                <div className="h-[1px] w-28 bg-gray-500 mx-auto my-2"></div>

                <form onSubmit={submitHandler} className="space-y-2">
                    <div className="space-y-2">
                        <label htmlFor="password" className="font-medium text-gray-800">Password</label><br />
                        <div className="flex items-center justify-between gap-2 border border-gray-600 py-2 px-4 rounded-full">
                            <input
                                type={isPassVisible ? "text" : "password"}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full outline-none"
                                minLength={5}
                                maxLength={30}
                                required
                            />
                            <span className="text-xl cursor-pointer" onClick={() => setIsPassVisible(!isPassVisible)}>
                                {isPassVisible ? <IoIosEye /> : <IoIosEyeOff />}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="font-medium text-gray-800">Confirm Password</label><br />
                        <div className="flex items-center justify-between gap-2 border border-gray-600 py-2 px-4 rounded-full">
                            <input
                                type={isPassVisible ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full outline-none"
                                minLength={5}
                                maxLength={30}
                                required
                            />
                            <span className="text-xl cursor-pointer" onClick={() => setIsPassVisible(!isPassVisible)}>
                                {isPassVisible ? <IoIosEye /> : <IoIosEyeOff />}
                            </span>
                        </div>
                    </div>

                    <p className="text-left text-red-500 text-sm">{error}</p>

                    <button type="submit" className="bg-green-500 hover:bg-green-600 transition-all duration-200 text-white py-2 w-full rounded-full font-semibold">Reset</button>
                </form>

            </div>
        </div>
    )
}

export default ResetPassword;