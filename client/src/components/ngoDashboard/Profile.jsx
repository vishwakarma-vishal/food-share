import React, { useState } from 'react'
import useAuth from '../../utils/useAuth';
import { FiUploadCloud } from "react-icons/fi";
import { toast } from "react-toastify";
import api from '../../utils/interceptors';

export const Profile = ({ setIsSelected, user, getUserData }) => {
  const [previewImg, setPreviewImg] = useState(user.profileImg || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // format date like 2025-01-01
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    email: user.email || "",
    city: user.city || "",
    address: user.address || "",
    about: user.about || "",
    foundingDate: user.foundingDate || ""
  });

  // manage form data state
  const handleChange = (e) => {
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

    // Create a copy of formData
    const dataToSend = { ...formData };

    // Format foundingDate to YYYY-MM-DD
    if (dataToSend.foundingDate) {
      dataToSend.foundingDate = formatDate(dataToSend.foundingDate);
    }

    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify(dataToSend));
    if (selectedFile) {
      formDataToSend.append('ngoImg', selectedFile);
    }

    try {
      setLoading(true);
      const response = await api({
        url: `${import.meta.env.VITE_API_URL}/ngo/profile`,
        method: "put",
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      const data = response.data;
      const updatedUser = data.safeUser;

      if (data.success) {
        toast.success("User updated sucessfully");
        getUserData();
        setLoading(false);
        setIsSelected("overview");
      }
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
      name: user.name || "",
      phone: user.phone || "",
      email: user.email || "",
      city: user.city || "",
      address: user.address || "",
      about: user.about || "",
      foundingDate: user.foundingDate || ""
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
                    onChange={handleChange}
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
              <label htmlFor="name">NGO Name</label><br />
              <input
                id="name"
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                placeholder="Enter your name..."
                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none"
                required />
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <label htmlFor="email">Email Address</label><br />
                <input
                  id="email"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="abc@gmail.com"
                  className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none cursor-not-allowed"
                  disabled />
              </div>
              <div className="w-full">
                <label htmlFor="phone">Contact Number</label><br />
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  value={formData.phone}
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
              <label htmlFor="foundingDate">Founding Date</label><br />
              <input
                id="foundingDate"
                type="date"
                name="foundingDate"
                onChange={handleChange}
                value={formData.foundingDate ? new Date(formData.foundingDate).toISOString().split('T')[0] : ''}
                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none"
              />
            </div>
            <div className="w-full">
              <label htmlFor="city">City</label><br />
              <input
                id="city"
                type="text"
                name="city"
                onChange={handleChange}
                value={formData.city}
                placeholder="Enter your city"
                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none"
                required />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <label htmlFor="address">Address</label><br />
              <textarea
                id="address"
                rows="3"
                name="address"
                onChange={handleChange}
                value={formData.address}
                placeholder="Enter address"
                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none"
                required />
            </div>
            <div className="w-full">
              <label htmlFor="about">Description/About</label><br />
              <textarea
                id="about"
                rows="3"
                name="about"
                onChange={handleChange}
                value={formData.about}
                placeholder="Enter description or about"
                className="border border-gray-500 w-full p-2 rounded-md my-2 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            className={`mt-4 block bg-gray-600 text-white font-semibold w-1/2 mx-auto py-2 rounded-lg ${loading && "cursor-not-allowed"}`}
            onClick={resetForm}
            disabled={loading}>
            Reset Form
          </button>
          <button
            type="submit"
            className={`mt-4 block bg-green-600 text-white font-semibold w-1/2 mx-auto py-2 rounded-lg
            ${loading && "cursor-not-allowed"}`}
            disabled={loading}>
            {loading ? "Updating..." : "Update changes"}
          </button>
        </div>
      </form>
    </div>
  )
}
