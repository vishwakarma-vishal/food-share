import React, { useState } from 'react'
import useAuth from '../../utils/useAuth';
import { FiUploadCloud } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { auth, updateUser } = useAuth();
  const user = auth.safeUser;
  const [previewImg, setPreviewImg] = useState(user.profileImg);

  const [formData, setFormData] = useState({
    restaurantName: user.restaurantName || '',
    openFrom: user.openFrom || '',
    openTill: user.openTill || '',
    city: user.city || '',
    address: user.address || '',
    about: user.about || ''
  });

  const changeHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  // convert time to 24 hour format
  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');

    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }

  // submit funtion
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      openFrom: convertTo24HourFormat(formData.openFrom),
      openTill: convertTo24HourFormat(formData.openTill)
    }

    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify(dataToSend));

    try {
      const response = await axios({
        url: "http://localhost:3001/restaurant/profile",
        method: "put",
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = response.data;
      const updatedUser = data.safeUser;

      if (data.success) {
        toast.success("User updated sucessfully");
        updateUser(updatedUser);
      }

    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  // reset form
  const resetForm = (e) => {
    e.preventDefault();

    setFormData({
      restaurantName: user.restaurantName || '',
      openFrom: user.openFrom || '',
      openTill: user.openTill || '',
      city: user.city || '',
      address: user.address || '',
      description: user.description || ''
    })
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg">
      <h2 className="font-semibold text-2xl">Edit your profile</h2>

      <form className="mt-6 text-sm" onSubmit={handleSubmit}>
        {/* first row */}
        <div className="flex gap-6">
          {/* image */}
          <div className="basis-5/12 w-full h-[200] bg-gray-300 rounded-lg">
            {
              previewImg ?
                <div className="relative">
                  <img src={previewImg} className="rounded-lg"></img>
                  <button className="absolute top-2 -left-1 text-xs bg-green-600 text-white p-1 rounded-sm" onClick={() => setPreviewImg("")}>Upload new img</button>
                </div> :
                <div className="flex justify-center items-center h-full">
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={changeHandler}
                  />
                  <label htmlFor="fileInput" className="w-full h-full flex flex-col justify-center items-center cursor-pointer text-gray-800 rounded-md text-center">
                    <FiUploadCloud className="text-3xl" />
                    <span className="text-xs">Upload new image</span>
                  </label>
                </div>
            }
          </div>

          {/* name, email, phone */}
          <div className="flex-grow w-full">
            <div>
              <label htmlFor="name">Restaurant Name</label><br />
              <input
                id="name"
                name="restaurantName"
                type="text"
                value={formData.restaurantName}
                onChange={changeHandler}
                minLength={3}
                maxLength={100}
                placeholder="Enter your restaurant name..."
                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <label htmlFor="email">Email Address</label><br />
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  placeholder="abc@gmail.com"
                  className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none cursor-not-allowed"
                  disabled />
              </div>
              <div className="w-full">
                <label htmlFor="phone">Contact Number</label><br />
                <input
                  id="phone"
                  type="text"
                  value={user.phone}
                  placeholder="12345678890"
                  className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none cursor-not-allowed"
                  disabled />
              </div>
            </div>
          </div>
        </div>

        {/* second row */}
        <div className="mt-4">
          <div className="flex gap-4">
            <div className="w-full">
              <label >Opening Hours (start - end)</label><br />
              <div className="flex gap-4 items-center">
                <input
                  id="openFrom"
                  name="openFrom"
                  type="time"
                  value={formData.openFrom}
                  onChange={changeHandler}
                  className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
                to
                <input
                  id="openTill"
                  name="openTill"
                  type="time"
                  value={formData.openTill}
                  onChange={changeHandler}
                  className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="city">City</label><br />
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={changeHandler}
                minLength={3}
                maxLength={20}
                placeholder="Enter your city"
                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <label htmlFor="address">Address</label><br />
              <textarea
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={changeHandler}
                minLength={3}
                maxLength={200}
                placeholder="Enter restaurant address"
                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
            </div>
            <div className="w-full">
              <label htmlFor="about">Description/About</label><br />
              <textarea
                id="about"
                name="about"
                rows="3"
                value={formData.about}
                onChange={changeHandler}
                minLength={6}
                maxLength={100}
                placeholder="Enter description or about"
                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="mt-4 block bg-gray-600 text-white font-semibold w-1/2 mx-auto py-2 rounded-lg" onClick={resetForm}>Reset Form</button>
          <button type="submit" className="mt-4 block bg-green-600 text-white font-semibold w-1/2 mx-auto py-2 rounded-lg">Save changes</button>
        </div>
      </form >
    </div >
  )
}

export default Profile;