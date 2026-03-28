const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/crops/add
router.post('/add', authMiddleware, upload.single('photo'), (req, res) => {
  const { cropName, cropType, acres, sowingDate, harvestDate, healthStatus, notes, lat, lng } = req.body;
  if (!cropName || !cropType) return res.status(400).json({ error: 'Crop name and type required' });

  const db = readDB(req.app.locals.DB_FILE);
  const crop = {
    id: uuidv4(),
    farmerId: req.user.id,
    farmerName: req.user.name,
    cropName, cropType,
    acres: acres || 0,
    sowingDate: sowingDate || '',
    harvestDate: harvestDate || '',
    healthStatus: healthStatus || 'Good',
    notes: notes || '',
    photo: req.file ? `/uploads/${req.file.filename}` : null,
    location: { lat: lat || null, lng: lng || null },
    createdAt: new Date().toISOString()
  };

  db.crops.push(crop);
  writeDB(req.app.locals.DB_FILE, db);
  res.json({ success: true, crop });
});

// GET /api/crops/my
router.get('/my', authMiddleware, (req, res) => {
  const db = readDB(req.app.locals.DB_FILE);
  const crops = db.crops.filter(c => c.farmerId === req.user.id);
  res.json({ crops });
});

// DELETE /api/crops/:id
router.delete('/:id', authMiddleware, (req, res) => {
  const db = readDB(req.app.locals.DB_FILE);
  const idx = db.crops.findIndex(c => c.id === req.params.id && c.farmerId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Crop not found' });
  db.crops.splice(idx, 1);
  writeDB(req.app.locals.DB_FILE, db);
  res.json({ success: true });
});

module.exports = router;
