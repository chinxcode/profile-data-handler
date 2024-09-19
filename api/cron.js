const { updateCompetitionData } = require("../src/controllers/competitionController");

module.exports = async (req, res) => {
    if (req.method === "POST") {
        try {
            await updateCompetitionData(req, res);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
