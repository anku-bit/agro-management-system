const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../db');
const { SECRET } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, phone, email, password, village, district, state, landAcres } = req.body;
  if (!name || !phone || !password) return res.status(400).json({ error: 'Name, phone and password required' });

  const db = readDB(req.app.locals.DB_FILE);
  if (db.farmers.find(f => f.phone === phone)) return res.status(409).json({ error: 'Phone already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const farmer = {
    id: uuidv4(),
    name, phone, email: email || '',
    password: hashed,
    village: village || '', district: district || '', state: state || '',
    landAcres: landAcres || 0,
    registeredAt: new Date().toISOString(),
    active: true
  };

  db.farmers.push(farmer);
  writeDB(req.app.locals.DB_FILE, db);

  const token = jwt.sign({ id: farmer.id, name: farmer.name, role: 'farmer' }, SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, farmer: { id: farmer.id, name: farmer.name, phone: farmer.phone } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  const db = readDB(req.app.locals.DB_FILE);
  const farmer = db.farmers.find(f => f.phone === phone);
  if (!farmer) return res.status(404).json({ error: 'Farmer not found' });

  const valid = await bcrypt.compare(password, farmer.password);
  if (!valid) return res.status(401).json({ error: 'Wrong password' });

  const token = jwt.sign({ id: farmer.id, name: farmer.name, role: 'farmer' }, SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, farmer: { id: farmer.id, name: farmer.name, phone: farmer.phone } });
});

// POST /api/auth/company-login (hardcoded company credentials)
router.post('/company-login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'agrosense@2024') {
    const token = jwt.sign({ id: 'company', name: 'AgroSense Company', role: 'company' }, SECRET, { expiresIn: '1d' });
    return res.json({ success: true, token });
  }
  res.status(401).json({ error: 'Invalid company credentials' });
});

module.exports = router;
