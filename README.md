# 🌿 AgroSense — Full Stack Farm Intelligence System

## Project Structure
```
agrosense/
├── backend/           ← Node.js + Express Server
│   ├── server.js      ← Main server (port 3000)
│   ├── db.js          ← JSON file-based database
│   ├── db.json        ← Auto-created database file
│   ├── routes/
│   │   ├── auth.js    ← Register, Login, Company Login
│   │   ├── crops.js   ← Add, view, delete crops
│   │   ├── residue.js ← Add, view, delete residue
│   │   └── company.js ← Company dashboard APIs
│   ├── middleware/
│   │   └── auth.js    ← JWT authentication
│   └── uploads/       ← Photo uploads stored here
├── farmer-portal/
│   └── index.html     ← Farmer Register/Login + Dashboard
└── company-dashboard/
    └── index.html     ← Company Dashboard (dark theme)
```

## 🚀 Setup (VS Code mein)

### Step 1 — Backend Install Karein
```bash
cd backend
npm install
```

### Step 2 — Server Start Karein
```bash
node server.js
```
Ya development mode mein:
```bash
npm run dev
```

### Step 3 — Browser mein Open Karein
- **Farmer Portal:**     http://localhost:3000/farmer
- **Company Dashboard:** http://localhost:3000/company
- **API Check:**         http://localhost:3000

---

## 🔑 Login Credentials

### Company Dashboard
- Username: `admin`
- Password: `agrosense@2024`

### Farmer Portal
- Pehle Register karein apna account
- Phir login karein

---

## 📡 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Farmer register |
| POST | /api/auth/login | Farmer login |
| POST | /api/auth/company-login | Company login |
| POST | /api/crops/add | Add crop (with photo) |
| GET | /api/crops/my | My crops |
| DELETE | /api/crops/:id | Delete crop |
| POST | /api/residue/add | Add residue (with photo) |
| GET | /api/residue/my | My residue |
| DELETE | /api/residue/:id | Delete residue |
| GET | /api/company/stats | Dashboard stats |
| GET | /api/company/farmers | All farmers |
| GET | /api/company/crops | All crops |
| GET | /api/company/residues | All residue listings |
| GET | /api/company/map-data | Location data |
| PATCH | /api/company/residues/:id/status | Update status |

---

## 🌿 Features

### Farmer Portal
- ✅ Register with name, phone, village, district, state, land acres
- ✅ Login with phone + password
- ✅ Add crops with photo upload
- ✅ Add crop residue with pricing
- ✅ View and delete own listings
- ✅ Dashboard with stats

### Company Dashboard
- ✅ Secure company login
- ✅ All registered farmers list
- ✅ All crop listings with photos
- ✅ All residue listings with contact button
- ✅ Map view of farm locations
- ✅ Analytics — crops by type, residue by type, farmers by state
- ✅ Auto-refresh every 30 seconds
- ✅ Search/filter all tables
