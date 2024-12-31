import React, { useState } from 'react'

export const Profile = () => {
  const [previewImg, setPreviewImg] = useState("");

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg">
      <h2 className="font-semibold text-2xl">Edit your profile</h2>

      <form className="mt-6 text-sm">
        {/* first row */}
        <div className="flex gap-6">
          {/* image */}
          {
            previewImg == "" ?
              <div className="basis-5/12 w-full h-[160px] bg-gray-300 rounded-lg"></div> :
              <input type="image" className="basis-5/12 w-full"></input>
          }

          {/* name, email, phone */}
          <div className="flex-grow w-full">
            <div>
              <label htmlFor="name">NGO Name</label><br />
              <input id="name" type="text" placeholder="Enter your name..." className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <label htmlFor="email">Email Address</label><br />
                <input id="email" type="email" placeholder="abc@gmail.com" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
              </div>
              <div className="w-full">
                <label htmlFor="phone">Contact Number</label><br />
                <input id="phone" type="text" placeholder="12345678890" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* second row */}
        <div className="mt-4">
          <div className="flex gap-4">
            <div className="w-full">
              <label htmlFor="foundingDate">Founding Date</label><br />
              <input id="foundingDate" type="date" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
            </div>
            <div className="w-full">
              <label htmlFor="city">City</label><br />
              <input id="city" type="text" placeholder="Enter your city" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <label htmlFor="address">Address</label><br />
              <textarea id="address" rows="3" placeholder="Enter address" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
            </div>
            <div className="w-full">
              <label htmlFor="description">Description/About</label><br />
              <textarea id="description" rows="3" placeholder="Enter description or about" className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
            </div>
          </div>
        </div>

        <button type="submit" className="mt-4 block bg-green-600 text-white font-semibold w-1/2 mx-auto py-2 rounded-lg">Save changes</button>
      </form>
    </div>
  )
}
