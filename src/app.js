require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const competitionRoutes = require("./routes/competitionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const eventRoutes = require("./routes/eventRoutes");
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
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});

app.use(limiter);

app.use(express.json());

connectToDatabase();

// API routes
app.use("/api", competitionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/events", eventRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
