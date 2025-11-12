const userService = require("../services/userService");
const leetcodeService = require("../services/leetcodeService");
const Event = require("../models/Event");
const { isValidObjectId } = require("../utils/sanitizer");

const BATCH_SIZE = 30;

// Update competition data for a specific event
exports.updateCompetitionDataByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        
        if (!isValidObjectId(eventId)) {
            return res.status(400).json({ error: "Invalid event ID format" });
        }
        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        
        if (!event.isActive) {
            return res.status(400).json({ error: "Event is not active" });
        }
        
        const users = await userService.getAllUsers();
        const usernames = users.map((user) => user.username);

        for (let i = 0; i < usernames.length; i += BATCH_SIZE) {
            const batch = usernames.slice(i, i + BATCH_SIZE);
            const leetcodeData = await leetcodeService.fetchLeetcodeData(batch);

            await Promise.all(
                leetcodeData.map((userData) => 
                    userService.updateUserDataForEvent(userData, event)
                )
            );
        }

        res.status(200).json({ message: "Competition data updated successfully for event", event: event.name });
    } catch (error) {
        console.error("Error updating competition data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update competition data (legacy endpoint using environment variables)
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

// Get leaderboard for a specific event
exports.getLeaderboardByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { year } = req.query;
        
        if (!isValidObjectId(eventId)) {
            return res.status(400).json({ error: "Invalid event ID format" });
        }
        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        
        let filter = { isActive: true };
        
        // Filter by year if provided
        if (year) {
            filter.year = parseInt(year);
        } else if (event.years && event.years.length > 0) {
            // Use event's year filter if no specific year is requested
            filter.year = { $in: event.years };
        }
        
        const users = await userService.getUsersByFilter(filter);
        res.json({
            event: event.name,
            leaderboard: users
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get leaderboard (legacy endpoint)
exports.getLeaderboard = async (req, res) => {
    try {
        const { year } = req.query;
        const filter = {};
        
        if (year) {
            filter.year = parseInt(year);
        }
        
        const users = await userService.getUsersByFilter(filter);
        res.json(users);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
