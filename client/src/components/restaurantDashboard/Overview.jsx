
const Overview = () => {
    return (
        < div className="flex flex-col gap-6" >
            <div>
                <h2 className="font-semibold text-2xl">Overview</h2>
                <p className="my-1 text-gray-600">Here you can see an overview of your restaurant"s performance.</p>
            </div>

            {/* Profile info */}
            <div className="flex items-center gap-x-6 bg-white p-6 rounded-xl shadow-sm">
                <img src="restaurant-profile.png" alt="ngo-img" className="w-28 h-28 rounded-full" />
                <div className="flex flex-col gap-y-1 text-gray-700">
                    <h3 className="text-2xl font-semibold text-gray-800">Pasta Paradise <span className="text-xs text-gray-800 italic">10AM - 6PM</span></h3>
                    
                    <p>Email: restaurant@example.com</p>
                    <p>Contact: (987) 654-3210</p>
                    <p>City: Ujjain</p>
                    <p>Address: 123 Food St, City, Country</p>
                </div>
                <button className="inline-block ml-auto bg-green-500 py-1 px-4 rounded-md text-white font-semibold hover:bg-green-600 transition-bg duration-200">Edit Profile</button>
            </div>

            {/* Impact */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-gray-800">Impact Overview</h3>

                <div className="flex gap-4 mt-4">
                    <div className="flex-grow text-center bg-blue-100 p-6 rounded-lg">
                        <p className="text-blue-600 font-semibold">Total Meals Donated</p>
                        <span className="text-blue-600 font-bold text-xl">12,000 Meals</span>
                    </div>
                    <div className="flex-grow text-center bg-green-100 p-6 rounded-lg">
                        <p className="text-green-600 font-semibold">People Helped</p>
                        <span className="text-green-600 font-bold text-xl">9,000 People</span>
                    </div>
                    <div className="flex-grow text-center bg-purple-100 p-6 rounded-lg">
                        <p className="text-purple-600 font-semibold">Rating</p>
                        <span className="text-purple-600 font-bold text-xl">4.8/5</span>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Overview;