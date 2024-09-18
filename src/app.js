require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const competitionRoutes = require("./routes/competitionRoutes");
const { connectToDatabase } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectToDatabase();

app.use("/api", competitionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
