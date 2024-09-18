const express = require("express");
const router = express.Router();
const competitionController = require("../controllers/competitionController");

router.post("/update-competition-data", competitionController.updateCompetitionData);

module.exports = router;
