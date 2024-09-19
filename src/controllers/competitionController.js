const userService = require("../services/userService");
const leetcodeService = require("../services/leetcodeService");

const BATCH_SIZE = 30;

exports.updateCompetitionData = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        const usernames = users.map((user) => user.username);

        for (let i = 0; i < usernames.length; i += BATCH_SIZE) {
            const batch = usernames.slice(i, i + BATCH_SIZE);
            const leetcodeData = await leetcodeService.fetchLeetcodeData(batch);

            await Promise.all(leetcodeData.map((userData) => userService.updateUserData(userData)));
        }

        res.status(200).json({ message: "Competition data updated successfully" });
    } catch (error) {
        console.error("Error updating competition data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || 1;
        const users = await userService.getUsersByYear(year);
        res.json(users);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
