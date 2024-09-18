const mongoose = require("mongoose");

const questionCacheSchema = new mongoose.Schema({
    titleSlug: { type: String, required: true, unique: true },
    difficulty: { type: String, required: true },
});

module.exports = mongoose.model("QuestionCache", questionCacheSchema);
