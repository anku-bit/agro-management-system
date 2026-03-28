const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple JSON file-based DB (no external DB needed)
const DB_FILE = path.join(__dirname, 'db.json');
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ farmers: [], crops: [], residues: [] }, null, 2));
}

// Make db accessible in routes
app.locals.DB_FILE = DB_FILE;

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/crops',   require('./routes/crops'));
app.use('/api/residue', require('./routes/residue'));
app.use('/api/company', require('./routes/company'));

// Serve frontend files
app.use('/farmer',  express.static(path.join(__dirname, '../farmer-portal')));
app.use('/company', express.static(path.join(__dirname, '../company-dashboard')));

app.get('/', (req, res) => {
  res.json({
    message: '🌿 AgroSense API Running',
    endpoints: {
      farmer_portal:     'http://localhost:3000/farmer',
      company_dashboard: 'http://localhost:3000/company',
      api:               'http://localhost:3000/api'
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n🌿 AgroSense Server running at http://localhost:${PORT}`);
  console.log(`👨‍🌾 Farmer Portal:     http://localhost:${PORT}/farmer`);
  console.log(`🏢 Company Dashboard: http://localhost:${PORT}/company\n`);
});
