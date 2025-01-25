import React, { useEffect } from 'react'
import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/interceptors';

const DonationHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [donationHistory, setDonationHistory] = useState([]);
    const [currentHistory, setCurrentHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortFilter, setSortFilter] = useState("donation");
    const [loading, setLoading] = useState(false);

    // get donation history
    const getDonationHistory = async () => {
        try {
            setLoading(true);
            const response = await api({
                url: `${import.meta.env.VITE_API_URL}/restaurant/history`,
                method: "get",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });
            console.log(response.data.donationHistory);

            setDonationHistory(response.data.donationHistory);
            setCurrentHistory(response.data.donationHistory);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong, try again later");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDonationHistory()
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
        let filteredHistory = [...donationHistory];

        // search filter
        if (searchTerm !== "") {
            const newArray = donationHistory.filter(item =>
                item.foodListingId.title.toLowerCase().includes(searchTerm));

            filteredHistory = newArray;
        }

        // sort filter
        if (sortFilter === "donation") {
            const newArray = filteredHistory.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            filteredHistory = newArray;
        } else {
            const newArray = filteredHistory
                .sort(function (a, b) {
                    let x = a.foodListingId.title.toLowerCase();
                    let y = b.foodListingId.title.toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0;
                });
            filteredHistory = newArray;
        }
        setCurrentHistory(filteredHistory);
    }

    // update search term state
    const searchInHistory = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
    }

    // update sort filter state
    const sortHistory = (e) => {
        const type = e.target.value;
        setSortFilter(type);
    }

    // triger apply filter 
    useEffect(() => {
        applyFilter()
    }, [donationHistory, searchTerm, sortFilter]);


    const rowsPerPage = 7; // we can change as per the requirment
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = currentHistory.slice(indexOfFirstRow, indexOfLastRow);

    // pagination handlers
    const totalPages = Math.ceil(currentHistory.length / rowsPerPage);
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="flex flex-col gap-y-6 h-full">
            {/* filters */}
            {loading ?
                <div className="text-gray-500 h-full flex justify-center items-center">loading... </div> :
                <div className='h-full'>
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-2xl">Donation History</h2>

                        <form className="flex items-center gap-4">
                            <input type="text" placeholder="Search by Food or Restaurant..." className="p-2 w-56  text-sm rounded-lg border outline-none" onChange={searchInHistory} />
                            <label htmlFor="sort" className="font-medium">Sort By</label>
                            <select id="sort" className="py-2 px-4 rounded-lg border outline-none" onChange={sortHistory}>
                                <option value="donation">Donation Date</option>
                                <option value="name">Food Name</option>
                            </select>
                        </form>
                    </div>

                    {/* data */}
                    {donationHistory.length === 0 ?
                        <div className="text-gray-500 h-full flex justify-center items-center">
                            You haven't donated any food yet.
                        </div> :
                        currentHistory.length === 0 ?
                            <div className="text-gray-500 h-full flex justify-center items-center">
                                The filtered result not available, Choose a different filter.
                            </div> :
                            <div className="mt-5">
                                <table className="w-full rounded-lg border-collapse shadow-xl bg-white">
                                    <thead>
                                        <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
                                            <th className="border-b p-3">Food Name</th>
                                            <th className="border-b p-3">Status</th>
                                            <th className="border-b p-3">Donation Date</th>
                                            <th className="border-b p-3">Ngo Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRows.map((collection) => {
                                            return (
                                                <tr key={collection._id} className="text-left text-sm text-gray-800 hover:bg-gray-200">
                                                    <td className="border-b p-3">{collection.foodListingId.title}</td>
                                                    <td className="border-b p-3">{collection.status}</td>
                                                    <td className="border-b p-3">{formatDate(collection.createdAt)}</td>
                                                    <td className="border-b p-3">{collection.foodListingId.reservedBy?.name? collection.foodListingId.reservedBy.name: "NA" }</td>
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
            }
        </div>
    )
}

export default DonationHistory;