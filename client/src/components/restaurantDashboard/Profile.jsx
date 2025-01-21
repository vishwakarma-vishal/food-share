import React, { useState } from 'react'
import useAuth from '../../utils/useAuth';
import { FiUploadCloud } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = ({setIsSelected, user, getUserData}) => {
  const [previewImg, setPreviewImg] = useState(user.profileImg || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || '',
    openFrom: user.openFrom || '',
    openTill: user.openTill || '',
    city: user.city || '',
    address: user.address || '',
    about: user.about || ''
  });

  // to prepare formData
  const changeHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    if (e.target.type === 'file') {
      const file = e.target.files[0];
      setSelectedFile(file);
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

  // submit funtion
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify(formData));
    if (selectedFile) {
      formDataToSend.append('restaurantImg', selectedFile);
    }

    try {
      setLoading(true);
      const response = await axios({
        url: `${import.meta.env.VITE_API_URL}/restaurant/profile`,
        method: "put",
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      const data = response.data;

      if (data.success) {
        toast.success("User updated sucessfully");
        getUserData();
        setIsSelected("overview");
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
      toast.error("Something went wrong");
    }
  }

  // reset form
  const resetForm = (e) => {
    e.preventDefault();

    setFormData({
      name: user.name || '',
      openFrom: user.openFrom || '',
      openTill: user.openTill || '',
      city: user.city || '',
      address: user.address || '',
      about: user.about || ''
    });
    setPreviewImg(user.profileImg);
    setSelectedFile(null);
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg">
      <h2 className="font-semibold text-2xl">Edit your profile</h2>

      <form className="mt-6 text-sm" onSubmit={handleSubmit}>
        {/* first row */}
        <div className="flex gap-6">
          {/* image */}
          <div className="basis-6/12 w-full h-[180px] rounded-lg"> 
            {
              previewImg ?
                <div className="relative h-full">
                  <img src={previewImg} className="rounded-lg h-full w-full border"></img>
                  <button
                    type="button"
                    className="absolute top-2 -left-1 text-xs bg-green-600 text-white p-1 rounded-sm"
                    onClick={() => setPreviewImg("")}>
                    Upload new img
                  </button>
                </div> :
                <div className="flex justify-center items-center h-full">
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={changeHandler}
                  />
                  <label htmlFor="fileInput" className="w-full h-full flex flex-col justify-center items-center cursor-pointer text-gray-800 rounded-md text-center border bg-gray-200">
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
                name="name"
                type="text"
                value={formData.name}
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
          <button className="mt-4 block bg-gray-600 text-white font-semibold w-1/2 mx-auto py-2 rounded-lg" onClick={resetForm} disabled={loading}>Reset Form</button>
          <button type="submit" className="mt-4 block bg-green-600 text-white font-semibold w-1/2 mx-auto py-2 rounded-lg" disabled={loading}>{loading ? "Updating..." : "Update changes"}</button>
        </div>
      </form >
    </div >
  )
}

export default Profile;