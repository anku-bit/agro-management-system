const express = require('express');
const router = express.Router();
const { readDB } = require('../db');
const { authMiddleware } = require('../middleware/auth');

function companyOnly(req, res, next) {
  if (req.user.role !== 'company') return res.status(403).json({ error: 'Company access only' });
  next();
}

// GET /api/company/stats
router.get('/stats', authMiddleware, companyOnly, (req, res) => {
  const db = readDB(req.app.locals.DB_FILE);
  res.json({
    totalFarmers: db.farmers.length,
    totalCrops: db.crops.length,
    totalResidue: db.residues.length,
    totalResidueQty: db.residues.reduce((s, r) => s + parseFloat(r.quantity || 0), 0),
    cropTypes: [...new Set(db.crops.map(c => c.cropType))],
    residueTypes: [...new Set(db.residues.map(r => r.residueType))]
  });
});

// GET /api/company/farmers
router.get('/farmers', authMiddleware, companyOnly, (req, res) => {
  const db = readDB(req.app.locals.DB_FILE);
  const farmers = db.farmers.map(f => ({
    id: f.id, name: f.name, phone: f.phone, email: f.email,
    village: f.village, district: f.district, state: f.state,
    landAcres: f.landAcres, registeredAt: f.registeredAt,
    cropCount: db.crops.filter(c => c.farmerId === f.id).length,
    residueCount: db.residues.filter(r => r.farmerId === f.id).length
  }));
  res.json({ farmers });
});

// GET /api/company/crops
router.get('/crops', authMiddleware, companyOnly, (req, res) => {
  const db = readDB(req.app.locals.DB_FILE);
  res.json({ crops: db.crops });
});

// GET /api/company/residues
router.get('/residues', authMiddleware, companyOnly, (req, res) => {
  const db = readDB(req.app.locals.DB_FILE);
  res.json({ residues: db.residues });
});

// GET /api/company/map-data
router.get('/map-data', authMiddleware, companyOnly, (req, res) => {
  const db = readDB(req.app.locals.DB_FILE);
  const points = [
    ...db.crops.filter(c => c.location?.lat).map(c => ({ ...c, dataType: 'crop' })),
    ...db.residues.filter(r => r.location?.lat).map(r => ({ ...r, dataType: 'residue' }))
  ];
  res.json({ points });
});

// PATCH /api/company/residues/:id/status
router.patch('/residues/:id/status', authMiddleware, companyOnly, (req, res) => {
  const { readDB, writeDB } = require('../db');
  const db = readDB(req.app.locals.DB_FILE);
  const r = db.residues.find(r => r.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  r.status = req.body.status || 'contacted';
  const { writeDB: wd } = require('../db');
  wd(req.app.locals.DB_FILE, db);
  res.json({ success: true });
});

module.exports = router;
