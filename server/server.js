const express = require("express");
const dotenv = require("dotenv");
const app = express();
const authRoutes = require("./routes/authRoutes")
const listingRoutes = require("./routes/listingsRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const fileUpload = require("express-fileupload");
const cors = require("cors");

// middleware
dotenv.config(); //load env variables
app.use(express.json());
app.use(cors());
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
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});