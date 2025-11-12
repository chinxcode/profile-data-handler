const User = require("../models/User");

// Get all students with optional filtering
exports.getAllStudents = async (req, res) => {
    try {
        const { year, isActive, page = 1, limit = 50 } = req.query;
        const filter = {};
        
        if (year) filter.year = parseInt(year);
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const students = await User.find(filter)
            .sort({ year: 1, name: 1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await User.countDocuments(filter);
        
        res.json({
            students,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a single student by username
exports.getStudentByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const student = await User.findOne({ username });
        
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        res.json(student);
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Create a new student
exports.createStudent = async (req, res) => {
    try {
        const { username, name, enrollment, year } = req.body;
        
        // Check if student already exists
        const existingStudent = await User.findOne({ username });
        if (existingStudent) {
            return res.status(409).json({ error: "Student with this username already exists" });
        }
        
        const student = new User({
            username,
            name,
            enrollment,
            year: year ? parseInt(year) : undefined,
            rank: 0,
            score: 0,
            totalQuestionsSolved: 0,
            easyQuestionsSolved: 0,
            mediumQuestionsSolved: 0,
            hardQuestionsSolved: 0,
            solvedQuestions: {}
        });
        
        await student.save();
        res.status(201).json({ message: "Student created successfully", student });
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update a student
exports.updateStudent = async (req, res) => {
    try {
        const { username } = req.params;
        const { name, enrollment, year, isActive } = req.body;
        
        const updateData = { updatedAt: Date.now() };
        if (name !== undefined) updateData.name = name;
        if (enrollment !== undefined) updateData.enrollment = enrollment;
        if (year !== undefined) updateData.year = parseInt(year);
        if (isActive !== undefined) updateData.isActive = isActive;
        
        const student = await User.findOneAndUpdate(
            { username },
            updateData,
            { new: true }
        );
        
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        res.json({ message: "Student updated successfully", student });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a student (soft delete by setting isActive to false)
exports.deleteStudent = async (req, res) => {
    try {
        const { username } = req.params;
        
        const student = await User.findOneAndUpdate(
            { username },
            { isActive: false, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        res.json({ message: "Student deactivated successfully", student });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Permanently delete a student (hard delete)
exports.permanentlyDeleteStudent = async (req, res) => {
    try {
        const { username } = req.params;
        
        const student = await User.findOneAndDelete({ username });
        
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        res.json({ message: "Student permanently deleted successfully" });
    } catch (error) {
        console.error("Error permanently deleting student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get students by year
exports.getStudentsByYear = async (req, res) => {
    try {
        const { year } = req.params;
        const students = await User.find({ year: parseInt(year), isActive: true })
            .sort({ score: -1, name: 1 });
        
        res.json(students);
    } catch (error) {
        console.error("Error fetching students by year:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Bulk import students
exports.bulkImportStudents = async (req, res) => {
    try {
        const { students } = req.body;
        
        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ error: "Students array is required" });
        }
        
        const results = {
            success: [],
            failed: []
        };
        
        for (const studentData of students) {
            try {
                const existingStudent = await User.findOne({ username: studentData.username });
                
                if (existingStudent) {
                    results.failed.push({
                        username: studentData.username,
                        reason: "Student already exists"
                    });
                    continue;
                }
                
                const student = new User({
                    username: studentData.username,
                    name: studentData.name,
                    enrollment: studentData.enrollment,
                    year: studentData.year ? parseInt(studentData.year) : undefined,
                    rank: 0,
                    score: 0,
                    totalQuestionsSolved: 0,
                    easyQuestionsSolved: 0,
                    mediumQuestionsSolved: 0,
                    hardQuestionsSolved: 0,
                    solvedQuestions: {}
                });
                
                await student.save();
                results.success.push(student.username);
            } catch (error) {
                results.failed.push({
                    username: studentData.username,
                    reason: error.message
                });
            }
        }
        
        res.status(201).json({
            message: "Bulk import completed",
            results
        });
    } catch (error) {
        console.error("Error in bulk import:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
