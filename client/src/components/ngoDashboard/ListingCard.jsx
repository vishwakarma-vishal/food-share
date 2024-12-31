
const ListingCard = ({ foodListing }) => {
    return (
        <div className="relative bg-white p-4 rounded-lg flex flex-col gap-1 shadow-lg flex flex-col justify-between">
            <img src={foodListing.imageUrl} alt="food listing image" className="relative w-full h-40 rounded-lg" />

            <div className="my-2">
                <h3 className="font-semibold">{foodListing.name}</h3>
                <p className="text-gray-600 text-sm">{foodListing.description}</p>
                <p className="text-sm font-semibold">Category: <span className="font-normal text-gray-600">{foodListing.category}</span></p>
                <p className="text-sm font-semibold">Expiry: <span className="font-normal text-gray-600">{foodListing.expiry}</span></p>
                <p className="text-sm font-semibold">Pickup Time: <span className="font-normal text-gray-600">{foodListing.pickupFrom} - {foodListing.pickupTillTime}</span></p>
                <p className="text-sm font-semibold">Address: <span className="font-normal text-gray-600">{foodListing.address}</span></p>
            </div>

            {foodListing.pickupNote && <p className="absolute top-32 left-2 bg-gray-300 p-2 rounded-sm text-xs font-semibold">Pickup Note: <span className="font-normal text-gray-600">{foodListing.pickupNote}</span></p>}

            <button
                className={`py-1 rounded-sm text-white
                ${foodListing.status.toLowerCase() == "available" && "bg-green-600"}
                ${foodListing.status.toLowerCase() == "reserved" && "bg-yellow-600"}
                ${foodListing.status.toLowerCase() == "collected" && "bg-gray-600"}`}
            >{foodListing.status}
            </button>
        </div>
    );
}

export default ListingCard;