import { toast } from "react-toastify";
import api from "../../utils/interceptors";

const ListingCard = ({ foodListing, getListings }) => {
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

    // reserve food
    const reserveHandler = async (e) => {
        e.preventDefault();

        const confirmation = confirm("Be sure that you can collect the food, because you can't unreserved the food again.");

        if (!confirmation) return;
        console.log(api);

        try {
            const response = await api({
                url: "http://localhost:3001/ngo/reserve",
                method: "post",
                data: {
                    "FoodListingId": foodListing._id
                },
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (response.data.success) {
                toast.success("Food reserved successfully, make sure that you collect the food.");
                getListings();
            } else {
                toast.info("Faild to reserve food.");
            }

        } catch (error) {
            toast.error("An error occurred while reserving the food.");
        }
    }

    return (
        <div className="relative bg-white p-4 rounded-lg flex flex-col gap-1 shadow-lg flex flex-col justify-between">
            {/* image */}
            <img src={foodListing.imageUrl}
                alt="food listing image"
                className="relative w-full h-40 rounded-lg"
            />

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
                        <span className="font-normal text-gray-600">
                            {" "}{formatTime(foodListing.pickupFrom)} - {formatTime(foodListing.pickupTill)}
                        </span>
                    </p>
                    <p className="text-sm font-semibold">
                        Restaurant:
                        <span className="font-normal text-gray-600"> {foodListing.restaurantId.restaurantName}</span>
                    </p>
                    <p className="text-sm font-semibold">
                        Address:
                        <span className="font-normal text-gray-600"> {foodListing.restaurantId.address}</span>
                    </p>
                </div>
            </div>

            {/* absolute posioned pickup note */}
            {
                foodListing.deliveryNote &&
                <p className="absolute top-32 left-2 bg-gray-300 p-2 rounded-sm text-xs font-semibold">
                    Delivery Note:
                    <span className="font-normal text-gray-600"> {foodListing.deliveryNote}</span>
                </p>
            }

            {/* action button */}
            {foodListing.status.toLowerCase() == "available" ?
                <button
                    onClick={reserveHandler}
                    className="py-1 rounded-sm text-white bg-green-500 hover:bg-green-600 duration-200"
                > reserve
                </button> :

                <button
                    className={`py-1 rounded-sm text-white cursor-not-allowed
                ${foodListing.status.toLowerCase() == "reserved" && "bg-yellow-500"}
                ${foodListing.status.toLowerCase() == "collected" && "bg-gray-500"}`}
                    disabled
                > {foodListing.status}
                </button>
            }
        </div>
    );
}

export default ListingCard;