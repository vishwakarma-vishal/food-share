import React, { useEffect, useState } from 'react'; // Combined useState import
import { toast } from 'react-toastify';
import AddToDistributionModal from './AddToDistributionModal';
import api from '../../utils/interceptors';

export const Collection = () => {
  const [collectionHistory, setCollectionHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentHistory, setCurrentHistory] = useState(collectionHistory);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listingId, setListingId] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortFilter, setSortFilter] = useState("expiry");

  // fetch collection history
  const getCollectionHistory = async () => {
    try {
      setLoading(true);

      const response = await api({
        url: `${import.meta.env.VITE_API_URL}/ngo/collection`,
        method: "get",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      console.log(response.data.collectionHistory);

      setCollectionHistory(response.data.collectionHistory);
      setCurrentHistory(response.data.collectionHistory);
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

  // apply filter
  const applyFilter = () => {
    let filteredListings = [...collectionHistory];

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
  }, [collectionHistory, searchTerm, sortFilter]);

  // set search term
  const searchInHistory = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  }

  // set sort filter
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
      <h2 className="font-semibold text-2xl">Collection History</h2>

      {loading ?
        <div className="text-gray-500 h-full flex justify-center items-center">loading...</div> :
        <div className='mt-4 h-full'>
          {/* data */}
          {
            collectionHistory.length === 0 ?
              <div className="text-gray-500 flex justify-center items-center h-full">
                You haven't collected any food yet.
              </div>
              :
              <div className="relative">
                <div>
                  {/* filters */}
                  <div>
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
                  </div>

                  {/* notice */}
                  <div className="bg-red-100 text-red-600 my-6 p-4 rounded-lg shadow-sm text-sm">
                    Foods that are expiring soon is on the top by default, try to distribute them first before they got expired.
                  </div>

                  {currentHistory.length === 0 ?
                    <div className="text-gray-500 h-full flex justify-center items-center">
                      No results found, please try searching with different keywords.
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
                            <th className="border-b p-3">Restaurant Name</th>
                            <th className="border-b p-3 text-center">Mark Distributed</th>
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
                                <td className="border-b p-3">{collection.foodListingId.restaurantId.name}</td>
                                <td className="border-b p-3">
                                  {
                                    collection.foodListingId.status == "collected" ?
                                      <button
                                        className="bg-blue-500 text-white py-1 px-3 rounded-full font-semibold mx-auto block"
                                        onClick={() => {
                                          setIsModalOpen(true);
                                          setListingId(collection.foodListingId._id)
                                        }}
                                      >
                                        Mark Distributed
                                      </button> :
                                      <span className="block text-green-500 font-semibold mx-auto text-center">Distributed</span>
                                  }

                                  {/* modal */}
                                  {isModalOpen &&
                                    <AddToDistributionModal
                                      setIsModalOpen={setIsModalOpen}
                                      listingId={listingId}
                                      getCollectionHistory={getCollectionHistory} />
                                  }
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>

                      {/* pagination */}
                      <div className="flex gap-4 items-center mt-6">
                        <button onClick={goToPrevPage} className="bg-green-600 py-1 px-4 rounded-lg text-white">Previous</button>
                        <button onClick={goToNextPage} className="bg-blue-600 py-1 px-4 rounded-lg text-white">Next</button>

                        <span className="ml-auto text-sm">Page {currentPage} of {totalPages}</span>
                      </div>
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
