const express = require("express");
const dotenv = require("dotenv");
const app = express();

// middleware
dotenv.config(); //load env variables

const PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});