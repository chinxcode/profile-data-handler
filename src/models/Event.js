const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    startTime: { type: Number, required: true }, // Unix timestamp
    endTime: { type: Number, required: true }, // Unix timestamp
    years: [{ type: Number }], // Array of year values (e.g., [1, 2, 3, 4] for all undergraduate years)
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Add index for better query performance
eventSchema.index({ isActive: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model("Event", eventSchema);
