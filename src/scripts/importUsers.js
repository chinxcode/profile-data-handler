require("dotenv").config({ path: "../../.env" });
const fs = require("fs");
const csv = require("csv-parser");
const { connectToDatabase } = require("../config/database");
const User = require("../models/User");

const importUsers = async (filePath) => {
    try {
        console.log("Connecting to database...");
        await connectToDatabase();
        console.log("Connected to database successfully.");

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", async (row) => {
                try {
                    console.log(`Processing user: ${row.username}`);
                    const user = new User({
                        username: row.username,
                        name: row.name,
                        enrollment: row.enrollment,
                        year: parseInt(row.year),
                        rank: 0,
                        score: 0,
                        totalQuestionsSolved: 0,
                        easyQuestionsSolved: 0,
                        mediumQuestionsSolved: 0,
                        hardQuestionsSolved: 0,
                        solvedQuestions: {},
                    });

                    await user.save();
                    console.log(`User ${user.username} added successfully.`);
                } catch (error) {
                    console.error(`Error adding user ${row.username}:`, error.message);
                }
            })
            .on("end", () => {
                console.log("CSV file processing completed.");
                setTimeout(() => {
                    console.log("Exiting script...");
                    process.exit(0);
                }, 3000);
            });
    } catch (error) {
        console.error("Error in importUsers:", error.message);
        process.exit(1);
    }
};

const filePath = process.argv[2];

if (!filePath) {
    console.error("Please provide the path to the CSV file.");
    process.exit(1);
}

importUsers(filePath);

//CSV file format

// username,name,enrollment,year
// user1,John Doe,123456,1
// user2,Jane Smith,234567,2
// user3,Bob Johnson,345678,3

// Run scipt using command
// node src/scripts/importUsers.js path_to_csv_file.csv
