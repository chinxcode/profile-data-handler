const User = require("../models/User");
const leetcodeService = require("./leetcodeService");
const { calculateScore } = require("../utils/helpers");

exports.getAllUsers = async () => {
    return User.find();
};

exports.updateUserData = async (userData) => {
    const user = await User.findOne({ username: userData.username });
    if (!user) return;

    const competitionStartTime = parseInt(process.env.COMPETITION_START_TIME);
    const competitionEndTime = parseInt(process.env.COMPETITION_END_TIME);
    const newSolvedQuestions = {};

    const submissionsToProcess = userData.profile.recentSubmissions.filter(
        (submission) =>
            submission.statusDisplay === "Accepted" &&
            submission.timestamp > competitionStartTime &&
            submission.timestamp <= competitionEndTime
    );

    const difficultiesPromises = submissionsToProcess.map((submission) => leetcodeService.fetchQuestionDifficulty(submission.titleSlug));

    const difficulties = await Promise.all(difficultiesPromises);

    submissionsToProcess.forEach((submission, index) => {
        if (!user.solvedQuestions.has(submission.titleSlug)) {
            newSolvedQuestions[submission.titleSlug] = {
                title: submission.title,
                slug: submission.titleSlug,
                difficulty: difficulties[index],
                status: "solved",
                language: submission.lang,
                timestamp: submission.timestamp,
            };
        }
    });
    const existingSolvedQuestions = {};
    user.solvedQuestions.forEach((value, key) => {
        existingSolvedQuestions[key] = {
            title: value.title,
            slug: value.slug,
            difficulty: value.difficulty,
            status: value.status,
            language: value.language,
            timestamp: value.timestamp,
        };
    });

    const updatedSolvedQuestions = { ...existingSolvedQuestions, ...newSolvedQuestions };

    const totalQuestionsSolved = Object.keys(updatedSolvedQuestions).length;
    const easyQuestionsSolved = Object.values(updatedSolvedQuestions).filter((q) => q.difficulty === "Easy").length;
    const mediumQuestionsSolved = Object.values(updatedSolvedQuestions).filter((q) => q.difficulty === "Medium").length;
    const hardQuestionsSolved = Object.values(updatedSolvedQuestions).filter((q) => q.difficulty === "Hard").length;

    const score = calculateScore(easyQuestionsSolved, mediumQuestionsSolved, hardQuestionsSolved);

    const sanitizedSolvedQuestions = {};
    for (const [key, value] of Object.entries(updatedSolvedQuestions)) {
        if (!key.startsWith("$")) {
            sanitizedSolvedQuestions[key] = value;
        }
    }

    const updatedUser = await User.findOneAndUpdate(
        { username: userData.username },
        {
            solvedQuestions: sanitizedSolvedQuestions,
            totalQuestionsSolved,
            easyQuestionsSolved,
            mediumQuestionsSolved,
            hardQuestionsSolved,
            score,
        },
        { new: true }
    );
    await updateRanks(updatedUser.year);
};

async function updateRanks(year) {
    const usersInYear = await User.find({ year }).sort({ score: -1 });

    let currentRank = 1;
    let currentScore = null;
    let skipCount = 0;

    for (let i = 0; i < usersInYear.length; i++) {
        const user = usersInYear[i];

        if (user.score === 0) {
            continue;
        }

        if (user.score !== currentScore) {
            currentRank += skipCount;
            currentScore = user.score;
            skipCount = 0;
        }

        await User.findByIdAndUpdate(user._id, { rank: currentRank });
        skipCount++;
    }
}
