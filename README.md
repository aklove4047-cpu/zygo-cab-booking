# 🚖 Zygo Cabs - Complete Taxi Booking Ecosystem

Welcome to the **Zygo Cabs** ride-sharing and taxi booking ecosystem.

---

## 📁 Project Structure

```
zygo car booking/
│
├── zygo-website/               👉 Customer Car & Taxi Booking Website (Modern Web UI)
│   ├── index.html              (Landing page, Fare calculator, Fleet showcase, Leaflet live map, Live trip tracking modal)
│   └── assets/
│       ├── css/style.css       (Zygo Brand UI styling: Teal #1FB6A6, Deep Blue #0E5CAD, Accent Gold #F4C430)
│       ├── js/app.js           (Booking logic, Fare estimation, Live tracking simulation, OTP login)
│       ├── js/api-config.js    (API endpoint mappings & toggle for Live / Mock API)
│       └── images/             (Zygo branding, vehicle icons, and assets)
│
├── zygo-admin/                 👉 Operations, Fleet & Dispatch Admin Panel
│   ├── index.html              (Dashboard KPIs, Live Dispatch map, Bookings, Driver KYC, Fleet Fares, Promos)
│   └── assets/
│       ├── css/admin.css       (SaaS Admin Dashboard UI styling)
│       ├── js/admin.js         (Dispatch radar, Table filtering, KYC approval action, Chart.js analytics)
│       └── js/admin-api.js     (Admin API service connecting to https://login.zygocab.in)
│
├── zygo_extracted/             👉 Extracted Mobile Apps Source Code (from zygo (1).zip)
│   ├── user_app/               (Flutter Zygo User / Passenger Mobile App)
│   └── driver_app/             (Flutter Zygo Driver / Captain Mobile App)
│
└── zygo (1).zip                (Original release package containing both Flutter apps)
```

---

## 🚀 How to Run the Website & Admin Panel Locally

You can open the files directly in any web browser, or start a local server:

### Option 1: Direct Double-Click
- Double-click `zygo-website/index.html` to open the customer booking website.
- Double-click `zygo-admin/index.html` to open the admin panel.

### Option 2: Run via Node or Python local server
```bash
# Using Python:
python -m http.server 3000

# Open in browser:
# Website:      http://localhost:3000/zygo-website/
# Admin Panel:  http://localhost:3000/zygo-admin/
```

---

## 🔌 API Integration Guide

Both the Website (`zygo-website/assets/js/api-config.js`) and Admin Panel (`zygo-admin/assets/js/admin-api.js`) are pre-configured to connect to:
**Base URL:** `https://login.zygocab.in`

To switch from Mock mode to Live Backend API mode:
In `zygo-website/assets/js/api-config.js`:
```javascript
const API_CONFIG = {
  BASE_URL: 'https://login.zygocab.in',
  USE_MOCK_DATA: false, // Change to false for live backend
  ...
}
```
In `zygo-admin/assets/js/admin-api.js`:
```javascript
const ADMIN_API_CONFIG = {
  BASE_URL: 'https://login.zygocab.in',
  USE_MOCK: false, // Change to false for live backend
  ...
}
```

