import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import useAuth from "../utils/useAuth";
import api from "../utils/interceptors";

const Login = () => {
    const navigate = useNavigate();
    const [isPassVisible, setIsPassVisible] = useState(false);
    const [formdata, setFormdata] = useState({
        email: "",
        password: ""
    });
    const { login } = useAuth();

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setFormdata({ ...formdata, [name]: value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await api({
                url: `${import.meta.env.VITE_API_URL}/auth/login`,
                method: 'post',
                data: formdata 
            });

            const data = response.data;

            if (!data.success) {
                console.log("Error", data);
                toast.error(data.message);
            }

            if (data.success) {
                setFormdata({
                    email: "",
                    password: ""
                });

                login(data.role, data.accessToken);

                toast.success("Logged in successfully.");
                navigate('/');
            }
        }
        catch (e) {
            console.log(e);
            toast.error("An error occurred. Please try again.");
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-10 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className=" space-y-2 text-center">
                <h2 className="text-3xl font-semibold">Login to Your Account</h2>
                <p className="py-2">"Log in to continue your journey of making a difference!"</p>
                <img
                    className="aspect-video rounded-xl h-[250px] mx-auto"
                    src="ngo.jpg" alt="ngo img"
                />
            </div>

            <div className="w-full sm:w-2/3 lg:w-1/2 bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-semibold text-center">Welcome back</h2>
                <div className="h-[1px] w-28 bg-black mx-auto my-2"></div>

                <form onSubmit={submitHandler} className="space-y-2">
                    <div className="space-y-2">
                        <label htmlFor="email" className="font-medium text-gray-800">Email</label><br />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formdata.email}
                            onChange={changeHandler}
                            placeholder="yourmail@gmail.com"
                            className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="font-medium text-gray-800">Password</label><br />
                        <div className="flex items-center justify-between gap-2 border border-gray-600 p-2 rounded-xl">
                            <input
                                type={isPassVisible ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formdata.password}
                                onChange={changeHandler}
                                placeholder="******************"
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

                    <p className="text-right text-gray-500 hover:underline text-sm cursor-pointer">Forgot password?</p>

                    <p className="text-gray-700">Welcome back! Please log in to continue.</p>
                    <button type="submit" className="bg-green-500 hover:bg-green-600 transition-all duration-200 text-white py-2 w-full rounded-lg font-semibold">Log In</button>
                </form>

                <div className="flex w-full mt-2 gap-1 justify-center text-center">
                    Not have an account{" "} 
                    <button className="inline-block underline text-base text-green-600" onClick={() => navigate('/signup')}> create one here</button>
                </div>

            </div>
        </div>
    )
}

export default Login;