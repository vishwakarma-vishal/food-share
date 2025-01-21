

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
                <h2 className="font-semibold text-2xl">Overview</h2>
                <p className="my-1 text-gray-600">Here you can see an overview of your NGO"s activities and impact.</p>
            </div>

            {/* Profile info */}
            <div className="flex items-center gap-x-6 bg-white p-6 rounded-xl shadow-sm">
                <img
                    src={user.profileImg ? user.profileImg : "ngo.svg"}
                    alt="ngo-img"
                    className="w-28 h-28 rounded-full"
                />

                <div className="flex flex-col gap-y-1 text-gray-700">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        {user.name}
                        {user.foundingDate && <span className="text-xs text-gray-800 italic"> since {formatDate(user.foundingDate)}</span>}
                    </h3>

                    <div className="mt-1">
                        <p className="font-semibold ">Email: <span className="font-normal">{user.email}</span></p>
                        <p className="font-semibold ">Phone: <span className="font-normal">{user.phone}</span></p>
                        <p className="font-semibold ">City: <span className="font-normal">{user.city}</span></p>
                        <p className="font-semibold ">Address: <span className="font-normal">{user.address}</span></p>
                    </div>
                </div>
                <button
                    className="inline-block ml-auto bg-green-500 py-1 px-4 rounded-md text-white font-semibold hover:bg-green-600 transition-bg duration-200"
                    onClick={() => setIsSelected("profile")}
                >
                    Edit Profile
                </button>
            </div>

            {/* Impact */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-gray-800">Impact Overview</h3>

                <div className="flex gap-4 mt-4">
                    <div className="flex-grow text-center bg-blue-100 p-6 rounded-lg">
                        <p className="text-blue-600 font-semibold">Total Meals Collected</p>
                        <span className="text-blue-600 font-bold text-xl">15,000 Meals</span>
                    </div>
                    <div className="flex-grow text-center bg-green-100 p-6 rounded-lg">
                        <p className="text-green-600 font-semibold">People Benefited</p>
                        <span className="text-green-600 font-bold text-xl">12,000 People</span>
                    </div>
                    <div className="flex-grow text-center bg-purple-100 p-6 rounded-lg">
                        <p className="text-purple-600 font-semibold">Active Volunteers</p>
                        <span className="text-purple-600 font-bold text-xl">350 Volunteers</span>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Overview;