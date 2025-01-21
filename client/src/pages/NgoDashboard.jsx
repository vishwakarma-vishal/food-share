import { FaHome, FaBox, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { FaArrowLeft } from "react-icons/fa6";
import { GiCardboardBox } from "react-icons/gi";
import { GiBoxUnpacking } from "react-icons/gi";
import { RiMenu2Line } from "react-icons/ri";
import Overview from '../components/ngoDashboard/Overview';
import Listing from '../components/ngoDashboard/Listing';
import { Collection } from '../components/ngoDashboard/Collection';
import { Distribution } from '../components/ngoDashboard/Distribution';
import { Profile } from '../components/ngoDashboard/Profile';

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from '../utils/interceptors';

const NgoDashboard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSelected, setIsSelected] = useState("overview");

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUserData = async () => {
        try {
            setLoading(true);
            const response = await api({
                url: `${import.meta.env.VITE_API_URL}/ngo/info`,
                method: "get",
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            console.log(response);
            const user = response.data.user;
            setUser(user);
        } catch (error) {
            console.log("something went wrong");
            toast.error("Unable to get user info, try again later");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);
    

    // to render menu content
    const renderContent = () => {
        switch (isSelected) {
            case "overview":
                return <Overview setIsSelected={setIsSelected} user={user} />
            case "listing":
                return <Listing isMenuOpen={isMenuOpen} />
            case "collection":
                return <Collection />
            case "distribution":
                return <Distribution />
            case "profile":
                return <Profile setIsSelected={setIsSelected} user={user} getUserData={getUserData}/>
            default:
                return <Overview />
        }
    }

    return (
        <div className="flex w-full min-h-[90vh] content-start ">
            {/* sidebar */}
            <div className={`bg-gray-200 p-6 transition-all duration-300 ${isMenuOpen ? "w-1/5" : "w-16"}`}>
                <div className="flex items-center justify-between">
                    <h2 className={`font-semibold text-xl ${isMenuOpen ? "block" : "hidden"}`}>NGO Dashboard</h2>
                    <div onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${isMenuOpen ? "p-1" : "p-1 -ml-1"} border border-black  rounded-sm cursor-pointer`}>
                        {isMenuOpen ? <FaArrowLeft className='text-lg' /> : <RiMenu2Line className='text-lg' />}</div>
                </div>

                <div className="mt-8 flex flex-col gap-y-4">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("overview")}
                    >
                        <FaHome className="inline text-xl" />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>Overview</span>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("listing")}
                    >
                        <FaBox className="inline  text-xl " />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>Food Listings</span>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("collection")}
                    >
                        <GiCardboardBox className="inline  text-xl" />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>Collection History</span>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("distribution")}
                    >
                        <GiBoxUnpacking className="inline  text-xl " />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>Distribution History</span>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("profile")}
                    >
                        <FaUserCircle className="inline  text-xl " />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>Manage Profile</span>
                    </div>
                </div>
            </div>

            {/* main content */}
            <div className="w-4/5 flex-grow p-6 mr-0">
                {/* render menu content */}
                {renderContent()}
            </div>
        </div >
    )
}

export default NgoDashboard;


