const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: String,
    enrollment: String,
    year: { type: Number }, // Removed enum constraint to support any year value
    rank: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    totalQuestionsSolved: { type: Number, default: 0 },
    easyQuestionsSolved: { type: Number, default: 0 },
    mediumQuestionsSolved: { type: Number, default: 0 },
    hardQuestionsSolved: { type: Number, default: 0 },
    solvedQuestions: {
        type: Map,
        of: {
            title: String,
            slug: String,
            difficulty: String,
            status: String,
            language: String,
            timestamp: Number,
        },
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
userSchema.index({ year: 1, score: -1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model("User", userSchema);
