const mongoose = require('mongoose');

const URL = process.env.DB_URL;

const dbConnect = () => {
    mongoose.connect(URL)
        .then(() => {
            console.log("Connected to database.");
        })
        .catch((e) => {
            console.log(`Error while connecting to DB`, e);
        })
}

module.exports = dbConnect;