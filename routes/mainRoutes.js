// backend/routes/mainRoutes.js

const express = require('express');
const Route = require('../models/Route'); // Ensure this path is correct
const router = express.Router();

// --- ROUTE ORDER: MOST SPECIFIC TO LEAST SPECIFIC ---

// 1. Specific Search Route
// Handles GET /api/routes/search
router.get('/search', async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) return res.json([]);
        const query = { $or: [ { routeNumber: { $regex: search, $options: 'i' } }, { from: { $regex: search, $options: 'i' } }, { to: { $regex: search, $options: 'i' } }, { routeName: { $regex: search, $options: 'i' } } ] };
        const routes = await Route.find(query).limit(10);
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Error searching for routes' });
    }
});

// 2. General Routes for the collection (GET all, POST new)

// Handles GET /api/routes
router.get('/', async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching all routes.' });
    }
});

// Handles POST /api/routes
router.post('/', async (req, res) => {
    try {
        const newRoute = new Route(req.body);
        await newRoute.save();
        res.status(201).json(newRoute);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating the route.', error: error.message });
    }
});


// 3. Routes for a specific item by ID (MUST COME LAST)

// --- THIS IS THE NEW, MISSING ROUTE HANDLER ---
// Handles GET /api/routes/:id
router.get('/:id', async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) return res.status(404).json({ message: 'Route not found' });
        res.json(route);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching the route.', error: error.message });
    }
});


// Handles PUT /api/routes/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedRoute = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedRoute) return res.status(404).json({ message: 'Route not found' });
        res.json(updatedRoute);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating the route.', error: error.message });
    }
});

// Handles DELETE /api/routes/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedRoute = await Route.findByIdAndDelete(req.params.id);
        if (!deletedRoute) return res.status(404).json({ message: 'Route not found' });
        res.json({ message: 'Route deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting the route.' });
    }
});

module.exports = router;
