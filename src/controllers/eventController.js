const Event = require("../models/Event");
const { isValidObjectId } = require("../utils/sanitizer");

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const { isActive, page = 1, limit = 20 } = req.query;
        const filter = {};
        
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const events = await Event.find(filter)
            .sort({ startTime: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Event.countDocuments(filter);
        
        res.json({
            events,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid event ID format" });
        }
        
        const event = await Event.findById(id);
        
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        
        res.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get active events
exports.getActiveEvents = async (req, res) => {
    try {
        const currentTime = Date.now();
        const events = await Event.find({
            isActive: true,
            startTime: { $lte: currentTime },
            endTime: { $gte: currentTime }
        }).sort({ startTime: -1 });
        
        res.json(events);
    } catch (error) {
        console.error("Error fetching active events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { name, description, startTime, endTime, years, isActive } = req.body;
        
        // Validate that endTime is after startTime
        if (endTime <= startTime) {
            return res.status(400).json({ error: "End time must be after start time" });
        }
        
        const event = new Event({
            name,
            description,
            startTime: parseInt(startTime),
            endTime: parseInt(endTime),
            years: years || [],
            isActive: isActive !== undefined ? isActive : true
        });
        
        await event.save();
        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid event ID format" });
        }
        
        const { name, description, startTime, endTime, years, isActive } = req.body;
        
        const updateData = { updatedAt: Date.now() };
        
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (startTime !== undefined) updateData.startTime = parseInt(startTime);
        if (endTime !== undefined) updateData.endTime = parseInt(endTime);
        if (years !== undefined) updateData.years = years;
        if (isActive !== undefined) updateData.isActive = isActive;
        
        // Validate that endTime is after startTime if both are provided
        if (updateData.startTime && updateData.endTime && updateData.endTime <= updateData.startTime) {
            return res.status(400).json({ error: "End time must be after start time" });
        }
        
        const event = await Event.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        
        res.json({ message: "Event updated successfully", event });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete an event (soft delete)
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid event ID format" });
        }
        
        const event = await Event.findByIdAndUpdate(
            id,
            { isActive: false, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        
        res.json({ message: "Event deactivated successfully", event });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Permanently delete an event
exports.permanentlyDeleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid event ID format" });
        }
        
        const event = await Event.findByIdAndDelete(id);
        
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        
        res.json({ message: "Event permanently deleted successfully" });
    } catch (error) {
        console.error("Error permanently deleting event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
