const cloudinary = require('cloudinary').v2;

const cloudinaryUpload = async function (file, folder, oldPublicId) {
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error("Only JPEG, PNG, and JPG formats are allowed.");
    }

    // Delete old image if exists
    if (oldPublicId) {
        const deleteResult = await cloudinary.uploader.destroy(oldPublicId);
        console.log("Delete Result:", deleteResult);
    }

    const options = {
        unique_filename: true,
        overwrite: false,
        folder
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return { secure_url: result.secure_url, public_id: result.public_id }
}

module.exports = cloudinaryUpload;