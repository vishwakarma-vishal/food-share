import api from "../../utils/interceptors";
import useAuth from "../../utils/useAuth";
import EditListingModal from './EditListingModal';
import axios from "axios";
import { toast } from "react-toastify";

const ListingCard = ({ foodListing, handleDelete, isModalOpen, setIsModalOpen, getMyFoodListings }) => {

    // format date like 1-jan-2025
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // format time from 24 hours to 12 hours format
    const formatTime = (time) => {
        let [hours, minutes] = time.split(':').map(Number);
        let ampm = "AM";

        if (hours === 0) {
            hours = 12;
        } else if (hours === 12) {
            ampm = "PM";
        } else if (hours > 12) {
            hours = hours % 12;
            ampm = "PM";
        }

        return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    }

    // mark food as collected
    const collectHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await api({
                url: `${import.meta.env.VITE_API_URL}/restaurant/history`,
                method: "post",
                data: {
                    foodListingId: foodListing._id,
                },
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (response.data.success) {
                toast.success("Mark collected successfully.");
                getMyFoodListings();
            } else {
                toast.info("Unable to mark collected.");
            }
            console.log(response);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong, try again later.");
        }

    }

    return (
        <div className=" bg-white p-4 rounded-lg flex flex-col gap-1 shadow-lg flex flex-col justify-between">
            {/* image and delivery note */}
            <div className="relative w-full h-full">
                <img src={foodListing.imageUrl} alt="food listing image" className="w-full h-40 rounded-lg" />

                {/* absolute posioned pickup note */}
                {foodListing.deliveryNote && <p className="absolute top-2 -left-2 bg-gray-300 p-2 rounded-sm text-xs font-semibold">Delivery Note: <span className="font-normal text-gray-600">{foodListing.deliveryNote}</span></p>}
            </div>

            {/* details */}
            <div className="my-2 flex flex-col gap-y-1">
                <h3 className="font-semibold">{foodListing.title}</h3>
                <p className="text-gray-600 text-sm">{foodListing.description}</p>

                <div className="mt-1 flex flex-col gap-y-1">
                    <p className="text-sm font-semibold">
                        Category:
                        <span className="font-normal text-gray-600"> {foodListing.category}</span>
                    </p>
                    <p className="text-sm font-semibold">
                        Expiry:
                        <span className="font-normal text-gray-600"> {formatDate(foodListing.expiry)}</span>
                    </p>
                    <p className="text-sm font-semibold">
                        Pickup Time:
                        <span className="font-normal text-gray-600"> {formatTime(foodListing.pickupFrom)} - {formatTime(foodListing.pickupTill)}</span>
                    </p>
                    {(foodListing.reservedBy?.name && foodListing.status === "reserved") &&
                        <p className="text-sm font-semibold">
                            Reserved By:
                            <span className="font-normal text-gray-600">{foodListing.reservedBy.name}</span>
                        </p>
                    }
                </div>
            </div>

            {/* mark collected action will appears when an ngo reserved a food */}
            {
                foodListing.status.toLowerCase() == "reserved" &&
                <button
                    onClick={collectHandler}
                    className="py-1 rounded-full text-white bg-yellow-600"
                >
                    Mark Collected
                </button>
            }

            {/* buttons */}
            {
                (foodListing.status === "available" || foodListing.status === "reserved") ?
                <div className="mt-2 w-full flex gap-4">
                    <button onClick={() => setIsModalOpen(true)} className="py-1 text-white bg-green-600 w-full rounded-full">Edit</button>
                    <button onClick={() => handleDelete(foodListing._id)} className="py-1 text-white bg-red-600 w-full rounded-full">Delete</button>
                </div> :
                <div className="bg-gray-300 text-center py-1 rounded-sm">{foodListing.status}</div>
            }

            {/* editing modal */}
            {isModalOpen &&
                <EditListingModal
                    foodListing={foodListing}
                    setIsModalOpen={setIsModalOpen}
                    getMyFoodListings={getMyFoodListings} />
            }
        </div>
    );
}

export default ListingCard;