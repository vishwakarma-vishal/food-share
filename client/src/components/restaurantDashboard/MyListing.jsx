import React, { useEffect, useState } from 'react'
import ListingCard from './ListingCard';
import axios from 'axios';
import { toast } from "react-toastify";

const MyListing = ({ isMenuOpen, isSelected, setIsSelected }) => {
    const [foodListings, setFoodListings] = useState([]);
    const [currentListings, setCurrentListings] = useState(foodListings);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [isModalOpen, setIsModalOpen] = useState(false);

    // get my food listings 
    const getMyFoodListings = async () => {
        try {
            const response = await axios({
                url: "http://localhost:3001/listing",
                method: "get",
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = response.data.foodListings;
            setFoodListings(data);
            setCurrentListings(data);
        } catch (error) {
            console.log("something went wrong");
        }
    }

    useEffect(() => {
        getMyFoodListings()
    }, [isSelected]);

    // apply all the filters
    const applyFilter = () => {
        let filteredListings = foodListings;

        // apply search filter
        if (searchTerm.trim() !== "") {
            filteredListings = filteredListings.filter((listing) => {
                return listing.title && listing.title.toLowerCase().includes(searchTerm);
            });
        }

        // apply category filter
        if (categoryFilter !== "all") {
            filteredListings = filteredListings.filter((listing) => {
                return listing.category && listing.category.toLowerCase() === categoryFilter;
            });
        }

        // apply status filter
        if (statusFilter !== "all") {
            filteredListings = filteredListings.filter((listing) => {
                return listing.status && listing.status.toLowerCase() === statusFilter;
            });
        }

        setCurrentListings(filteredListings);
    }

    useEffect(() => {
        applyFilter();
    }, [searchTerm, categoryFilter, statusFilter]);

    // search filter
    const searchByListingName = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);
    }

    // category filter
    const filterByCategory = (e) => {
        const category = e.target.value.toLowerCase();
        setCategoryFilter(category);
    }

    // status filter
    const filterByStatus = (e) => {
        const status = e.target.value.toLowerCase();
        setStatusFilter(status);
    }

    // delete food listing
    const handleDelete = async (id) => {

        try {
            const response = await axios({
                url: `http://localhost:3001/listing/${id}`,
                method: 'delete',
                headers: {
                    'Content-Type': "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = response.data;

            if (data.success) {
                console.log(response);
                toast.success("Listing deleted successfully.");
                getMyFoodListings();
            }

        } catch (error) {
            toast.error("Something went wrong, try again later.");
            console.log("Something went wrong", error);
        }
    }

    return (
        <div className="relative">
            <div className="flex justify-between">
                <h2 className="font-semibold text-2xl">My Listings</h2>
                <button onClick={() => setIsSelected("new-donation")} className="text-white bg-green-500 rounded-lg py-2 px-4 font-semibold">
                    New Listing
                </button>
            </div>

            {/* filters */}
            {foodListings.length != 0 &&
                <form className="flex gap-4 mt-4">
                    <input type="text" placeholder="Search by name..." className="py-2 px-4 border rounded-lg outline-none" onChange={searchByListingName} />
                    <select className="py-2 px-4 border rounded-lg outline-none" onChange={filterByCategory}>
                        <option value="all">All types</option>
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non-Veg</option>
                    </select>

                    <select className="py-2 px-4 border rounded-lg outline-none" onChange={filterByStatus}>
                        <option value="all">All status</option>
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="collected">Collected</option>
                    </select>
                </form>
            }

            {/* food listings */}
            <div className={`grid ${isMenuOpen ? "grid-cols-3" : "grid-cols-4"} gap-4 mt-6`}>
                {foodListings.length === 0 ? <div className="text-center text-red-400">You don't have any Listing.</div> :
                    currentListings.length == 0 ?
                        <div className="text-center text-red-400">
                            The filtered result not available, Choose a different filter
                        </div> :
                        currentListings.map((foodListing) => {
                            return <ListingCard
                                key={foodListing._id}
                                foodListing={foodListing}
                                handleDelete={handleDelete}
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                                getMyFoodListings={getMyFoodListings} />
                        })
                }
            </div>
        </div >
    )
}

export default MyListing;


