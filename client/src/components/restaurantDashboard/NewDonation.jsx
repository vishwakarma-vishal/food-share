import { useState } from "react";
import { toast } from "react-toastify";
import { FiUploadCloud } from "react-icons/fi";
import api from "../../utils/interceptors";

const NewDonation = ({ setIsSelected }) => {
    const [previewImg, setPreviewImg] = useState("");
    const [imageFile, setImageFile] = useState(null); // store the file object
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        expiry: "",
        pickupFrom: "",
        pickupTill: "",
        description: "",
        deliveryNote: ""
    });
    const [loading, setLoading] = useState(false);

    const changeHandler = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        if (e.target.type === 'file') {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImg(reader.result);
            }
            reader.readAsDataURL(file);
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    }

    // submit form
    const submitHandler = async (e) => {
        e.preventDefault();

        // check expiry date
        const expiryDate = formData.expiry;
        const currentDate = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        if (expiryDate < currentDate()) {
            toast.info("Expiry can't be in the past.");
            return;
        }

        // append the data to formdata
        const formDataToSend = new FormData();
        formDataToSend.append('data', JSON.stringify(formData));
        if (imageFile) {
            formDataToSend.append('listingImg', imageFile);
        }

        try {
            setLoading(true);
            const response = await api({
                url: `${import.meta.env.VITE_API_URL}/listing/create`,
                method: "post",
                data: formDataToSend,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            const data = response.data;
            if (data.success) {
                setLoading(false);
                toast.success("Food listing is created.");
                setIsSelected("listing");
            }
        } catch (error) {
            setLoading(false);
            toast.error("Something went wrong, try again later.");
        }
    }

    // reset form
    const resetHandler = (e) => {
        e.preventDefault();

        setFormData({
            title: "",
            category: "",
            expiry: "",
            pickupFrom: "",
            pickupTill: "",
            description: "",
            deliveryNote: ""
        });
        setPreviewImg("");
        setImageFile(null);
    }

    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-lg">
            <h2 className="font-semibold text-2xl">New Food Donation</h2>

            <form className="mt-6 text-sm" onSubmit={submitHandler}>
                {/* first row */}
                <div className="flex gap-6">
                    {/* image */}
                    <div className="basis-6/12 w-full h-[180px] flex justify-center items-center">
                        {
                            previewImg ?
                                <div className="relative h-full w-full">
                                    <img src={previewImg} className="rounded-lg h-full w-full border"></img>
                                    <button
                                        type="button"
                                        className="absolute top-2 -left-1 text-xs bg-green-600 text-white p-1 rounded-sm"
                                        onClick={() => setPreviewImg("")}>
                                        Upload new img
                                    </button>
                                </div> :
                                <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded">
                                    <input
                                        type="file"
                                        id="fileInput"
                                        className="hidden"
                                        onChange={changeHandler}
                                    />
                                    <label htmlFor="fileInput" className="h-full w-full flex flex-col justify-center items-center cursor-pointer text-gray-800 rounded-md text-center border">
                                        <FiUploadCloud className="text-3xl" />
                                        <span className="text-xs">Upload new image</span>
                                    </label>
                                </div>
                        }
                    </div>


                    {/* name, category, expiry */}
                    <div className="flex-grow w-full">
                        <div>
                            <label htmlFor="title">Food Title</label><br />
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={changeHandler}
                                minLength={3}
                                maxLength={100}
                                placeholder="Enter food item name..."
                                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none"
                                required />
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label htmlFor="category">Category</label><br />
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={changeHandler}
                                    className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none"
                                    required>
                                    <option value="" disabled>Select category</option>
                                    <option value="veg">Veg</option>
                                    <option value="non-veg">Non Veg</option>
                                </select>
                            </div>
                            <div className="w-full">
                                <label htmlFor="expiry">Expiry</label><br />
                                <input
                                    id="expiry"
                                    name="expiry"
                                    type="date"
                                    value={formData.expiry}
                                    onChange={changeHandler}
                                    className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none"
                                    required />
                            </div>
                        </div>
                    </div>
                </div>

                {/*second row => pickupfrom - pickuptill */}
                <div className="mt-4">
                    <div className="flex gap-4">
                        <div className="w-full">
                            <label htmlFor="pickupFrom">Pickup From</label><br />
                            <input
                                id="pickupFrom"
                                name="pickupFrom"
                                type="time"
                                value={formData.pickupFrom}
                                onChange={changeHandler}
                                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none"
                                required />
                        </div>
                        <div className="w-full">
                            <label htmlFor="pickupTill">Pickup Till</label><br />
                            <input
                                id="pickupTill"
                                name="pickupTill"
                                type="time"
                                value={formData.pickupTill}
                                onChange={changeHandler}
                                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none"
                                required />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-full">
                            <label htmlFor="description">Description</label><br />
                            <textarea
                                id="description"
                                name="description"
                                rows="3"
                                minLength={3}
                                maxLength={300}
                                value={formData.description}
                                onChange={changeHandler}
                                placeholder="Add a short description of the food"
                                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none"
                                required />
                        </div>
                        <div className="w-full">
                            <label htmlFor="deliveryNote">Pickup Note</label><br />
                            <textarea
                                id="deliveryNote"
                                name="deliveryNote"
                                rows="3"
                                maxLength={100}
                                value={formData.deliveryNote}
                                onChange={changeHandler}
                                placeholder="Special instruction for pickup (eg. contact details)"
                                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={resetHandler}
                        className={`mt-4 block bg-gray-600 text-white font-semibold w-1/2 mx-auto py-2 rounded-lg ${loading && "bg-gray-400 cursor-not-allowed"}`}
                        disabled={loading}>
                        Reset Form
                    </button>
                    <button
                        type="submit"
                        className={`mt-4 block bg-green-600 text-white font-semibold w-1/2 mx-auto py-2 rounded-lg ${loading && "bg-green-400 cursor-not-allowed"}`}
                        disabled={loading}>
                        {loading ? "Submitting Donation..." : "Submit Donation"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default NewDonation;