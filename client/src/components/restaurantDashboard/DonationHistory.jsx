import React from 'react'
import { useState } from 'react';

export const donationHistory = [
    {
        id: 1,
        foodName: 'Rice and Lentils',
        status: 'collected',
        donationDate: '2024-11-02',
        restaurantName: 'Helping Hands NGO',
    },
    {
        id: 2,
        foodName: 'Vegetable Soup',
        status: 'expired',
        donationDate: '2024-11-10',
        restaurantName: 'Food For All',
    },
    {
        id: 3,
        foodName: 'Chicken Curry',
        status: 'collected',
        donationDate: '2024-10-28',
        restaurantName: 'Caring Meals Kitchen',
    },
    {
        id: 4,
        foodName: 'Pasta Primavera',
        status: 'expired',
        donationDate: '2024-11-12',
        restaurantName: 'Community Table',
    },
    {
        id: 5,
        foodName: 'Bread and Butter',
        status: 'collected',
        donationDate: '2024-10-30',
        restaurantName: 'Kind Hearts Cafe',
    },
    {
        id: 6,
        foodName: 'Grilled Vegetables',
        status: 'collected',
        donationDate: '2024-11-01',
        restaurantName: 'Healthy Bites',
    },
    {
        id: 7,
        foodName: 'Fruit Salad',
        status: 'expired',
        donationDate: '2024-11-05',
        restaurantName: 'Nature’s Basket',
    },
    {
        id: 8,
        foodName: 'Beef Stew',
        status: 'collected',
        donationDate: '2024-11-03',
        restaurantName: 'Warm Meals Organization',
    },
    {
        id: 9,
        foodName: 'Vegetable Fried Rice',
        status: 'collected',
        donationDate: '2024-10-27',
        restaurantName: 'Food Haven',
    },
    {
        id: 10,
        foodName: 'Pumpkin Soup',
        status: 'expired',
        donationDate: '2024-11-08',
        restaurantName: 'Harvest Kitchen',
    },
];

const DonationHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentHistory, setCurrentHistory] = useState(donationHistory);
    const [searchedHistory, setSearchedHistory] = useState(donationHistory);

    // search
    const searchInHistory = (e) => {
        const searchTerm = e.target.value;

        const newArray = donationHistory.filter(item =>
            item.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()));

        setCurrentHistory(newArray);
        setSearchedHistory(newArray);
    }

    // filters
    const sortHistory = (e) => {
        const type = e.target.value;

        if (type == "donation-date") {
            sortByDonationDate();
        } else {
            sortByName();
        }
    }

    const sortByDonationDate = () => {
        const newArray = [...searchedHistory].sort((a, b) => new Date(a.donationDate) - new Date(b.donationDate));
        setCurrentHistory(newArray);
    }

    const sortByName = () => {
        const newArray = [...searchedHistory]
            .sort(function (a, b) {
                let x = a.foodName.toLowerCase();
                let y = b.foodName.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });
        setCurrentHistory(newArray);
    }

    const rowsPerPage = 7; // we can change as per the requirment
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = currentHistory.slice(indexOfFirstRow, indexOfLastRow);

    // pagination handlers
    const totalPages = Math.ceil(currentHistory.length / rowsPerPage);
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="flex flex-col gap-y-6">
            {/* filters */}
            <div className="flex justify-between">
                <h2 className="font-semibold text-2xl">Donation History</h2>

                <form className="flex items-center gap-4">
                    <input type="text" placeholder="Search by Food or Restaurant..." className="p-2 w-56  text-sm rounded-lg border outline-none" onChange={searchInHistory} />
                    <label htmlFor="sort" className="font-medium">Sort By</label>
                    <select id="sort" className="py-2 px-4 rounded-lg border outline-none" onChange={sortHistory}>
                        <option value="donation-date">Donation Date</option>
                        <option value="food-name">Food Name</option>
                    </select>
                </form>
            </div>

            {/* data */}
            <div>
                <table className="w-full rounded-lg border-collapse shadow-xl bg-white">
                    <thead>
                        <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                            <th className="border-b p-3">Food Name</th>
                            <th className="border-b p-3">Status</th>
                            <th className="border-b p-3">Donation Date</th>
                            <th className="border-b p-3">Restaurant Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((collection) => {
                            return (
                                <tr key={collection.id} className="text-left text-sm text-gray-800 hover:bg-gray-200">
                                    <td className="border-b p-3">{collection.foodName}</td>
                                    <td className="border-b p-3">{collection.status}</td>
                                    <td className="border-b p-3">{collection.donationDate}</td>
                                    <td className="border-b p-3">{collection.restaurantName}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* pagination */}
            <div className="flex gap-4 items-center">
                <button onClick={goToPrevPage} className="bg-green-600 py-1 px-4 rounded-lg text-white">Previous</button>
                <button onClick={goToNextPage} className="bg-blue-600 py-1 px-4 rounded-lg text-white">Next</button>

                <span className="ml-auto text-sm">Page {currentPage} of {totalPages}</span>
            </div>
        </div>
    )
}

export default DonationHistory;