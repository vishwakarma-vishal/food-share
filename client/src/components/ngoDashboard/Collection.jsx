import React from 'react'
import { useState } from 'react';

export const collectionHistory = [
  {
    id: 1,
    foodName: 'Rice and Lentils',
    type: 'Veg',
    expiry: '2024-11-28',
    pickupDate: '2024-10-12',
    restaurantName: 'Helping Hands NGO',
  },
  {
    id: 2,
    foodName: 'Chicken Curry',
    type: 'Non-Veg',
    expiry: '2024-11-27',
    pickupDate: '2024-10-12',
    restaurantName: 'Food For All',
  },
  {
    id: 3,
    foodName: 'Vegetable Biryani',
    type: 'Veg',
    expiry: '2024-11-29',
    pickupDate: '2024-10-12',
    restaurantName: 'Care Foundation',
  },
  {
    id: 4,
    foodName: 'Fruit Basket',
    type: 'Veg',
    expiry: '2024-11-30',
    pickupDate: '2024-10-12',
    restaurantName: 'Charity Aid',
  },
  {
    id: 5,
    foodName: 'Fish Curry',
    type: 'Non-Veg',
    expiry: '2024-12-01',
    pickupDate: '2024-10-12',
    restaurantName: 'Helping Hands NGO',
  },
  {
    id: 6,
    foodName: 'Bread and Butter',
    type: 'Veg',
    expiry: '2024-11-28',
    pickupDate: '2024-10-12',
    restaurantName: 'Good Samaritan Trust',
  },
  {
    id: 7,
    foodName: 'Egg Curry',
    type: 'Non-Veg',
    expiry: '2024-11-29',
    pickupDate: '2024-10-12',
    restaurantName: 'Care Foundation',
  },
  {
    id: 8,
    foodName: 'Mixed Vegetable Curry',
    type: 'Veg',
    expiry: '2024-12-02',
    pickupDate: '2024-10-12',
    restaurantName: 'Helping Hands NGO',
  },
  {
    id: 9,
    foodName: 'Mutton Stew',
    type: 'Non-Veg',
    expiry: '2024-12-03',
    pickupDate: '2024-10-12',
    restaurantName: 'Food For All',
  },
  {
    id: 10,
    foodName: 'Dal Tadka',
    type: 'Veg',
    expiry: '2024-12-01',
    pickupDate: '2024-10-12',
    restaurantName: 'Charity Aid',
  },
  {
    id: 11,
    foodName: 'Paneer Butter Masala',
    type: 'Veg',
    expiry: '2024-11-28',
    pickupDate: '2024-10-12',
    restaurantName: 'Helping Hands NGO',
  },
  {
    id: 12,
    foodName: 'Grilled Chicken',
    type: 'Non-Veg',
    expiry: '2024-11-29',
    pickupDate: '2024-10-12',
    restaurantName: 'Care Foundation',
  },
  {
    id: 13,
    foodName: 'Spinach Soup',
    type: 'Veg',
    expiry: '2024-11-30',
    pickupDate: '2024-10-12',
    restaurantName: 'Good Samaritan Trust',
  },
  {
    id: 14,
    foodName: 'Vegetable Fried Rice',
    type: 'Veg',
    expiry: '2024-12-01',
    pickupDate: '2024-10-12',
    restaurantName: 'Charity Aid',
  },
  {
    id: 15,
    foodName: 'Chicken Sandwich',
    type: 'Non-Veg',
    expiry: '2024-12-02',
    pickupDate: '2024-10-12',
    restaurantName: 'Food For All',
  },
];

export const Collection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentHistory, setCurrentHistory] = useState(collectionHistory);

  // search
  const searchInHistory = (e) => {
    const searchTerm = e.target.value;

    const newArray = collectionHistory.filter(item =>
      item.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()));

    setCurrentHistory(newArray);
  }

  // filters
  const sortHistory = (e) => {
    const type = e.target.value;

    if (type == "expiry") {
      sortByExpiry();
    } else if (type == "pickup-date") {
      sortByPickupDate();
    } else {
      sortByName();
    }
  }

  const sortByExpiry = () => {
    const newArray = [...currentHistory].sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
    setCurrentHistory(newArray);
  }

  const sortByPickupDate = () => {
    const newArray = [...currentHistory].sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate));
    setCurrentHistory(newArray);
  }

  const sortByName = () => {
    const newArray = [...currentHistory]
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
        <h2 className="font-semibold text-2xl">Collection History</h2>

        <form className="flex items-center gap-4">
          <input type="text" placeholder="Search by Food or Restaurant..." className="p-2 w-56  text-sm rounded-lg border outline-none" onChange={searchInHistory} />
          <label htmlFor="sort" className="font-medium">Sort By</label>
          <select id="sort" className="py-2 px-4 rounded-lg border outline-none" onChange={sortHistory}>
            <option value="expiry">Expiry</option>
            <option value="pickup-date">Pickup Date</option>
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
              <th className="border-b p-3">Type</th>
              <th className="border-b p-3">Expiry</th>
              <th className="border-b p-3">Pickup Date</th>
              <th className="border-b p-3">Restaurant Name</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((collection) => {
              return (
                <tr key={collection.id} className="text-left text-sm text-gray-800 hover:bg-gray-200">
                  <td className="border-b p-3">{collection.foodName}</td>
                  <td className="border-b p-3">{collection.type}</td>
                  <td className="border-b p-3">{collection.expiry}</td>
                  <td className="border-b p-3">{collection.pickupDate}</td>
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
