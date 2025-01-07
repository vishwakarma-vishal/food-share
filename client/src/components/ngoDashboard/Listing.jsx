import React, { useEffect, useState } from 'react'
import ListingCard from './ListingCard';
import axios from 'axios';
import { toast } from 'react-toastify'

const MyListing = ({ isMenuOpen }) => {
    const [foodListings, setFoodListings] = useState([]);
    const [currentListings, setCurrentListings] = useState(foodListings);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // fetch all food listings
    const getListings = async () => {
        try {
            const response = await axios({
                url: "http://localhost:3001/ngo/all",
                method: "get",
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = response.data;

            setFoodListings(data.FoodListings);
            setCurrentListings(data.FoodListings);

        } catch (error) {
            const errorMessage = error.response.data.message;

            if (error.status === 404) {
                toast.info(errorMessage);
            } else {
                toast.error("Something went wrong, try again later.");
            }
        }
    }

    useEffect(() => {
        getListings()
    }, []);


    // apply all the filters
    const applyFilter = () => {
        let filteredListings = foodListings;

        // apply search filter
        if (searchTerm.trim() !== "") {
            filteredListings = filteredListings.filter((listing) => {
                return listing.title.toLowerCase().includes(searchTerm);
            });
        }

        // apply category filter
        if (categoryFilter !== "all") {
            filteredListings = filteredListings.filter((listing) => {
                return listing.category.toLowerCase() === categoryFilter;
            });
        }

        // apply status filter
        if (statusFilter !== "all") {
            filteredListings = filteredListings.filter((listing) => {
                return listing.status.toLowerCase() === statusFilter;
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

    return (
        <div>
            <div className="flex justify-between">
                <h2 className="font-semibold text-2xl">Food Listings</h2>

                {/* filters */}
                <form className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="py-2 px-4 border rounded-lg outline-none"
                        onChange={searchByListingName}
                    />
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
            </div>

            {/* food listings */}
            <div
                className={`grid ${isMenuOpen ? "grid-cols-3" : "grid-cols-4"} gap-4 mt-6`}>
                {
                    foodListings.length === 0 ?
                        <div className="text-center text-gray-400">
                            No foods are available as of now, check after some time.
                        </div> :
                        currentListings.length == 0 ?
                            <div className="text-center text-gray-400">
                                The filtered result not available, Choose a different filter.
                            </div> :
                            // dispalying all food listings here
                            currentListings.map((foodListing) => {
                                return <ListingCard
                                    key={foodListing._id} 
                                    foodListing={foodListing}
                                    getListings={getListings} />
                            })
                }

            </div>
        </div>
    )
}

export default MyListing;