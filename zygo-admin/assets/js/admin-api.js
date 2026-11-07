/**
 * Zygo Admin Panel - API Management & Dynamic Service
 * 
 * Supports dynamic configuration directly from Admin UI:
 * - Base URL & Live/Mock mode
 * - Google Maps API Key
 * - SMS & OTP Gateway (Firebase / Msg91)
 * - Payment Gateways (Razorpay / Cashfree)
 * - Real-time WebSockets
 * - Ping / Test connection
 * - Export & Import settings
 */

const DEFAULT_ADMIN_CONFIG = {
  BASE_URL: 'https://login.zygocab.in',
  USE_MOCK: true,
  TIMEOUT: 15000,
  GOOGLE_MAPS_KEY: 'AIzaSyAsaQDm6B4mPeDn4g-PgkWnsZmajrvtU-8',
  MAP_PROVIDER: 'leaflet',
  AUTH_PROVIDER: 'firebase',
  SMS_GATEWAY_KEY: '',
  FIREBASE_PROJECT_ID: 'zygo-cab-prod',
  PAYMENT_GATEWAY: 'razorpay',
  RAZORPAY_KEY_ID: 'rzp_test_sampleKey123',
  RAZORPAY_KEY_SECRET: 'sample_secret_xyz',
  CASH_ON_TRIP_ENABLED: true,
  PUSHER_KEY: 'sample_pusher_key',
  PUSHER_CLUSTER: 'ap2',
  SEARCH_RADIUS_KM: 5,
  PLATFORM_COMMISSION_PERCENT: 12
};

function getAdminConfig() {
  try {
    const saved = localStorage.getItem('zygo_api_config');
    if (saved) {
      return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Could not read admin config, fallback to default.');
  }
  return DEFAULT_ADMIN_CONFIG;
}

function saveAdminConfig(newConfig) {
  const current = getAdminConfig();
  const merged = { ...current, ...newConfig };
  localStorage.setItem('zygo_api_config', JSON.stringify(merged));
  // Trigger custom event so website knows
  window.dispatchEvent(new Event('storage'));
  return merged;
}

let ADMIN_API_CONFIG = getAdminConfig();

// Mock Initial Data Store
const AdminMockData = {
  stats: {
    totalRevenue: '₹1,42,850',
    totalTrips: 1248,
    activeDrivers: 86,
    activeTrips: 24,
    revenueGrowth: '+18.4%',
    tripsGrowth: '+12.1%',
    driversGrowth: '+5'
  },
  
  trips: [
    { id: 'ZYG-10892', customer: 'Rahul Kumar', phone: '+91 9876543210', driver: 'Rajesh Sharma', vehicle: 'Sedan (Dzire)', pickup: 'Sector 62, Noida', drop: 'IGI Airport T3, Delhi', fare: 489, payment: 'Cash', status: 'Ongoing', date: 'Today, 12:45 PM' },
    { id: 'ZYG-10891', customer: 'Pooja Verma', phone: '+91 9811223344', driver: 'Vikram Singh', vehicle: 'Mini (WagonR)', pickup: 'Cyber City, Gurugram', drop: 'Connaught Place, Delhi', fare: 385, payment: 'UPI', status: 'Completed', date: 'Today, 11:30 AM' },
    { id: 'ZYG-10890', customer: 'Amit Saxena', phone: '+91 9988776655', driver: 'Sunil Yadav', vehicle: 'SUV (Ertiga)', pickup: 'Noida City Centre', drop: 'Greater Noida West', fare: 650, payment: 'Wallet', status: 'Completed', date: 'Today, 10:15 AM' },
    { id: 'ZYG-10889', customer: 'Kavita Joshi', phone: '+91 9765432109', driver: 'Unassigned', vehicle: 'Auto', pickup: 'Lajpat Nagar', drop: 'South Extension', fare: 140, payment: 'Cash', status: 'Pending', date: 'Today, 01:05 PM' },
    { id: 'ZYG-10888', customer: 'Deepak Rao', phone: '+91 9123456789', driver: 'Manoj Kumar', vehicle: 'Sedan (Etios)', pickup: 'Saket Metro', drop: 'Faridabad Sec 15', fare: 420, payment: 'UPI', status: 'Cancelled', date: 'Today, 09:40 AM' }
  ],

  drivers: [
    { id: 'DRV-501', name: 'Rajesh Sharma', phone: '+91 9871234567', vehicle: 'Maruti Dzire (DL 01 AB 8942)', category: 'Sedan', rating: 4.9, totalRides: 1840, kycStatus: 'Approved', status: 'Online', earnings: '₹34,200' },
    { id: 'DRV-502', name: 'Vikram Singh', phone: '+91 9872345678', vehicle: 'Maruti WagonR (UP 16 CD 1234)', category: 'Mini', rating: 4.8, totalRides: 1420, kycStatus: 'Approved', status: 'Busy', earnings: '₹28,900' },
    { id: 'DRV-503', name: 'Sunil Yadav', phone: '+91 9873456789', vehicle: 'Maruti Ertiga (HR 26 EF 5678)', category: 'SUV', rating: 4.9, totalRides: 950, kycStatus: 'Approved', status: 'Online', earnings: '₹42,500' },
    { id: 'DRV-504', name: 'Rameshwar Lal', phone: '+91 9874567890', vehicle: 'Hyundai Aura (DL 03 GH 9012)', category: 'Sedan', rating: 0.0, totalRides: 0, kycStatus: 'Pending KYC', status: 'Offline', earnings: '₹0' },
    { id: 'DRV-505', name: 'Mohammad Arshad', phone: '+91 9875678901', vehicle: 'Bajaj RE Auto (UP 14 IJ 3456)', category: 'Auto', rating: 4.7, totalRides: 2100, kycStatus: 'Approved', status: 'Online', earnings: '₹19,800' }
  ],

  customers: [
    { id: 'CUST-101', name: 'Rahul Kumar', phone: '+91 9876543210', email: 'rahul@example.com', totalTrips: 42, wallet: '₹350', status: 'Active' },
    { id: 'CUST-102', name: 'Pooja Verma', phone: '+91 9811223344', email: 'pooja@example.com', totalTrips: 18, wallet: '₹120', status: 'Active' },
    { id: 'CUST-103', name: 'Amit Saxena', phone: '+91 9988776655', email: 'amit@example.com', totalTrips: 65, wallet: '₹840', status: 'Active' },
    { id: 'CUST-104', name: 'Kavita Joshi', phone: '+91 9765432109', email: 'kavita@example.com', totalTrips: 9, wallet: '₹0', status: 'Active' }
  ],

  coupons: [
    { code: 'ZYGO100', discount: '₹100 Flat', minRide: '₹300', expiry: '31 Dec 2026', uses: 842, status: 'Active' },
    { code: 'FIRST50', discount: '50% up to ₹50', minRide: '₹100', expiry: '31 Dec 2026', uses: 1240, status: 'Active' },
    { code: 'AIRPORT20', discount: '20% Flat', minRide: '₹500', expiry: '15 Jan 2027', uses: 310, status: 'Active' }
  ]
};

class ZygoAdminApi {
  constructor() {
    this.adminToken = localStorage.getItem('zygo_admin_token') || 'mock-admin-token-zygo';
  }

  getConfig() {
    ADMIN_API_CONFIG = getAdminConfig();
    return ADMIN_API_CONFIG;
  }

  saveConfig(cfg) {
    ADMIN_API_CONFIG = saveAdminConfig(cfg);
    return ADMIN_API_CONFIG;
  }

  // Ping Server to test connectivity
  async testServerConnection(url) {
    const startTime = Date.now();
    try {
      const target = url || ADMIN_API_CONFIG.BASE_URL;
      const res = await fetch(`${target}/api/customer/configuration`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const latency = Date.now() - startTime;
      return {
        success: res.ok,
        status: res.status,
        latency: `${latency}ms`,
        message: res.ok ? 'Server connected successfully!' : `Server responded with status ${res.status}`
      };
    } catch (err) {
      return {
        success: false,
        latency: `${Date.now() - startTime}ms`,
        message: err.message || 'Server unreachable or CORS blocked'
      };
    }
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.adminToken}`
    };
  }

  async request(endpoint, method = 'GET', data = null) {
    const cfg = this.getConfig();
    if (cfg.USE_MOCK) {
      return this.mockResponse(endpoint, method, data);
    }

    try {
      const res = await fetch(`${cfg.BASE_URL}${endpoint}`, {
        method,
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : null
      });
      return await res.json();
    } catch (err) {
      console.warn(`[Zygo Admin API] Failed: ${err.message}, fallback to mock.`);
      return this.mockResponse(endpoint, method, data);
    }
  }

  mockResponse(endpoint, method, data) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          response_code: 'default_200',
          message: 'Success',
          data: AdminMockData
        });
      }, 150);
    });
  }
}

window.AdminApi = new ZygoAdminApi();
