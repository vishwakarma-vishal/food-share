import React, { useEffect, useState } from 'react'
import ListingCard from './ListingCard';

const foodListings = [
    {
        id: 1,
        name: 'Vegetarian Pasta',
        description: 'Delicious vegetarian pasta with fresh vegetables and cheese.',
        imageUrl: 'https://via.placeholder.com/200',
        category: 'Veg',
        expiry: '2024-12-10',
        pickupFrom: '10:00 AM',
        pickupTillTime: '2:00 PM',
        status: 'Available',
        address: '123 Veg Street, Food City',
        pickupNote: "collect from neha sharma"
    },
    {
        id: 2,
        name: 'Garden Salad',
        description: 'A mix of fresh greens with a light dressing.',
        imageUrl: 'https://via.placeholder.com/200',
        category: 'Veg',
        expiry: '2024-12-12',
        pickupFrom: '11:00 AM',
        pickupTillTime: '3:00 PM',
        status: 'Reserved',
        address: '456 Salad Lane, Food City',
        pickupNote: ""
    },
    {
        id: 3,
        name: 'Cheese Pizza',
        description: 'Crispy crust pizza with a generous amount of cheese.',
        imageUrl: 'https://via.placeholder.com/200',
        category: 'Non-Veg',
        expiry: '2024-12-11',
        pickupFrom: '12:00 PM',
        pickupTillTime: '4:00 PM',
        status: 'Reserved',
        address: '789 Pizza Avenue, Food City',
        pickupNote: ""
    },
    {
        id: 4,
        name: 'Vegetarian Pasta',
        description: 'Delicious vegetarian pasta with fresh vegetables and cheese.',
        imageUrl: 'https://via.placeholder.com/200',
        category: 'Veg',
        expiry: '2024-12-10',
        pickupFrom: '10:00 AM',
        pickupTillTime: '2:00 PM',
        status: 'Collected',
        address: '123 Veg Street, Food City',
        pickupNote: "collect from neha sharma"
    },
    {
        id: 5,
        name: 'Garden Salad',
        description: 'A mix of fresh greens with a light dressing.',
        imageUrl: 'https://via.placeholder.com/200',
        category: 'Veg',
        expiry: '2024-12-12',
        pickupFrom: '11:00 AM',
        pickupTillTime: '3:00 PM',
        status: 'Available',
        address: '456 Salad Lane, Food City',
        pickupNote: ""
    },
];

const MyListing = ({ isMenuOpen }) => {
    const [currentListings, setCurrentListings] = useState(foodListings);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // apply all the filters
    const applyFilter = () => {
        let filteredListings = foodListings;

        // apply search filter
        if (searchTerm.trim() !== "") {
            filteredListings = filteredListings.filter((listing) => {
                return listing.name.toLowerCase().includes(searchTerm);
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
            {/* filters */}
            <div className="flex justify-between">
                <h2 className="font-semibold text-2xl">My Listings</h2>
                <button className="text-white bg-green-500 rounded-lg py-2 px-4 font-semibold">
                    New Listing
                </button>
            </div>

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


            {/* food listings */}
            <div className={`grid ${isMenuOpen ? "grid-cols-3" : "grid-cols-4"} gap-4 mt-6`}>
                {foodListings.length === 0 ? <div className="text-center text-red-400">You don't have any Listing.</div> :
                    currentListings.length == 0 ?
                        <div className="text-center text-red-400">The filtered result not available, Choose a different filter</div> :
                        currentListings.map((foodListing) => {
                            return <ListingCard key={foodListing.id} foodListing={foodListing} />
                        })
                }

            </div>
        </div >
    )
}

export default MyListing;