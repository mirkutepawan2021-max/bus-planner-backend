// backend/routes/routeCrud.js

const express = require('express');
const Route = require('../models/Route'); // Ensure this path is correct
const router = express.Router();

// --- DEBUGGING CHECKPOINT ---
console.log("✅ routeCrud.js file has been loaded by the server.");

// GET: Get all routes
router.get('/', async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching routes.' });
    }
});

// POST: Create a new route
router.post('/', async (req, res) => {
    try {
        const newRoute = new Route(req.body);
        await newRoute.save();
        res.status(201).json(newRoute);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating the route.', error: error.message });
    }
});

// --- THE DEFINITIVE PUT ROUTE HANDLER ---
// This handles the update request for a specific ID.
router.put('/:id', async (req, res) => {
    // --- DEBUGGING CHECKPOINT ---
    console.log(`✅ PUT request received for route ID: ${req.params.id}`);
    
    try {
        const updatedRoute = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedRoute) {
            console.error(`❌ Route with ID ${req.params.id} not found in the database.`);
            return res.status(404).json({ message: 'Route not found in database' });
        }
        console.log("✅ Route updated successfully:", updatedRoute);
        res.json(updatedRoute);
    } catch (error) {
        console.error("❌ Error during route update:", error);
        res.status(500).json({ message: 'Server error while updating the route.', error: error.message });
    }
});

// DELETE: Delete a route by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRoute = await Route.findByIdAndDelete(req.params.id);
        if (!deletedRoute) {
            return res.status(404).json({ message: 'Route not found' });
        }
        res.json({ message: 'Route deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting the route.' });
    }
});

module.exports = router;
