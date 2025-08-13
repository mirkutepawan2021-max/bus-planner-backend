import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

import { connectDB } from './config/db';
import { Route } from './models/Route';

// This is the line that creates the 'app'. It must come first.
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Endpoints ---

// GET (search) all routes by name OR number
// Replace the existing GET endpoint in src/index.ts with this

// GET (search) all routes by number, name, from, or to
app.get('/api/routes', async (req, res) => {
  try {
    const searchQuery = req.query.search as string;
    let routes;
    if (searchQuery) {
      // UPDATED LOGIC: Added 'from' and 'to' to the search
      routes = await Route.find({
        $or: [
          { routeName: { $regex: searchQuery, $options: 'i' } },
          { routeNumber: { $regex: searchQuery, $options: 'i' } },
          { from: { $regex: searchQuery, $options: 'i' } }, // <-- ADDED
          { to: { $regex: searchQuery, $options: 'i' } }      // <-- ADDED
        ]
      }).limit(10);
    } else {
      // If no query, return all routes sorted by number
      routes = await Route.find().sort({ routeNumber: 1 });
    }
    
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routes', error });
  }
});


// POST (create) a new route
app.post('/api/routes', async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    res.status(400).json({ message: 'Error creating route', error });
  }
});

// --- Start the Server ---
const PORT = process.env.PORT || 4000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
  });
})();
