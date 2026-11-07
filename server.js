/**
 * Zygo Cabs - Production Node.js Server for Render / Cloud Deployment
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint for Render monitoring
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Zygo Cabs Mobility Platform',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'Zygo Cabs',
    version: '2.8.0',
    port: PORT
  });
});

// Serve Admin Panel at /admin
app.use('/admin', express.static(path.join(__dirname, 'zygo-admin')));

// Serve Customer Booking Website at root /
app.use(express.static(path.join(__dirname, 'zygo-website')));

// Route aliases
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'zygo-admin', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'zygo-website', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚕 Zygo Cabs Platform Server is running!`);
  console.log(`🌐 Website URL:     http://localhost:${PORT}/`);
  console.log(`🛡️ Admin Panel URL: http://localhost:${PORT}/admin`);
  console.log(`⚡ Port:            ${PORT}`);
  console.log(`===============================================`);
});

