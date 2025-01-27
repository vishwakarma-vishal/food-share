const CollectionHistory = require("../models/CollectionHistory");
const FoodListing = require("../models/FoodListing");
const { z } = require("zod");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const DistributionHistory = require("../models/DistributionHistory");
const Ngo = require("../models/Ngo");
const DonationHistory = require("../models/DonationHistory");

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

        const foodListingInDb = await FoodListing.find({ status: "available" });

        if (foodListingInDb.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No food listings found, check after some time.",
                FoodListings: []
            });
        }

        const now = new Date();

        let expiredListings = foodListingInDb.filter((listing) => {
            return new Date(listing.expiry) < now;
        });

         // Update expired listings in the database
         if (expiredListings.length > 0) {
            // Mark them as expired
            await FoodListing.updateMany(
                { _id: { $in: expiredListings.map((listing) => listing._id) } },
                { $set: { status: "expired" } }
            );

            // Add to donation history
            const donationHistoryData = expiredListings.map((listing) => ({
                foodListingId: listing._id,
                restaurantId: listing.restaurantId
            }));
            await DonationHistory.insertMany(donationHistoryData);
        }

         // Respond with the available food listings
         res.status(200).json({
            success: true,
            FoodListings: foodListingInDb.filter((listing) => 
                new Date(listing.expiry) > now
            ),
        });
    } catch (err) {
        console.log(err);
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
        const collectionHistory = await CollectionHistory.find({ ngoId: ngoId })
            .populate({
                path: "foodListingId",
                select: "title category expiry status restaurantId",
                populate: {
                    path: "restaurantId",
                    select: "name"
                }
            });

        if (collectionHistory.length === 0) {
            return res.status(200).json({
                success: true,
                message: "You haven't collected any food yet.",
                collectionHistory: []
            });
        }

        res.status(200).json({
            success: true,
            message: "Collection history is fetched.",
            collectionHistory
        });
    } catch (err) {
        console.log(err);
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
            name: z.string()
                .trim()
                .min(3, "NGO Name must be at least 3 characters")
                .max(100, "NGO Name cannot exceed 100 characters"),
            about: z.string()
                .trim()
                .min(6, "About must be at least 6 characters")
                .max(100, "About cannot exceed 100 characters")
                .or(z.literal('')),
            foundingDate: z.string()
                .trim()
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Founding Date must be in YYYY-MM-DD format")
                .or(z.literal('')),
            city: z.string()
                .trim()
                .min(3, "City must be at least 3 characters")
                .max(50, "City cannot exceed 50 characters"),
            address: z.string()
                .trim()
                .min(3, "Address must be at least 3 characters")
                .max(200, "Address cannot exceed 200 characters"),
        });

        const sanitizedData = updateNgoProfileSchema.parse(data);

        // Set fields with empty strings to null
        Object.keys(sanitizedData).forEach(key => {
            if (sanitizedData[key] === "") {
                sanitizedData[key] = null;
            }
        });

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

        // creating safe user obj to send in response
        const userObject = updatedUserInDb.toObject();
        const { _id, role, password, __v, createdAt, ...safeUser } = userObject;

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            safeUser,
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

// Add food in distribution history
const addToDistributionHistory = async (req, res) => {
    try {
        const ngoId = req.ngoId;
        const { foodListingId, distributionNote } = req.body;

        const distribution = new DistributionHistory({
            ngoId,
            foodListingId,
            distributionNote
        });
        const { _id } = await distribution.save();

        if (!_id) {
            throw new Error("Failed to create distribution history.");
        }

        const foodListing = await FoodListing.findById(foodListingId);
        if (!foodListing) {
            throw new Error('Food listing not found');
        }

        const foodListingInDb = await FoodListing.findByIdAndUpdate(
            foodListingId,
            { $set: { status: 'distributed' } },
            { new: true }
        );

        if (!foodListingInDb) {
            await DistributionHistory.findByIdAndDelete(_id); // Remove the record added in Step 1
            throw new Error("Failed to update food listing status.");
        }

        // iff both operations succeed
        res.status(201).json({
            success: true,
            message: "Food is added to distribution history."
        });
    } catch (error) {
        console.error("Error in addToDistributionHistory:", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
        });
    }
};

// get distribution history
const getDistributionHistory = async (req, res) => {
    const ngoId = req.ngoId;

    try {
        const distributionHistory = await DistributionHistory.find({ ngoId: ngoId })
            .populate({
                path: "foodListingId",
                select: "title category expiry reservedAt restaurantId",
                populate: {
                    path: "restaurantId",
                    select: "name"
                }
            });

        if (distributionHistory.length === 0) {
            return res.status(200).json({
                success: true,
                message: "You haven't distributed any food yet.",
                distributionHistory: []
            });
        }

        res.status(200).json({
            success: true,
            distributionHistory
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}

// get use info
const getUserProfile = async (req, res) => {
    const ngoId = req.ngoId;

    try {
        const userInDb = await Ngo.findOne({ _id: ngoId });

        if (!userInDb) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const userObject = userInDb.toObject();
        const { createdAt, __v, password, ...safeUser } = userObject;

        res.status(200).json({
            success: true,
            message: "User information fetched successfully.",
            user: safeUser
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}


module.exports = { addListingToCollection, getCollectionHistory, getAllFoodListing, updateNgoProfile, addToDistributionHistory, getDistributionHistory, getUserProfile }