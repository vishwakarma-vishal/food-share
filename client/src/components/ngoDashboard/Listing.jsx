import React from 'react'
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

const Listing = ({ isMenuOpen }) => {
    return (
        <div>
            {/* filters */}
            <div className="flex justify-between">
                <h2 className="font-semibold text-2xl">Food Listings</h2>

                <form className="flex gap-4">
                    <input type="text" placeholder="search listing..." className="p-2 rounded-lg outline-none" />
                    <select className="p-2 rounded-lg outline-none">
                        <option value="all-type">All types</option>
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non-veg</option>
                    </select>

                    <select className="p-2 rounded-lg outline-none">
                        <option value="all-status">All status</option>
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="collected">Collected</option>
                    </select>
                </form>
            </div>

            {/* food listings */}
            <div className={`grid ${isMenuOpen ? "grid-cols-3" : "grid-cols-4"} gap-4 mt-6`}>
                {foodListings.map((foodListing) => {
                    return <ListingCard key={foodListing.id} foodListing={foodListing} />
                })}

            </div>
        </div>
    )
}

export default Listing;