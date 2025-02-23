import React from 'react';
import { FaUtensils, FaHistory, FaHome, FaPlus, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { FaArrowLeft } from "react-icons/fa6";
import { RiMenu2Line } from "react-icons/ri";

import Overview from '../components/restaurantDashboard/Overview';
import MyListing from '../components/restaurantDashboard/MyListing';
import DonationHistory from '../components/restaurantDashboard/DonationHistory';
import NewDonation from '../components/restaurantDashboard/NewDonation';
import Profile from '../components/restaurantDashboard/Profile';
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from '../utils/interceptors';

const RestaurantDashboard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSelected, setIsSelected] = useState("overview");

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUserData = async () => {
        try {
            setLoading(true);
            const response = await api({
                url: `${import.meta.env.VITE_API_URL}/restaurant/info`,
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
                return <MyListing isMenuOpen={isMenuOpen} isSelected={isSelected}  setIsSelected={setIsSelected} />
            case "donation-history":
                return <DonationHistory />
            case "new-donation":
                return <NewDonation setIsSelected={setIsSelected}/>
            case "profile":
                return <Profile setIsSelected={setIsSelected} user={user} getUserData={getUserData}/>
            default:
                return <Overview />
        }
    }

    return (
        <div className="relative flex w-full min-h-[90vh]  content-start">
            {/* sidebar */}
            <div className={`h-full absolute sm:relative z-10 top-0 left-0 min-h-screen bg-gray-200 p-6 transition-all duration-300 ${isMenuOpen ? "w-fit" : "w-16"}`}>
                <div className="flex items-center justify-between">
                    <h2 className={`font-semibold text-lg sm:text-md ${isMenuOpen ? "block" : "hidden"}`}>Restaurant Dashboard</h2>
                    <div onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${isMenuOpen ? "p-1" : "p-1 -ml-1"} border border-black  rounded-sm cursor-pointer`}>
                        {isMenuOpen ? <FaArrowLeft className='ext-sm sm:text-lg' /> : <RiMenu2Line className='text-lg' />}</div>
                </div>

                <div className="mt-8 flex flex-col gap-y-4 text-sm sm:text-base">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("overview")}
                    >
                        <FaHome className="inline text-lg sm:text-xl" />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>Overview</span>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("listing")}
                    >
                        <FaUtensils className="inline text-lg sm:text-xl" />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>My Listings</span>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("donation-history")}
                    >
                        <FaHistory className="inline text-lg sm:text-xl" />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>Donation History</span>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("new-donation")}
                    >
                        <FaPlus className="inline text-lg sm:text-xl" />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>New Donation</span>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("profile")}
                    >
                        <FaUserCircle className="inline text-lg sm:text-xl" />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>Manage Profile</span>
                    </div>
                </div>
            </div>

            {/* main content */}
            <div className="ml-16 sm:ml-0 w-4/5 flex-grow p-4 sm:p-6 mr-0 min-h-[90vh]">
                {/* render menu content */}
                {renderContent()}
            </div>
        </div >
    )
}

export default RestaurantDashboard;


