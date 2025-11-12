const express = require("express");
const router = express.Router();
const competitionController = require("../controllers/competitionController");

// Legacy endpoints (maintained for backward compatibility)
router.get("/update-competition-data", competitionController.updateCompetitionData);
router.get("/leaderboard-data", competitionController.getLeaderboard);

// New event-based endpoints
router.post("/events/:eventId/update-data", competitionController.updateCompetitionDataByEvent);
router.get("/events/:eventId/leaderboard", competitionController.getLeaderboardByEvent);

module.exports = router;
