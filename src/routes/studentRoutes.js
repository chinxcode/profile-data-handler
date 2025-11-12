const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { handleValidationErrors } = require("../middleware/validator");

// Get all students
router.get("/", studentController.getAllStudents);

// Get students by year
router.get("/year/:year", studentController.getStudentsByYear);

// Get a single student
router.get("/:username", studentController.getStudentByUsername);

// Create a new student
router.post("/", 
    handleValidationErrors([
        { field: 'username', required: true, type: 'string' },
        { field: 'name', required: false, type: 'string' },
        { field: 'enrollment', required: false, type: 'string' },
        { field: 'year', required: false, type: 'number' }
    ]),
    studentController.createStudent
);

// Bulk import students
router.post("/bulk-import", studentController.bulkImportStudents);

// Update a student
router.put("/:username", studentController.updateStudent);

// Soft delete a student
router.delete("/:username", studentController.deleteStudent);

// Hard delete a student
router.delete("/:username/permanent", studentController.permanentlyDeleteStudent);

module.exports = router;
