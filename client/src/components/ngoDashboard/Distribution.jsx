import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/interceptors';

export const Distribution = () => {
  const [distributionHistory, setDistributionHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentHistory, setCurrentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortFilter, setSortFilter] = useState("expiry");

  // fetch distribution history
  const getDistributionHistory = async () => {
    try {
      setLoading(true);
      const response = await api({
        url: `${import.meta.env.VITE_API_URL}/ngo/distribution-history`,
        method: "get",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      setDistributionHistory(response.data.distributionHistory);
      setCurrentHistory(response.data.distributionHistory);
    } catch (error) {
      console.log(error);
      toast.error("Unable to collect history, try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDistributionHistory();
  }, []);

  // format date like 1-jan-2025
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // apply filter
  const applyFilter = () => {
    let filteredListings = [...distributionHistory];

    // search filter
    if (searchTerm != "") {
      const newArray = filteredListings.filter(item =>
        item.foodListingId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.foodListingId.restaurantId.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()));

      filteredListings = newArray;
    }

    // sort filter
    if (sortFilter === "expiry") {
      const newArray = filteredListings.sort((a, b) => new Date(a.foodListingId.expiry) - new Date(b.foodListingId.expiry));

      filteredListings = newArray;
    } else if (sortFilter === "name") {
      const newArray = filteredListings
        .sort(function (a, b) {
          let x = a.foodListingId.title.toLowerCase();
          let y = b.foodListingId.title.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });

      filteredListings = newArray;
    } else {
      const newArray = filteredListings.sort((a, b) => new Date(b.reservedAt) - new Date(a.reservedAt));
      filteredListings = newArray;;
    }

    setCurrentHistory(filteredListings);
  }

  useEffect(() => {
    applyFilter();
  }, [distributionHistory, searchTerm, sortFilter]);

  // search
  const searchInHistory = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  }

  const sortByFilter = (e) => {
    const filter = e.target.value.toLowerCase();
    setSortFilter(filter);
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
    <div className="h-full">
      <h2 className="font-semibold text-2xl">Distribution History</h2>
      <div className="bg-green-100 text-green-900 my-4 p-4 rounded-lg shadow-sm text-sm">
        Thank you for making peoples life better, we really appreciate what you are doing. 👍
      </div>

      {
        loading ?
          <div className="text-gray-500 flex justify-center items-center h-full">Loading...</div> :
          <div className="h-full">
            {/* data */}
            {
              distributionHistory.length === 0 ?
                <div className="text-gray-500 flex justify-center items-center h-full text-center">
                  You haven't distributed any food yet,<br />
                  Please try to distribute the food before they got expired.
                </div> :
                <div className="flex flex-col gap-4">
                  {/* filters */}
                  <form className="flex items-center gap-4">
                    <input
                      type="text"
                      placeholder="Search by Food or Restaurant..."
                      className="p-2 w-56  text-sm rounded-lg border outline-none"
                      onChange={searchInHistory}
                    />
                    <label htmlFor="sort" className="font-medium">Sort By</label>
                    <select id="sort" className="py-2 px-4 rounded-lg border outline-none" onChange={sortByFilter}>
                      <option value="expiry">Expiry</option>
                      <option value="pickup">Pickup Date</option>
                      <option value="name">Food Name</option>
                    </select>
                  </form>

                  {
                    currentHistory.length === 0 ?
                      <div className="text-gray-500 mt-10 flex justify-center items-center">
                        No results found. please try searching with different keywords.
                      </div> :
                      <div>
                        {/* table */}
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
                                  <td className="border-b p-3">{formatDate(collection.foodListingId.reservedAt)}</td>
                                  <td className="border-b p-3">{collection.foodListingId.restaurantId.name}</td>
                                  <td className="border-b p-3">{formatDate(collection.createdAt)}</td>
                                  <td className="border-b p-3">{collection.distributionNote}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>

                        {/* pagination */}
                        <div className="flex gap-4 items-center mt-4">
                          <button onClick={goToPrevPage} className="bg-green-600 py-1 px-4 rounded-lg text-white">Previous</button>
                          <button onClick={goToNextPage} className="bg-blue-600 py-1 px-4 rounded-lg text-white">Next</button>

                          <span className="ml-auto text-sm">Page {currentPage} of {totalPages}</span>
                        </div>
                      </div>
                  }
                </div>
            }
          </div>
      }
    </div >
  )
}
