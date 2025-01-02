import { useState } from "react";

const NewDonation = () => {
    //  pickupfrom, pickuptill
    const [previewImg, setPreviewImg] = useState(false);

    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-lg">
            <h2 className="font-semibold text-2xl">New Food Donation</h2>

            <form className="mx-8 mt-6 text-sm">
                {/* first row */}
                <div className="flex gap-6">
                    {/* image */}
                    {
                        previewImg == "" ?
                            <div className="basis-5/12 w-full h-[160px] bg-gray-300 rounded-lg"></div> :
                            <input type="image" className="basis-5/12 w-full"></input>
                    }

                    {/* name, category, expiry */}
                    <div className="flex-grow w-full">
                        <div>
                            <label htmlFor="name">Food Title</label><br />
                            <input id="name" type="text" placeholder="Enter food item name..." className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label htmlFor="category">Category</label><br />
                                <select id="category" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none">
                                    <option value="veg">Veg</option>
                                    <option value="non-veg">Non Veg</option>
                                </select>
                            </div>
                            <div className="w-full">
                                <label htmlFor="expiry">Expiry</label><br />
                                <input id="expiry" type="date" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/*second row => pickupfrom - pickuptill */}
                <div className="mt-4">
                    <div className="flex gap-4">
                        <div className="w-full">
                            <label htmlFor="pickupFrom">Pickup From</label><br />
                            <input id="pickupFrom" type="time" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
                        </div>
                        <div className="w-full">
                            <label htmlFor="pickupTill">Pickup Till</label><br />
                            <input id="pickupTill" type="time" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-full">
                            <label htmlFor="description">Description</label><br />
                            <textarea id="description" rows="3" placeholder="Add a short description of the food" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
                        </div>
                        <div className="w-full">
                            <label htmlFor="note">Pickup Note</label><br />
                            <textarea id="note" rows="3" placeholder="Special instruction for pickup (eg. contact details)" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button type="submit" className="mt-4 block bg-green-600 text-white font-semibold w-1/2 mx-auto py-2 rounded-lg">Submit Donation</button>
                    <button type="submit" className="mt-4 block bg-gray-600 text-white font-semibold w-1/2 mx-auto py-2 rounded-lg">Reset Form</button>
                </div>
            </form>
        </div>
    )
}

export default NewDonation;