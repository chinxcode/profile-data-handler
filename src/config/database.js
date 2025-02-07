const mongoose = require("mongoose");
require("dotenv").config();

const username = encodeURIComponent(process.env.USER);
const password = encodeURIComponent(process.env.PASSWORD);
const cluster = process.env.CLUSTER;

// uri = "mongodb://localhost:27017/competition-data";
let uri = `mongodb+srv://${username}:${password}@${cluster}/compition-data?retryWrites=true&w=majority&appName=${username}`;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = { connectToDatabase };
