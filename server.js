// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- 1. DEFINE THE FINAL, SIMPLIFIED SCHEMA ---
// The electric bus parameters have been completely removed.
const routeSchema = new mongoose.Schema({
    routeNumber: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    routeName: { type: String, required: true },
    upregularKm: { type: Number, default: 0 },
    downregularKm: { type: Number, default: 0 },
    uptimePerKm: { type: Number, default: 0 },
    downtimePerKm: { type: Number, default: 0 },
    busType: { type: String, required: true, default: 'Regular' },
    turnoutFromDepot: { type: Boolean, default: false },
    firstStop: { type: String, default: '' },
    upTurnoutKm: { type: Number, default: 0 },
    downTurnoutKm: { type: Number, default: 0 }
});

const Route = mongoose.model('Route', routeSchema);

// --- 2. SETUP THE EXPRESS APPLICATION ---
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = "mongodb+srv://poojakarande06:bus1234@cluster0.4dmcubr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// --- 3. CONFIGURE MIDDLEWARE ---
const whitelist = [ 'http://localhost:3000', 'https://bus-planner-frontend-seven.vercel.app' ];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) { callback(null, true); }
        else { callback(new Error('Not allowed by CORS')); }
    }
};
app.use(cors(corsOptions));
app.use(express.json());


// --- 4. DEFINE ALL API ROUTES (These routes are now simpler) ---
app.post('/api/routes', async (req, res) => { try { const newRoute = new Route(req.body); await newRoute.save(); res.status(201).json(newRoute); } catch (error) { res.status(400).json({ message: "Data validation failed.", error: error.message }); } });
app.get('/api/routes/search/:routeNumber', async (req, res) => { try { const route = await Route.findOne({ routeNumber: req.params.routeNumber, busType: 'Electric' }); if (!route) { return res.status(404).json({ message: `No ELECTRIC route found with number '${req.params.routeNumber}'` }); } res.json(route); } catch (error) { res.status(500).json({ message: 'Server error during search.' }); } });
app.get('/api/routes/:id', async (req, res) => { try { const route = await Route.findById(req.params.id); if (!route) return res.status(404).json({ message: 'Route not found' }); res.json(route); } catch (error) { if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Route not found' }); res.status(500).json({ message: 'Server error' }); } });
app.get('/api/routes', async (req, res) => { try { const routes = await Route.find(); res.json(routes); } catch (error) { res.status(500).json({ message: 'Server error' }); } });
app.put('/api/routes/:id', async (req, res) => { try { const updatedRoute = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!updatedRoute) return res.status(404).json({ message: 'Route not found' }); res.json(updatedRoute); } catch (error) { res.status(400).json({ message: "Data validation failed", error: error.message }); } });
app.delete('/api/routes/:id', async (req, res) => { try { await Route.findByIdAndDelete(req.params.id); res.json({ message: 'Route deleted' }); } catch (error) { res.status(500).json({ message: 'Server error' }); } });


// --- 5. CONNECT TO DATABASE AND START THE SERVER ---
mongoose.connect(MONGO_URI)
    .then(() => { console.log("✅ Successfully connected to MongoDB Atlas."); app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`)); })
    .catch(err => { console.error("❌ Database connection error:", err); process.exit(1); });
