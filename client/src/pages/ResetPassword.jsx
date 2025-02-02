import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import api from "../utils/interceptors";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [isPassVisible, setIsPassVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const {token} = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password != confirmPassword ){
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
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-10 flex flex-col lg:flex-row justify-between items-center gap-10">

            <div className="w-full sm:w-2/3 lg:w-1/2 bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-semibold text-center">Reset Password</h2>
                <div className="h-[1px] w-28 bg-black mx-auto my-2"></div>

                <form onSubmit={submitHandler} className="space-y-2">
                    <div className="space-y-2">
                        <label htmlFor="password" className="font-medium text-gray-800">Password</label><br />
                        <div className="flex items-center justify-between gap-2 border border-gray-600 p-2 rounded-xl">
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
                        <div className="flex items-center justify-between gap-2 border border-gray-600 p-2 rounded-xl">
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

                    <p className="text-left text-red-500 hover:underline text-sm cursor-pointer"
                        onClick={() => navigate('/forget-password')}>
                        {error}
                    </p>

                    <button type="submit" className="bg-green-500 hover:bg-green-600 transition-all duration-200 text-white py-2 w-full rounded-lg font-semibold">Reset</button>
                </form>

            </div>
        </div>
    )
}

export default ResetPassword;