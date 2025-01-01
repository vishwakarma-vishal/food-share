import React from 'react';
import { FaUtensils, FaHistory, FaHome, FaPlus, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { FaArrowLeft } from "react-icons/fa6";
import { RiMenu2Line } from "react-icons/ri";
import { useState } from 'react';

import Overview from '../components/restaurantDashboard/Overview';
import MyListing from '../components/restaurantDashboard/MyListing';
import { Collection } from '../components/ngoDashboard/Collection';
import { Distribution } from '../components/ngoDashboard/Distribution';
import { Profile } from '../components/ngoDashboard/Profile';

const RestaurantDashboard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSelected, setIsSelected] = useState("overview");

    // to render menu content
    const renderContent = () => {
        switch (isSelected) {
            case "overview":
                return <Overview />
            case "listing":
                return <MyListing isMenuOpen={isMenuOpen} />
            case "collection":
                return <Collection />
            case "distribution":
                return <Distribution />
            case "profile":
                return <Profile />
            default:
                return <Overview />
        }
    }

    return (
        <div className="flex w-full min-h-[90vh] content-start ">
            {/* sidebar */}
            <div className={`bg-gray-200 p-6 transition-all duration-300 ${isMenuOpen ? "w-1/5" : "w-16"}`}>
                <div className="flex items-center justify-between">
                    <h2 className={`font-semibold text-xl ${isMenuOpen ? "block" : "hidden"}`}>Restaurant Dashboard</h2>
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
                        <FaUtensils className="inline  text-xl " />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>My Listings</span>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("collection")}
                    >
                        <FaHistory className="inline  text-xl" />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>Donation History</span>
                    </div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsSelected("distribution")}
                    >
                        <FaPlus className="inline  text-xl " />
                        <span className={`ml-3 ${isMenuOpen ? "inline" : "hidden"}`}>New Donation</span>
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

export default RestaurantDashboard;


