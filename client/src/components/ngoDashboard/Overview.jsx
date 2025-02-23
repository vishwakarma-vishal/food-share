

const Overview = ({ setIsSelected, user }) => {
    // format date like 1-jan-2025
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        < div className="flex flex-col gap-6" >
            <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Overview</h2>
                <p className="my-1 text-gray-600 text-sm sm:text-base">Here you can see an overview of your NGO"s activities and impact.</p>
            </div>

            {/* Profile info */}
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-2 sm:gap-6 bg-white p-6 rounded-xl shadow-sm">
                <img
                    src={user.profileImg ? user.profileImg : "ngo.svg"}
                    alt="ngo-img"
                    className="w-24 sm:w-28 h-24 sm:h-28 rounded-full"
                />

                <div className="flex flex-grow flex-col gap-y-1 text-gray-700">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                        {user.name}
                        {user.foundingDate && <span className="text-xs text-gray-800 italic"> since {formatDate(user.foundingDate)}</span>}
                    </h3>

                    <div className="mt-1 text-sm sm:text-base">
                        <p className="font-semibold ">Email: <span className="font-normal">{user.email}</span></p>
                        <p className="font-semibold ">Phone: <span className="font-normal">{user.phone}</span></p>
                        <p className="font-semibold ">City: <span className="font-normal">{user.city}</span></p>
                        <p className="font-semibold ">Address: <span className="font-normal">{user.address}</span></p>
                    </div>
                </div>
                <button
                    className="mt-1 w-full lg:w-auto inline-block bg-green-500 py-1 px-4 rounded-full text-white font-semibold hover:bg-green-600 transition-bg duration-200"
                    onClick={() => setIsSelected("profile")}
                >
                    Edit Profile
                </button>
            </div>

            {/* Impact */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-md sm:text-lg text-gray-800">Impact Overview</h3>

                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex-grow text-center bg-blue-100 p-6 rounded-lg">
                        <p className="text-blue-600 font-semibold text-sm sm:text-normal">Total Meals Collected</p>
                        <span className="text-blue-600 font-bold text-lg sm:text-xl">15,000 Meals</span>
                    </div>
                    <div className="flex-grow text-center bg-green-100 p-6 rounded-lg">
                        <p className="text-green-600 font-semibold text-sm sm:text-normal">People Benefited</p>
                        <span className="text-green-600 font-bold text-lg sm:text-xl">12,000 People</span>
                    </div>
                    <div className="flex-grow text-center bg-purple-100 p-6 rounded-lg">
                        <p className="text-purple-600 font-semibold text-sm sm:text-normal">Active Volunteers</p>
                        <span className="text-purple-600 font-bold text-lg sm:text-xl">350 Volunteers</span>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Overview;