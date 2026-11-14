/**
 * Zygo Admin Panel - API Management & Dynamic Service
 * 
 * Manages:
 * - Live/Mock API Mode
 * - Base URL & Backend Server
 * - Driver Live Location & WebSockets API (Ola/Uber style)
 * - Multiple Payment Gateways (Razorpay, Cashfree, Stripe, PhonePe/UPI, Cash)
 * - Dynamic Customers & Drivers database (No fake hardcoded users)
 */

const DEFAULT_ADMIN_CONFIG = {
  BASE_URL: 'https://login.zygocab.in',
  USE_MOCK: true,
  TIMEOUT: 15000,
  
  // Google Maps & Navigation
  GOOGLE_MAPS_KEY: '',
  MAP_PROVIDER: 'leaflet', // 'leaflet' | 'google'

  // SMS & Auth Provider
  AUTH_PROVIDER: 'firebase', // 'firebase' | 'msg91' | 'fast2sms' | 'twilio'
  SMS_GATEWAY_KEY: '',
  FIREBASE_PROJECT_ID: 'zygo-cab-prod',

  // Payment Gateways (Multiple)
  PAYMENT_GATEWAY: 'razorpay',
  RAZORPAY_KEY_ID: 'rzp_test_sampleKey123',
  RAZORPAY_KEY_SECRET: 'sample_secret_xyz',
  RAZORPAY_WEBHOOK_SECRET: 'webhook_secret_123',
  
  CASHFREE_APP_ID: 'cf_app_sample123',
  CASHFREE_SECRET_KEY: 'cf_secret_sample456',

  STRIPE_PUBLISHABLE_KEY: 'pk_test_sample123',
  STRIPE_SECRET_KEY: 'sk_test_sample456',

  UPI_MERCHANT_ID: 'zygo@icici',
  UPI_MERCHANT_NAME: 'Zygo Mobility Cabs',

  CASH_ON_TRIP_ENABLED: true,
  MIN_PAYOUT_AMOUNT: 500,

  // Live Driver WebSockets & Tracking API (Ola/Uber style)
  DRIVER_TRACKING_API: 'https://login.zygocab.in/api/driver/update-location',
  PUSHER_KEY: 'sample_pusher_key',
  PUSHER_CLUSTER: 'ap2',
  PUSHER_SECRET: 'sample_pusher_secret',
  GPS_POLL_INTERVAL_SEC: 3,
  DISPATCH_ALGORITHM: 'nearest', // 'nearest' | 'broadcast'

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
  window.dispatchEvent(new Event('storage'));
  return merged;
}

let ADMIN_API_CONFIG = getAdminConfig();

// Load dynamic real drivers & customers (No hardcoded fake users)
function getRegisteredDrivers() {
  try {
    const d = localStorage.getItem('zygo_registered_drivers');
    return d ? JSON.parse(d) : [];
  } catch(e) { return []; }
}

function saveRegisteredDrivers(drivers) {
  localStorage.setItem('zygo_registered_drivers', JSON.stringify(drivers));
}

function getRegisteredCustomers() {
  try {
    const c = localStorage.getItem('zygo_registered_customers');
    return c ? JSON.parse(c) : [];
  } catch(e) { return []; }
}

function saveRegisteredCustomers(customers) {
  localStorage.setItem('zygo_registered_customers', JSON.stringify(customers));
}

function getRegisteredTrips() {
  try {
    const t = localStorage.getItem('zygo_registered_trips');
    return t ? JSON.parse(t) : [];
  } catch(e) { return []; }
}

function saveRegisteredTrips(trips) {
  localStorage.setItem('zygo_registered_trips', JSON.stringify(trips));
}

// Active dynamic data store
const AdminMockData = {
  stats: {
    totalRevenue: '₹0',
    totalTrips: 0,
    activeDrivers: 0,
    activeTrips: 0,
    revenueGrowth: '+0%',
    tripsGrowth: '+0%',
    driversGrowth: '0'
  },
  trips: getRegisteredTrips(),
  drivers: getRegisteredDrivers(),
  customers: getRegisteredCustomers(),
  coupons: [
    { code: 'ZYGO50', discount: '₹50 Flat', minRide: '₹100', expiry: '31 Dec 2026', uses: 0, status: 'Active' },
    { code: 'FIRST100', discount: '₹100 Flat', minRide: '₹250', expiry: '31 Dec 2026', uses: 0, status: 'Active' }
  ]
};

// Sync live stats
function refreshAdminStats() {
  AdminMockData.drivers = getRegisteredDrivers();
  AdminMockData.customers = getRegisteredCustomers();
  AdminMockData.trips = getRegisteredTrips();

  let revenue = 0;
  AdminMockData.trips.forEach(t => {
    revenue += Number(t.fare || 0);
  });

  AdminMockData.stats.totalTrips = AdminMockData.trips.length;
  AdminMockData.stats.totalRevenue = '₹' + revenue.toLocaleString('en-IN');
  AdminMockData.stats.activeDrivers = AdminMockData.drivers.filter(d => d.status === 'Online').length;
  AdminMockData.stats.activeTrips = AdminMockData.trips.filter(t => t.status === 'Ongoing' || t.status === 'Accepted').length;

  // Update DOM KPI elements if present
  const elRev = document.getElementById('kpiRevenue');
  const elTrips = document.getElementById('kpiTrips');
  const elCaptains = document.getElementById('kpiCaptains');
  const elActiveTrips = document.getElementById('kpiActiveTrips');

  if (elRev) elRev.textContent = AdminMockData.stats.totalRevenue;
  if (elTrips) elTrips.textContent = AdminMockData.stats.totalTrips.toString();
  if (elCaptains) elCaptains.textContent = AdminMockData.stats.activeDrivers.toString();
  if (elActiveTrips) elActiveTrips.textContent = AdminMockData.stats.activeTrips.toString();

  const elGross = document.getElementById('kpiGrossVolume');
  const elComm = document.getElementById('kpiNetCommission');
  const elPaid = document.getElementById('kpiPayoutsPaid');
  const elPending = document.getElementById('kpiPendingClaims');

  if (elGross) elGross.textContent = '₹' + revenue.toLocaleString('en-IN');
  if (elComm) elComm.textContent = '₹' + Math.round(revenue * 0.12).toLocaleString('en-IN');
  if (elPaid) elPaid.textContent = '₹' + Math.round(revenue * 0.88).toLocaleString('en-IN');
  if (elPending) elPending.textContent = '₹0';
}

refreshAdminStats();

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
      'Authorization': `Bearer ${this.adminToken}`
    };
  }
}

const adminApi = new ZygoAdminApi();
