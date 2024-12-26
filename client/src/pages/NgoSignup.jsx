import { useNavigate } from "react-router-dom";


const NgoSignup = () => {
    const navigate = useNavigate();

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
                <form className="space-y-2">
                    <div className="space-y-2">
                        <label htmlFor="name" className="font-medium text-gray-800">
                            Organization/NGO name
                        </label><br />
                        <input
                            type="text"
                            id="name"
                            placeholder="Type your Organization/NGO name"
                            className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="street" className="font-medium text-gray-800">Street address</label><br />
                        <input
                            type="text"
                            id="street"
                            placeholder="Type your address"
                            className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="city" className="font-medium text-gray-800">City</label><br />
                        <select
                            id="city"
                            className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                        >
                            <option>Select city</option>
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
                                placeholder="1234567890"
                                className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                            />
                        </div>
                        <div className="basis-1/2 space-y-2">
                            <label htmlFor="email" className="font-medium text-gray-800">Email</label><br />
                            <input
                                type="email"
                                id="email"
                                placeholder="abc@gmail.com"
                                className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="basis-1/2 space-y-2">
                            <label htmlFor="password" className="font-medium text-gray-800">Password</label><br />
                            <input
                                type="text"
                                id="password"
                                placeholder="Your password"
                                className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                            />
                        </div>
                        <div className="basis-1/2 space-y-2">
                            <label htmlFor="confirm-password" className="font-medium text-gray-800">Confirm password</label><br />
                            <input
                                type="text"
                                id="confirm-password"
                                placeholder="Confirm your password"
                                className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="terms" className="w-4 h-4 my-2"></input>
                        <label htmlFor="terms">I agree to the terms of service and privacy policy</label>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-gray-800">Join us and delight customers with your unique dishes!</p>
                        <button className="bg-green-500 hover:bg-green-600 transition-all duration-200 text-white py-2 w-full rounded-lg font-semibold">Start sharing your flavors</button>
                    </div>
                </form>

                <button className="underline text-green-600 mx-auto block mt-4" onClick={() => navigate('/restaurant-signup')}>Switch to Restaurant Sign Up</button>
            </div>
        </div>
    )
}

export default NgoSignup;