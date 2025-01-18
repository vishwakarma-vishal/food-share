import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import api from "../../utils/interceptors";

const AddToDistributionModal = ({ listingId, setIsModalOpen, getCollectionHistory }) => {
    const [distributionNote, setDistributionNote] = useState("");

    // mark food as distributed
    const markDistributed = async () => {
        console.log(localStorage.getItem("token"));

        try {
            const response = await api({
                url: `${import.meta.env.VITE_API_URL}/ngo/distribution-history`,
                method: "post",
                data: {
                    distributionNote,
                    foodListingId: listingId
                },
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            console.log(response);

            if (response.data.success) {
                setIsModalOpen(false);
                toast.success("Food is added to distribution history");
                getCollectionHistory();
            }
        } catch (error) {
            console.log(error);
            toast.error("Unable to add food in distribution history, try again later.");
        }
    }

    return (
        <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>

            <div className="bg-white py-2 px-4 border w-[300px] rounded-lg flex flex-col gap-y-2">
                <IoIosClose className="block ml-auto w-6 h-6 cursor-pointer" onClick={() => setIsModalOpen(false)} />

                {/* modal */}
                <div>
                    <label htmlFor="note" className="font-semibold text-sm">
                        Distribution Note
                        <span className="ml-1 font-normal text-xs">(Max 100 char)</span>
                    </label>
                    <textarea
                        id="note"
                        placeholder="Anything that you want to remember about distribution."
                        rows="4"
                        value={distributionNote}
                        onChange={(e) => setDistributionNote(e.target.value)}
                        maxLength={100}
                        className="mt-2 border rounded-lg text-sm outline-none p-2 w-full"
                    >
                    </textarea>
                </div>

                <button
                    className="bg-blue-500 text-white text-sm py-1 rounded-full"
                    onClick={() => markDistributed()}>
                    Mark Distributed
                </button>
            </div>
        </div>
    )
}

export default AddToDistributionModal;