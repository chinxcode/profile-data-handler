const axios = require("axios");

const updateCompetitionData = async () => {
    try {
        const response = await axios.post("http://localhost:3000/api/update-competition-data");
        console.log("Competition data updated successfully:", response.data);
    } catch (error) {
        console.error("Error updating competition data:", error.message);
    }
};

updateCompetitionData();
