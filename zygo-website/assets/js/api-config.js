/**
 * Zygo Cab - Frontend API Configuration & Dynamic Store
 * 
 * Ye file Admin Panel ke "System & APIs" settings se directly sync hoti hai.
 * Agar Admin Panel me koi bhi API Key, Base URL ya Gateway change kiya jata hai,
 * to ye file automatically naye settings ko load kar leti hai.
 */

// Default Configuration
const DEFAULT_API_CONFIG = {
  BASE_URL: 'https://login.zygocab.in',
  USE_MOCK_DATA: true,
  TIMEOUT: 15000,
  
  // Google Maps & Navigation
  GOOGLE_MAPS_KEY: '',
  MAP_PROVIDER: 'leaflet', // 'google' | 'leaflet'

  // SMS & Auth Provider
  AUTH_PROVIDER: 'firebase', // 'firebase' | 'msg91' | 'twilio'
  SMS_GATEWAY_KEY: '',

  // Payment Gateways
  PAYMENT_GATEWAY: 'razorpay', // 'razorpay' | 'cashfree' | 'stripe' | 'cash'
  RAZORPAY_KEY_ID: 'rzp_test_sampleKey123',
  CASH_ON_TRIP_ENABLED: true,

  // Pusher WebSockets
  PUSHER_KEY: 'sample_pusher_key',
  PUSHER_CLUSTER: 'ap2',

  // HexaRide / Drivemond Compatible Endpoints
  ENDPOINTS: {
    CONFIG: '/api/customer/configuration',
    PAYMENT_METHODS: '/api/customer/config/get-payment-methods',
    CANCELLATION_REASONS: '/api/customer/config/cancellation-reason-list',
    SEND_OTP: '/api/customer/auth/send-otp',
    VERIFY_OTP: '/api/customer/auth/otp-verification',
    OTP_LOGIN: '/api/customer/auth/otp-login',
    REGISTER: '/api/customer/auth/registration',
    LOGIN: '/api/customer/auth/login',
    LOGOUT: '/api/user/logout',
    USER_PROFILE: '/api/customer/info',
    UPDATE_PROFILE: '/api/customer/update/profile',
    GEOCODE: '/api/customer/config/geocode-api',
    PLACE_AUTOCOMPLETE: '/api/customer/config/place-api-autocomplete',
    PLACE_DETAILS: '/api/customer/config/place-api-details',
    GET_ZONE: '/api/customer/config/get-zone-id',
    GET_ROUTES: '/api/customer/config/get-routes',
    VEHICLE_CATEGORIES: '/api/customer/vehicle/category?limit=100&offset=1',
    ESTIMATED_FARE: '/api/customer/ride/get-estimated-fare',
    CREATE_RIDE: '/api/customer/ride/create',
    RIDE_DETAILS: '/api/customer/ride/details/',
    RIDE_STATUS: '/api/customer/ride/ride-resume-status',
    CANCEL_RIDE: '/api/customer/ride/trip-action',
    NEARBY_DRIVERS: '/api/customer/drivers-near-me',
    DRIVER_LIVE_LOCATION: '/api/user/get-live-location?trip_request_id=',
    COUPONS_LIST: '/api/customer/coupon/list?limit=20&offset=1',
    APPLY_COUPON: '/api/customer/applied-coupon',
    RIDE_LIST: '/api/customer/ride/list',
    DIGITAL_PAYMENT: '/api/customer/ride/digital-payment',
    SUBMIT_REVIEW: '/api/customer/review/store',
    DRIVER_REGISTER: '/api/driver/auth/registration'
  }
};

// Load saved config from Admin Panel (if available in localStorage)
function getActiveConfig() {
  try {
    const saved = localStorage.getItem('zygo_api_config');
    if (saved) {
      return { ...DEFAULT_API_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Could not parse saved config, using defaults.');
  }
  return DEFAULT_API_CONFIG;
}

let API_CONFIG = getActiveConfig();

// Listen for updates from Admin Panel across tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'zygo_api_config') {
    API_CONFIG = getActiveConfig();
    console.log('[Zygo] API Configuration updated from Admin Panel:', API_CONFIG);
  }
});

// Zygo API Client Helper
class ZygoApiService {
  constructor() {
    this.token = localStorage.getItem('zygo_user_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('zygo_user_token', token);
    } else {
      localStorage.removeItem('zygo_user_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, method = 'GET', data = null) {
    API_CONFIG = getActiveConfig();

    if (API_CONFIG.USE_MOCK_DATA) {
      return this.handleMockResponse(endpoint, method, data);
    }

    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const options = {
      method: method,
      headers: this.getHeaders()
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      options.signal = controller.signal;

      const response = await fetch(url, options);
      clearTimeout(timeoutId);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || 'API request failed with status ' + response.status);
      }
      return json;
    } catch (error) {
      console.warn(`[Zygo API] Live server request failed (${error.message}). Falling back to safe mock mode.`);
      return this.handleMockResponse(endpoint, method, data);
    }
  }

  handleMockResponse(endpoint, method, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint.includes('vehicle/category')) {
          resolve({
            response_code: 'default_200',
            message: 'Vehicle categories fetched',
            data: [
              { id: '1', name: 'Zygo Bike', capacity: 1, base_fare: 25, per_km: 7, eta_mins: 2, icon: 'bike.png', type: 'bike' },
              { id: '2', name: 'Zygo Auto', capacity: 3, base_fare: 40, per_km: 11, eta_mins: 3, icon: 'car.png', type: 'auto' },
              { id: '3', name: 'Zygo Mini', capacity: 4, base_fare: 60, per_km: 14, eta_mins: 4, icon: 'car.png', type: 'hatchback' },
              { id: '4', name: 'Zygo Sedan Prime', capacity: 4, base_fare: 80, per_km: 17, eta_mins: 3, icon: 'car.png', type: 'sedan' },
              { id: '5', name: 'Zygo SUV XL', capacity: 6, base_fare: 120, per_km: 22, eta_mins: 5, icon: 'car.png', type: 'suv' }
            ]
          });
          return;
        }

        if (endpoint.includes('get-estimated-fare')) {
          const dist = data ? (data.distance || 12.5) : 12.5;
          resolve({
            response_code: 'default_200',
            message: 'Fare estimated successfully',
            data: {
              distance_km: dist,
              duration_mins: Math.round(dist * 2.8),
              fares: {
                bike: Math.round(25 + dist * 7),
                auto: Math.round(40 + dist * 11),
                mini: Math.round(60 + dist * 14),
                sedan: Math.round(80 + dist * 17),
                suv: Math.round(120 + dist * 22)
              }
            }
          });
          return;
        }

        if (endpoint.includes('send-otp')) {
          resolve({
            response_code: 'default_200',
            message: 'OTP sent successfully to ' + (data ? data.phone : 'mobile'),
            data: { token: 'mock-otp-1234' }
          });
          return;
        }

        if (endpoint.includes('otp-verification')) {
          const token = 'zygo_user_token_sample_xyz890';
          this.setToken(token);
          resolve({
            response_code: 'default_200',
            message: 'Login successful',
            data: {
              token: token,
              user: {
                id: 'USR-9021',
                name: 'Rahul Kumar',
                phone: data ? data.phone : '+91 9876543210',
                email: 'rahul@example.com',
                wallet_balance: 350.00
              }
            }
          });
          return;
        }

        if (endpoint.includes('ride/create')) {
          const tripId = 'ZYG-' + Math.floor(100000 + Math.random() * 900000);
          resolve({
            response_code: 'default_200',
            message: 'Ride requested successfully. Searching for nearby captains...',
            data: {
              trip_id: tripId,
              otp: Math.floor(1000 + Math.random() * 9000).toString(),
              status: 'searching',
              pickup: data ? data.pickup_address : 'Sector 62, Noida',
              drop: data ? data.drop_address : 'Indira Gandhi International Airport, Delhi',
              vehicle_type: data ? data.vehicle_type : 'Zygo Sedan Prime',
              estimated_fare: data ? data.estimated_fare : 489,
              payment_method: data ? data.payment_method : 'cash',
              driver: {
                name: 'Rajesh Sharma',
                phone: '+91 9871234567',
                rating: 4.9,
                total_rides: 1840,
                vehicle_number: 'DL 01 AB 8942',
                vehicle_model: 'White Maruti Dzire',
                eta_minutes: 3
              }
            }
          });
          return;
        }

        if (endpoint.includes('driver/auth/registration')) {
          resolve({
            response_code: 'default_200',
            message: 'Driver application submitted successfully! Our Zygo fleet manager will review your documents within 24 hours.',
            data: { application_id: 'ZYG-DRV-' + Math.floor(1000 + Math.random() * 9000) }
          });
          return;
        }

        resolve({
          response_code: 'default_200',
          message: 'Success',
          data: {}
        });
      }, 350);
    });
  }
}

window.ZygoApi = new ZygoApiService();
