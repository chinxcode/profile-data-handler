const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { handleValidationErrors } = require("../middleware/validator");

// Get all events
router.get("/", eventController.getAllEvents);

// Get active events
router.get("/active", eventController.getActiveEvents);

// Get a single event
router.get("/:id", eventController.getEventById);

// Create a new event
router.post("/",
    handleValidationErrors([
        { field: 'name', required: true, type: 'string' },
        { field: 'startTime', required: true, type: 'number' },
        { field: 'endTime', required: true, type: 'number' },
        { field: 'description', required: false, type: 'string' },
        { field: 'years', required: false, type: 'array' }
    ]),
    eventController.createEvent
);

// Update an event
router.put("/:id", eventController.updateEvent);

// Soft delete an event
router.delete("/:id", eventController.deleteEvent);

// Hard delete an event
router.delete("/:id/permanent", eventController.permanentlyDeleteEvent);

module.exports = router;
