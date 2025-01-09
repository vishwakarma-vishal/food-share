import axios from 'axios';
import React, { useEffect, useState } from 'react'; // Combined useState import
import { toast } from 'react-toastify';

// food name, collected from, category, expiry, distribution date, distribution note

export const Distribution = () => {
  const [collectionHistory, setCollectionHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentHistory, setCurrentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch distribution history
  const getCollectionHistory = async () => {
    try {
      const response = await axios({
        url: "http://localhost:3001/ngo/collection",
        method: "get",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      setCollectionHistory(response.data.collectionHistory);

      const sortedHistory = [...response.data.collectionHistory].sort((a, b) => new Date(a.foodListingId.expiry) - new Date(b.foodListingId.expiry));
      setCurrentHistory(sortedHistory);

    } catch (error) {
      console.log(error);
      toast.error("Unable to collect history, try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCollectionHistory();
  }, []);

  // format date like 1-jan-2025
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // search
  const searchInHistory = (e) => {
    const searchTerm = e.target.value;

    const newArray = collectionHistory.filter(item =>
      item.foodListingId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.foodListingId.restaurantId.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()));

    setCurrentHistory(newArray);
  }

  // filters
  const sortHistory = (e) => {
    const type = e.target.value;

    if (type === "expiry") {
      sortByExpiry();
    } else if (type === "pickup-date") {
      sortByPickupDate();
    } else {
      sortByName();
    }
  }

  const sortByExpiry = () => {
    const newArray = [...currentHistory].sort((a, b) => new Date(a.foodListingId.expiry) - new Date(b.foodListingId.expiry));
    setCurrentHistory(newArray);
  }

  const sortByPickupDate = () => {
    const newArray = [...currentHistory].sort((a, b) => new Date(b.collectedAt) - new Date(a.collectedAt));
    setCurrentHistory(newArray);
  }

  const sortByName = () => {
    const newArray = [...currentHistory]
      .sort(function (a, b) {
        let x = a.foodListingId.title.toLowerCase();
        let y = b.foodListingId.title.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
      });
    setCurrentHistory(newArray);
  }

  const rowsPerPage = 7; // we can change as per the requirement
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = currentHistory.slice(indexOfFirstRow, indexOfLastRow);

  // pagination handlers
  const totalPages = Math.ceil(currentHistory.length / rowsPerPage);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col h-full">
      {/* filters */}
      <div className="flex justify-between">
        <h2 className="font-semibold text-2xl">Distribution History</h2>

        <form className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by Food or Restaurant..."
            className="p-2 w-56  text-sm rounded-lg border outline-none"
            onChange={searchInHistory}
          />
          <label htmlFor="sort" className="font-medium">Sort By</label>
          <select id="sort" className="py-2 px-4 rounded-lg border outline-none" onChange={sortHistory}>
            <option value="expiry">Expiry</option>
            <option value="pickup-date">Pickup Date</option>
            <option value="food-name">Food Name</option>
          </select>
        </form>
      </div>

      {/* data */}
      {
        loading ?
          <div className="text-gray-500 flex justify-center items-center h-full">Loading...</div>
          : collectionHistory.length === 0 ?
            <div className="text-gray-500 flex justify-center items-center h-full">Ooops, You haven't collected any food yet.</div>
            :
            <div>
              <div>
                <div className="bg-yellow-100 text-yellow-900 my-6 p-4 rounded-lg shadow-sm text-sm">
                  Foods that are expiring soon is on the top by default, try to distribute them first before they got expired. 
                </div>

                <table className="w-full rounded-lg border-collapse shadow-xl bg-white">
                  <thead>
                    <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                      <th className="border-b p-3">Food Name</th>
                      <th className="border-b p-3">Category</th>
                      <th className="border-b p-3">Expiry</th>
                      <th className="border-b p-3">Pickup Date</th>
                      <th className="border-b p-3">Collected From</th>
                      <th className="border-b p-3">Distribution Date</th>
                      <th className="border-b p-3">Distribution Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((collection) => {
                      return (
                        <tr key={collection._id} className="text-left text-sm text-gray-800 hover:bg-gray-200">
                          <td className="border-b p-3">{collection.foodListingId.title}</td>
                          <td className="border-b p-3">{collection.foodListingId.category}</td>
                          <td className="border-b p-3">{formatDate(collection.foodListingId.expiry)}</td>
                          <td className="border-b p-3">{formatDate(collection.collectedAt)}</td>
                          <td className="border-b p-3">{collection.foodListingId.restaurantId.restaurantName}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* pagination */}
              <div className="flex gap-4 items-center mt-6">
                <button onClick={goToPrevPage} className="bg-green-600 py-1 px-4 rounded-lg text-white">Previous</button>
                <button onClick={goToNextPage} className="bg-blue-600 py-1 px-4 rounded-lg text-white">Next</button>

                <span className="ml-auto text-sm">Page {currentPage} of {totalPages}</span>
              </div>
            </div>
      }
    </div>
  )
}
