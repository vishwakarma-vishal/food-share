const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes")
const listingRoutes = require("./routes/listingsRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cookieParser = require('cookie-parser');

dotenv.config(); //load env variables
const app = express();

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === "production" ? "https://food-share-app.netlify.app" : "http://localhost:5173",
    credentials: true,
}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

app.use('/auth', authRoutes);
app.use('/listing', listingRoutes);
app.use('/ngo', ngoRoutes);
app.use('/restaurant', restaurantRoutes);

const dbConnect = require("./config/database");
dbConnect();
require("./config/cloudinary");


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
