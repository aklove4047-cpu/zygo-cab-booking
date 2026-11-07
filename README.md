# 🚖 Zygo Cabs - Complete Taxi Booking Ecosystem

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/aklove4047-cpu/zygo-cab-booking)

Welcome to the **Zygo Cabs** ride-sharing and taxi booking ecosystem.

---

## 🌟 Key Features

1. **Customer Taxi Booking Web App (`/`)**:
   - Modern, responsive ride hailing interface (Daily Rides, Outstation, Hourly Rentals).
   - Dynamic vehicle selection (Zygo Bike, Auto, Mini AC, Sedan Prime, SUV XL) with instant fare estimation.
   - Interactive map with route line, live driver markers, and geolocation detection.
   - 4-Digit Security Ride OTP & Live Trip Tracking Modal.
   - Emergency SOS & Captain partner registration.

2. **Operations & Fleet Admin Panel (`/admin`)**:
   - Real-time revenue & trip analytics with interactive charts.
   - Live Dispatch Radar Map for tracking on-duty drivers.
   - Bookings / Trips Management & audit modal.
   - Driver KYC verification (Driving License & RC inspection) with 1-click approval.
   - Fleet Category & Pricing Rules editor (Base fare, per km rate, waiting fee, commission %).
   - **Dynamic API & Integration Manager**: Set Backend URL, Google Maps key, Firebase OTP, Razorpay keys, and Ping/Test server connection directly from the UI without touching code!

3. **Node.js Production Server (`server.js`)**:
   - Ready for Render, Railway, AWS, or VPS hosting.
   - Serves both Website (`/`) and Admin Panel (`/admin`).
   - Built-in zero-downtime healthcheck (`/healthz`).

---

## 🚀 1-Click Render Deployment

Click the button below to deploy this repository directly on Render:

👉 **[Deploy to Render](https://render.com/deploy?repo=https://github.com/aklove4047-cpu/zygo-cab-booking)**

### Manual Steps on Render:
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** ➔ Select **Web Service**.
3. Choose **Build and deploy from a Git repository** ➔ Select `aklove4047-cpu/zygo-cab-booking`.
4. Render will automatically detect settings from `render.yaml`:
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Health Check Path:** `/healthz`
5. Click **Create Web Service**. Your website and admin panel will be live in 1 minute!

---

## 🔌 API Configuration via Admin Panel

You do NOT need to edit source code to connect APIs!
1. Open Admin Panel: `https://your-app.onrender.com/admin`
2. Go to **"System & APIs"** tab in the sidebar.
3. Switch between **Mock Demo Mode** and **Live Server Mode**.
4. Enter your Backend URL (`https://login.zygocab.in`) and click **"Ping / Test"**.
5. Add your Google Maps Key, Firebase SMS Key, and Razorpay Keys.
6. Click **"Save & Apply API Configuration"** — changes immediately sync to the booking website!

---

## 📁 Repository Structure

```
zygo-cab-booking/
├── server.js                   # Node.js production web server
├── package.json                # Dependencies & scripts
├── render.yaml                 # Render Blueprint configuration
├── zygo-website/               # Customer booking website & web app
│   ├── index.html
│   └── assets/ (css, js, images)
├── zygo-admin/                 # Fleet operations & dispatch admin panel
│   ├── index.html
│   └── assets/ (css, js, images)
└── zygo_extracted/             # Flutter User & Driver mobile apps source code
    ├── user_app/
    └── driver_app/
```
