const axios = require("axios");
const fetch = require("node-fetch");

exports.fetchLeetcodeData = async (usernames) => {
    try {
        const response = await axios.post(process.env.LEETSCAN_API_URL, { usernames });
        return response.data;
    } catch (error) {
        console.error("Error fetching LeetCode data:", error);
        throw error;
    }
};

const QuestionCache = require("../models/QuestionCache");

exports.fetchQuestionDifficulty = async (titleSlug) => {
    let cachedQuestion = await QuestionCache.findOne({ titleSlug });

    if (cachedQuestion) {
        return cachedQuestion.difficulty;
    }

    const difficulty = await fetchFromLeetCodeAPI(titleSlug);

    await QuestionCache.create({ titleSlug, difficulty });

    return difficulty;
};

async function fetchFromLeetCodeAPI(titleSlug) {
    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              difficulty
            }
          }
        `,
                variables: {
                    titleSlug: titleSlug,
                },
            }),
        });
        const data = await response.json();
        return data.data.question.difficulty;
    } catch (error) {
        console.error("Error fetching question difficulty:", error);
        throw error;
    }
}
