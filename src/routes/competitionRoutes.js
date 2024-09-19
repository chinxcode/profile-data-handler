const express = require("express");
const router = express.Router();
const competitionController = require("../controllers/competitionController");

router.get("/update-competition-data", competitionController.updateCompetitionData);

router.get("/leaderboard", competitionController.getLeaderboard);

module.exports = router;
