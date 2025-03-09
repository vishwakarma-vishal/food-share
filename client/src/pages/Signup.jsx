import { useEffect, useState } from "react";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { toast } from "react-toastify";
import useAuth from "../utils/useAuth";
import api from "../utils/interceptors";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isPassVisible, setIsPassVisible] = useState(false);
    const { login } = useAuth();
    const [type, setType] = useState("");
    const [formdata, setFormdata] = useState({
        name: "",
        address: "",
        city: "",
        phone: "",
        email: "",
        password: ""
    });

    const [confirmPass, setConfirmPass] = useState("");

    const changeHandler = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setFormdata({ ...formdata, [name]: value });
    }

    // password validation
    useEffect(() => {
        if (confirmPass !== formdata.password) {
            setError("Password doesn't match.");
        } else {
            setError("");
        }
    }, [formdata.password, confirmPass]);

    // form submition
    const submitHandler = async (e) => {
        e.preventDefault();

        if (formdata.password !== confirmPass) {
            setError("Password doesn't match.");
            return;
        }

        if (type == "ngo") {
            try {
                const response = await api({
                    url: `${import.meta.env.VITE_API_URL}/auth/ngo`,
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
                        name: "",
                        address: "",
                        city: "",
                        phone: "",
                        email: "",
                        password: ""
                    });
                    setConfirmPass("");
                    // managing the state
                    login(data.role, data.accessToken);

                    toast.success("Signed up successfully.");
                    navigate('/ngo-dashboard');
                }
            } catch (e) {
                console.log(e);
                toast.error("An error occurred. Please try again.");
            }
        }
        else {
            try {
                const response = await api({
                    url: `${import.meta.env.VITE_API_URL}/auth/restaurant`,
                    method: 'post',
                    data: formdata
                });

                console.log(response);

                const data = response.data;

                if (!data.success) {
                    console.log("Error", data);
                    toast.error(data.message);
                }

                if (data.success) {
                    setFormdata({
                        name: "",
                        address: "",
                        city: "",
                        phone: "",
                        email: "",
                        password: ""
                    });
                    setConfirmPass("");
                    // managing the state
                    login(data.role, data.accessToken);

                    toast.success("Signed up successfully.");
                    console.log(data);
                    navigate('/restaurant-dashboard');
                }
            } catch (e) {
                console.log(e);
                toast.error("An error occurred. Please try again.");
            }
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-10 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="flex flex-col gap-1 text-center">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Create an Account</h2>
                <p className="text-gray-600">"Make a difference and connect with your community!"</p>
                <img
                    className="mix-blend-multiply my-6 rounded-xl h-[250px] mx-auto hidden lg:block"
                    src="signup.jpg" alt="ngo img"
                />
            </div>

            <div className="w-full max-w-xl bg-white rounded-lg p-6 sm:p-8 shadow-xl">
                <form onSubmit={submitHandler} className="space-y-2">
                    <div className="space-y-2">
                        <label htmlFor="name" className="font-medium text-gray-800">
                            Name
                        </label><br />
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formdata.name}
                            onChange={changeHandler}
                            placeholder="Restaurant/NGO name"
                            className="border outline-none border-gray-600 py-2 px-4 w-full rounded-full"
                            minLength={5}
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="street" className="font-medium text-gray-800">Street address</label><br />
                        <input
                            type="text"
                            id="street"
                            name="address"
                            value={formdata.address}
                            onChange={changeHandler}
                            placeholder="Type your address"
                            className="border outline-none border-gray-600 py-2 px-4 w-full rounded-full"
                            minLength={5}
                            maxLength={200}
                            required
                        />
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-4">
                        <div className="min-w-0 w-full space-y-2">
                            <label htmlFor="profile" className="font-medium text-gray-800">Profile</label><br />
                            <select id="profile"
                                className="border outline-none border-gray-600 py-2 px-4 w-full rounded-full"
                                required
                                value={type}
                                onChange={(e) => setType(e.target.value)}>
                                <option value="" disabled>Select Type</option>
                                <option value="ngo">NGO</option>
                                <option value="restaurant">Restaurant</option>
                            </select>
                        </div>
                        <div className="min-w-0 w-full space-y-2">
                            <label htmlFor="city" className="font-medium text-gray-800">City</label><br />
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formdata.city}
                                onChange={changeHandler}
                                placeholder="Type your city"
                                className="border outline-none border-gray-600 py-2 px-4 w-full rounded-full"
                                minLength={3}
                                maxLength={200}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-3">
                        <div className="min-w-0 w-full space-y-2">
                            <label htmlFor="phone" className="font-medium text-gray-800">Phone number</label><br />
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formdata.phone}
                                onChange={changeHandler}
                                placeholder="1234567890"
                                className="border outline-none border-gray-600 py-2 px-4 w-full rounded-full"
                                minLength={10}
                                maxLength={10}
                                required
                            />
                        </div>
                        <div className="min-w-0 w-full space-y-2">
                            <label htmlFor="email" className="font-medium text-gray-800">Email</label><br />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formdata.email}
                                onChange={changeHandler}
                                placeholder="abc@gmail.com"
                                className="border outline-none border-gray-600 py-2 px-4 w-full rounded-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-3">
                        <div className="min-w-0 w-full space-y-2">
                            <label htmlFor="password" className="font-medium text-gray-800">Password</label><br />
                            <div className="w-full flex items-center justify-between gap-2 border border-gray-600 py-2 px-4 rounded-full">
                                <input
                                    type={isPassVisible ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formdata.password}
                                    onChange={changeHandler}
                                    placeholder="Your password"
                                    className="outline-none"
                                    minLength={5}
                                    maxLength={30}
                                    required
                                />
                                <span className="text-xl cursor-pointer" onClick={() => setIsPassVisible(!isPassVisible)}>
                                    {isPassVisible ? <IoIosEye /> : <IoIosEyeOff />}
                                </span>
                            </div>
                        </div>
                        <div className="min-w-0 w-full space-y-2">
                            <label htmlFor="confirm-password" className="font-medium text-gray-800">Confirm password</label><br />
                            <div className="flex items-center justify-between gap-2 border border-gray-600 py-2 px-4 rounded-full">
                                <input
                                    type={isPassVisible ? "text" : "password"}
                                    id="confirm-password"
                                    name="confirmPass"
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="outline-none"
                                    minLength={5}
                                    maxLength={30}
                                    required
                                />
                                <span className="text-xl cursor-pointer" onClick={() => setIsPassVisible(!isPassVisible)}>
                                    {isPassVisible ? <IoIosEye /> : <IoIosEyeOff />}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* error box */}
                    <div className="h-4 text-red-500 text-sm">
                        {error}
                    </div>

                    <div className="flex items-start gap-2 text-gray-700">
                        <input type="checkbox" id="terms" className="w-3 h-3 my-2 text-sm sm:text-base" required></input>
                        <label htmlFor="terms">I agree to the terms of service and privacy policy</label>
                    </div>

                    <div className="space-y-2">
                        <button
                            type="submit"
                            className={`text-sm sm:text-base bg-green-500 hover:bg-green-600 transition-all duration-200 text-white py-2 w-full rounded-full font-semibold ${error !== "" ? "cursor-not-allowed" : ""}`}
                            disabled={error !== ""}
                        >
                            Start Making a Difference
                        </button>
                    </div>
                </form>

                <div className="flex w-full mt-2 gap-1 justify-center text-center text-sm sm:text-base">
                    Already have an account{" "}
                    <button className="inline-block hover:underline transition-all duration-200 text-green-600" onClick={() => navigate('/login')}> login here</button>
                </div>
            </div>
        </div>
    )
}

export default Signup;