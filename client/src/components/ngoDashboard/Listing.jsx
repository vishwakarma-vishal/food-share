import React, { useEffect, useState } from 'react'
import ListingCard from './ListingCard';
import { toast } from 'react-toastify'
import api from '../../utils/interceptors';

const MyListing = ({ isMenuOpen }) => {
    const [foodListings, setFoodListings] = useState([]);
    const [currentListings, setCurrentListings] = useState(foodListings);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(false);

    // fetch all food listings
    const getListings = async () => {
        try {
            setLoading(true);

            const response = await api({
                url: `${import.meta.env.VITE_API_URL}/ngo/all`,
                method: "get",
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            const data = response.data;

            console.log(data);
            setFoodListings(data.FoodListings);
            setCurrentListings(data.FoodListings);

        } catch (error) {
            const errorMessage = error.response.data.message;

            if (error.status === 404) {
                toast.info(errorMessage);
            } else {
                toast.error("Something went wrong, try again later.");
            }
        } finally {
            setLoading(false);
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
        <div className="h-full">
            <h2 className="font-semibold text-2xl">Food Listings</h2>

            {loading ?
                <div className="text-gray-500 h-full flex justify-center items-center">loading...</div> :
                <div className="h-full">
                    {
                        foodListings.length === 0 ?
                            <div className="text-gray-500 h-full flex justify-center items-center">
                                No foods are available as of now, check after some time.
                            </div> :
                            <div className="h-full">
                                {/* filters */}
                                <form className="flex gap-4 mt-4">
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

                                {/* food listings */}
                                <div className="h-full">
                                    {
                                        currentListings.length === 0 ?
                                            <div className="text-gray-500 h-full flex justify-center items-center">
                                                The filtered result not available, Choose a different filter.
                                            </div> :
                                            // rendering all the lisings here
                                            <div
                                                className={`grid ${isMenuOpen ? "grid-cols-3" : "grid-cols-4"} gap-4 mt-6`}>
                                                {
                                                    currentListings.map((foodListing) => {
                                                        return <ListingCard
                                                            key={foodListing._id}
                                                            foodListing={foodListing}
                                                            getListings={getListings} />
                                                    })
                                                }
                                            </div>
                                    }
                                </div>
                            </div>
                    }
                </div>
            }
        </div>
    )
}

export default MyListing;