const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: String,
    enrollment: String,
    year: { type: Number, enum: [1, 2, 3] },
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
});

module.exports = mongoose.model("User", userSchema);
