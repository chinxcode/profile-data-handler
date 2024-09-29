require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const competitionRoutes = require("./routes/competitionRoutes");
const { connectToDatabase } = require("./config/database");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: "*",
    })
);

app.set("trust proxy", 1);
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 25,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});

app.use(limiter);

app.use(express.json());

connectToDatabase();

app.use("/api", competitionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
