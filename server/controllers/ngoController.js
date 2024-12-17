const CollectionHistory = require("../models/CollectionHistory");
const FoodListing = require("../models/FoodListing");
const Ngo = require("../models/Ngo");
const { z } = require("zod");
const cloudinaryUpload = require("../utils/cloudinaryUpload");

// Reserve food
const addListingToCollection = async (req, res) => {
    const { FoodListingId } = req.body;
    const ngoId = req.ngoId;

    if (!FoodListingId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required information"
        });
    }

    try {
        const foodListingInDb = await FoodListing.findById(FoodListingId);

        if (!foodListingInDb) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            })
        }

        if (foodListingInDb.status == 'reserved') {
            return res.status(400).json({
                success: false,
                message: "Food is already reserved."
            })
        }

        const updatedFoodListing = {
            status: 'reserved',
            reservedBy: ngoId,
            reservedAt: new Date().toLocaleString()
        }

        const updatedFoodListingInDb = await FoodListing.findByIdAndUpdate(FoodListingId, { $set: updatedFoodListing }, { new: true });

        res.status(200).json({
            success: true,
            message: "Food is reserved."
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

// Get all food Listings
const getAllFoodListing = async (req, res) => {
    try {
        const foodListings = await FoodListing.find();

        if (!foodListings || foodListings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No food listings found.",
            });
        }

        res.status(200).json({
            success: true,
            FoodListings: foodListings
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}

// Get collected food
const getCollectionHistory = async (req, res) => {
    const ngoId = req.ngoId;

    try {
        const collectionHistory = await CollectionHistory.find({ ngoId: ngoId });

        if (!collectionHistory || collectionHistory.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Collection history not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Collection history is fetched.",
            collectionHistory
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}

// Update ngo profile
const updateNgoProfile = async (req, res) => {
    try {
        const file = req.files?.ngoImg;
        const ngoId = req.ngoId;

        if (!req.body.data) {
            return res.status(400).json({
                success: false,
                message: "Missing data in request body.",
            });
        }
        const data = JSON.parse(req.body.data);

        // Zod validation schema
        const updateNgoProfileSchema = z.object({
            ngoName: z.string()
                .trim()
                .min(3, "NGO Name must be at least 3 characters")
                .max(100, "NGO Name cannot exceed 100 characters")
                .optional(),
            about: z.string()
                .trim()
                .min(6, "About must be at least 6 characters")
                .max(100, "About cannot exceed 100 characters")
                .optional(),
            foundingDate: z.string()
                .trim()
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Founding Date must be in YYYY-MM-DD format")
                .optional(),
            city: z.string()
                .trim()
                .min(3, "City must be at least 3 characters")
                .max(50, "City cannot exceed 50 characters")
                .optional(),
            address: z.string()
                .trim()
                .min(3, "Address must be at least 3 characters")
                .max(200, "Address cannot exceed 200 characters")
                .optional(),
        });

        const sanitizedData = updateNgoProfileSchema.parse(data);

        const userInDb = await Ngo.findById(ngoId);
        if (!userInDb) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist.",
            });
        }

        // image upload
        let secure_url = userInDb.profileImg;
        let public_id = userInDb.imgPublicId;

        if (file) {
            const result = await cloudinaryUpload(file, "food-share/user/ngo", public_id); // function to upload img on cloudinary
            secure_url = result.secure_url;
            public_id = result.public_id;
        }

        // update data
        const updatedFields = {
            ...sanitizedData,
            profileImg: secure_url,
            imgPublicId: public_id
        };

        const updatedUserInDb = await Ngo.findByIdAndUpdate(
            ngoId,
            { $set: updatedFields },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            updatedUserInDb,
        });
    } catch (error) {
        // console.log("Error->", error);

        if (error instanceof z.ZodError) {
            console.log(error.errors.map((err) => err.message));
            return res.status(400).json({
                success: false,
                message: "Invalid input. Please ensure all fields are correctly filled.",
                errors: error.errors.map((err) => err.message),
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong.",
        });
    }
};

module.exports = { addListingToCollection, getCollectionHistory, getAllFoodListing, updateNgoProfile }