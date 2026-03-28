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

// POST /api/residue/add
router.post('/add', authMiddleware, upload.single('photo'), (req, res) => {
  const { residueType, cropSource, quantity, unit, availableFrom, price, priceUnit, description, lat, lng } = req.body;
  if (!residueType || !quantity) return res.status(400).json({ error: 'Residue type and quantity required' });

  const db = readDB(req.app.locals.DB_FILE);
  const residue = {
    id: uuidv4(),
    farmerId: req.user.id,
    farmerName: req.user.name,
    residueType,
    cropSource: cropSource || '',
    quantity: quantity || 0,
    unit: unit || 'tons',
    availableFrom: availableFrom || '',
    price: price || 0,
    priceUnit: priceUnit || 'per ton',
    description: description || '',
    photo: req.file ? `/uploads/${req.file.filename}` : null,
    location: { lat: lat || null, lng: lng || null },
    status: 'available',
    createdAt: new Date().toISOString()
  };

  db.residues.push(residue);
  writeDB(req.app.locals.DB_FILE, db);
  res.json({ success: true, residue });
});

// GET /api/residue/my
router.get('/my', authMiddleware, (req, res) => {
  const db = readDB(req.app.locals.DB_FILE);
  const residues = db.residues.filter(r => r.farmerId === req.user.id);
  res.json({ residues });
});

// DELETE /api/residue/:id
router.delete('/:id', authMiddleware, (req, res) => {
  const db = readDB(req.app.locals.DB_FILE);
  const idx = db.residues.findIndex(r => r.id === req.params.id && r.farmerId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Residue not found' });
  db.residues.splice(idx, 1);
  writeDB(req.app.locals.DB_FILE, db);
  res.json({ success: true });
});

module.exports = router;
