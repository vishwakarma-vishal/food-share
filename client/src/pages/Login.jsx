import { useNavigate } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate();

    return (
        <div className="py-4 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className=" space-y-2 text-center">
                <h2 className="text-3xl font-semibold">Login to Your Account</h2>
                <p className="py-2">"Log in to continue your journey of making a difference!"</p>
                <img
                    className="aspect-video rounded-xl h-[250px] mx-auto"
                    src="donate.jpg" alt="ngo img"
                />
            </div>

            <div className="w-full sm:w-2/3 lg:w-1/2 bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-semibold text-center">Welcome back</h2>
                <div className="h-[1px] w-28 bg-black mx-auto my-2"></div>

                <form className="space-y-2">
                    <div className="basis-1/2 space-y-2">
                        <label htmlFor="email" className="font-medium text-gray-800">Email</label><br />
                        <input
                            type="email"
                            id="email"
                            placeholder="abc@gmail.com"
                            className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                        />
                    </div>

                    <div className="basis-1/2 space-y-2">
                        <label htmlFor="password" className="font-medium text-gray-800">Password</label><br />
                        <input
                            type="text"
                            id="password"
                            placeholder="Your password"
                            className="border outline-none border-gray-600 p-2 w-full rounded-xl"
                        />
                    </div>

                    <p className="text-right text-gray-500 hover:underline text-sm cursor-pointer">Forgot password?</p>

                    <p className="text-gray-700">Welcome back! Please log in to continue.</p>
                    <button className="bg-green-500 hover:bg-green-600 transition-all duration-200 text-white py-2 w-full rounded-lg font-semibold">Log In</button>
                </form>

                <div className="flex mt-2">
                    <button className="underline text-base text-green-600 mx-auto block ml-0" onClick={() => navigate('/ngo-signup')}>NGO Sign Up</button>
                    <button className="underline text-base text-green-600 mx-auto block mr-0" onClick={() => navigate('/restaurant-signup')}>Restaurant Sign Up</button>
                </div>

            </div>
        </div>
    )
}

export default Login;