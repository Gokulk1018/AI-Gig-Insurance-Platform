import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Disruption } from './models/Disruption.js';
import { User } from './models/User.js';
import { Zone } from './models/Zone.js';
import { Shift } from './models/Shift.js';
import { Claim } from './models/Claim.js';
import { handleDisruption } from './engine/trigger.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// --- Sovereign Admin APIs ---

// Stats & Pulse
app.get('/api/admin/stats', async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      activeShifts: await Shift.countDocuments({ isActive: true }),
      claims: await Claim.countDocuments(),
      zones: await Zone.countDocuments()
    };
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// User Management (CRUD)
app.get('/api/admin/users', async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

app.post('/api/admin/users', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.put('/api/admin/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.body._id || req.params.id, req.body, { new: true });
  res.json(user);
});

app.delete('/api/admin/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Zone Management
app.get('/api/admin/zones', async (req, res) => {
  const zones = await Zone.find();
  res.json(zones);
});

app.post('/api/admin/zones', async (req, res) => {
  const zone = await Zone.create(req.body);
  res.json(zone);
});

app.delete('/api/admin/zones/:id', async (req, res) => {
  await Zone.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Claim Management & Registry
app.get('/api/admin/claims', async (req, res) => {
  const claims = await Claim.find().populate('userId').sort({ createdAt: -1 });
  res.json(claims);
});

app.patch('/api/admin/claims/:id', async (req, res) => {
  const claim = await Claim.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(claim);
});

// Shift tracking & overrides
app.get('/api/admin/shifts', async (req, res) => {
  const shifts = await Shift.find().populate('userId').populate('zoneId');
  res.json(shifts);
});

app.post('/api/rider/shift/toggle', async (req, res) => {
  const { phone, goOnline } = req.body;
  const user = await User.findOne({ phone });
  if (!user) return res.status(404).json({ error: 'Rider not found' });
  
  let shift = await Shift.findOne({ userId: user._id });
  if (!shift) {
    shift = await Shift.create({ userId: user._id, isActive: goOnline, zoneId: user.primaryZoneId });
  } else {
    shift.isActive = goOnline;
    await shift.save();
  }
  res.json(shift);
});

// --- Legacy Demo Endpoints (Restored) ---

app.post('/api/admin/demo/trigger-rain', async (req, res) => {
  const { zoneId } = req.body;
  const disruption = await Disruption.create({ zoneId, type: 'HEAVY_RAIN', status: 'ACTIVE', severityIndex: 3 });
  const claims = await handleDisruption(disruption, io);
  res.json({ message: 'Storm triggered', disruption, claimsGenerated: claims.length });
});

app.post('/api/admin/demo/seed', async (req, res) => {
  await Zone.deleteMany({}); await User.deleteMany({}); await Shift.deleteMany({}); await Claim.deleteMany({});
  const zone = await Zone.create({ name: 'HSR Layout', city: 'Bengaluru', location: { type: 'Polygon', coordinates: [[[0,0], [0,1], [1,1], [1,0], [0,0]]] } });
  const user = await User.create({ phone: '+919876543210', avgHourlyEarnings: 120, primaryZoneId: zone._id, subscription: { status: 'ACTIVE', planTier: 'PLUS', weeklyCap: 1500, amountUsed: 0 } });
  await Shift.create({ userId: user._id, zoneId: zone._id, isActive: true });
  res.json({ message: 'Seeded successfully', zone, user });
});

io.on('connection', (socket) => {
  socket.on('join_zone', (zoneId) => socket.join(zoneId));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 ShiftShield Cortex active on port ${PORT}`));
