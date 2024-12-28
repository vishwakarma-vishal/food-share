import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

const NgoSignup = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isPassVisible, setIsPassVisible] = useState(false);

    const [formdata, setFormdata] = useState({
        ngoName: "",
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

        console.log(formdata);

        if (formdata.password !== confirmPass) {
            setError("Password doesn't match.");
            console.log("Password doesn't match.");
            return;
        }

        try {
            const response = await axios({
                url: 'http://localhost:3001/auth/ngo',
                method: 'post',
                data: formdata
            });


            if (!data.success) {
                console.log("Error", data);
                toast.error(data.message);
            }

            if (data.success) {
                setFormdata({
                    ngoName: "",
                    address: "",
                    city: "",
                    phone: "",
                    email: "",
                    password: ""
                });
                setConfirmPass("");
                // store the token
                
                toast.success("Signed up successfully.");
                console.log(data);
                navigate('/login');
            }
        } catch (e) {
            toast.error("An error occurred. Please try again.");
        }
    }

    return (
        <div className="py-4 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className=" space-y-2 text-center">
                <h2 className="text-3xl font-semibold">Sign up your NGO</h2>
                <p className="py-2">"Make a difference and connect with your community!"</p>
                <img
                    className="aspect-video rounded-xl h-[250px] mx-auto"
                    src="ngo.jpg" alt="ngo img"
                />
                <button className="underline text-green-600" onClick={() => navigate('/restaurant-signup')}>Switch to Restaurant Sign Up</button>
            </div>

            <div className="w-full md:w-3/4 lg:w-1/2 bg-white rounded-lg p-8 shadow-xl">
                <form onSubmit={submitHandler} className="space-y-2">
                    <div className="space-y-2">
                        <label htmlFor="name" className="font-medium text-gray-800">
                            Organization/NGO name
                        </label><br />
                        <input
                            type="text"
                            id="name"
                            name="ngoName"
                            value={formdata.ngoName}
                            onChange={changeHandler}
                            placeholder="Type your Organization/NGO name"
                            className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                            minLength={3}
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
                            className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                            minLength={3}
                            maxLength={200}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="city" className="font-medium text-gray-800">City</label><br />
                        <select
                            id="city"
                            name="city"
                            value={formdata.city}
                            onChange={changeHandler}
                            className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                            required
                        >
                            <option value="" disabled>Select city</option>
                            <option value="Indore">Indore</option>
                            <option value="Ujjain">Ujjain</option>
                            <option value="Agar">Agar</option>
                            <option value="Susner">Susner</option>
                            <option value="Soyat">Soyat</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <div className="basis-1/2 space-y-2">
                            <label htmlFor="phone" className="font-medium text-gray-800">Phone number</label><br />
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formdata.phone}
                                onChange={changeHandler}
                                placeholder="1234567890"
                                className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                                minLength={10}
                                maxLength={10}
                                required
                            />
                        </div>
                        <div className="basis-1/2 space-y-2">
                            <label htmlFor="email" className="font-medium text-gray-800">Email</label><br />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formdata.email}
                                onChange={changeHandler}
                                placeholder="abc@gmail.com"
                                className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="basis-1/2 space-y-2">
                            <label htmlFor="password" className="font-medium text-gray-800">Password</label><br />
                            <div className=" flex items-center justify-between gap-2 border border-gray-600 p-2 rounded-xl">
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
                        <div className="basis-1/2 space-y-2">
                            <label htmlFor="confirm-password" className="font-medium text-gray-800">Confirm password</label><br />
                            <div className=" flex items-center justify-between gap-2 border border-gray-600 p-2 rounded-xl">
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

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="terms" className="w-4 h-4 my-2" required></input>
                        <label htmlFor="terms">I agree to the terms of service and privacy policy</label>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-gray-800"> Join us and help make a difference in your community!</p>
                        <button
                            type="submit"
                            className={`bg-green-500 hover:bg-green-600 transition-all duration-200 text-white py-2 w-full rounded-lg font-semibold ${error !== "" ? "cursor-not-allowed" : ""}`}
                            disabled={error !== ""}
                        >
                            Start Making a Difference
                        </button>
                    </div>
                </form>

                <button className="underline text-green-600 mx-auto block mt-4" onClick={() => navigate('/restaurant-signup')}>Switch to Restaurant Sign Up</button>
            </div>
        </div>
    )
}

export default NgoSignup;