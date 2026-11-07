/**
 * Zygo Cab - Website & Web Booking Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State
  const state = {
    tripType: 'daily', // daily | outstation | rental
    pickup: 'Sector 62, Noida, Uttar Pradesh',
    drop: 'Indira Gandhi International Airport, Terminal 3, New Delhi',
    pickupCoords: [28.6280, 77.3649],
    dropCoords: [28.5562, 77.1000],
    distanceKm: 34.5,
    selectedCategory: 'sedan',
    paymentMethod: 'cash',
    discountAmount: 0,
    appliedCoupon: null,
    currentTrip: null
  };

  // Fleet pricing constants
  const fleetData = {
    bike: { name: 'Zygo Bike', base: 25, perKm: 8, eta: '2 min', capacity: '1 Person', img: 'assets/images/bike.png' },
    auto: { name: 'Zygo Auto', base: 45, perKm: 12, eta: '3 min', capacity: '3 People', img: 'assets/images/car.png' },
    mini: { name: 'Zygo Mini', base: 60, perKm: 14, eta: '4 min', capacity: '4 People', img: 'assets/images/car.png' },
    sedan: { name: 'Zygo Sedan', base: 90, perKm: 17, eta: '3 min', capacity: '4 People (AC)', img: 'assets/images/car.png' },
    suv: { name: 'Zygo SUV XL', base: 140, perKm: 22, eta: '5 min', capacity: '6 People (AC)', img: 'assets/images/car.png' }
  };

  // DOM Elements
  const pickupInput = document.getElementById('pickupInput');
  const dropInput = document.getElementById('dropInput');
  const locateMeBtn = document.getElementById('locateMeBtn');
  const fleetItems = document.querySelectorAll('.fleet-item');
  const tripTabs = document.querySelectorAll('.ride-tab');
  const couponInput = document.getElementById('couponInput');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponMsg = document.getElementById('couponMsg');
  const bookRideBtn = document.getElementById('bookRideBtn');
  const paymentOptions = document.querySelectorAll('.payment-option');

  // Summary Elements
  const summaryDistance = document.getElementById('summaryDistance');
  const summaryDuration = document.getElementById('summaryDuration');
  const summaryBaseFare = document.getElementById('summaryBaseFare');
  const summaryDiscountRow = document.getElementById('summaryDiscountRow');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const summaryTotalFare = document.getElementById('summaryTotalFare');

  // Modals
  const trackingModal = document.getElementById('trackingModal');
  const authModal = document.getElementById('authModal');
  const driverRegModal = document.getElementById('driverRegModal');

  // Initialize Leaflet Map
  let map, pickupMarker, dropMarker, routePolyline, cabMarker;

  function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof L === 'undefined') return;

    // Centered at Delhi NCR
    map = L.map('map', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([28.5800, 77.2300], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Zygo Maps'
    }).addTo(map);

    // Custom Icon Generators
    const createPin = (color, text) => L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 800;">${text}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    pickupMarker = L.marker(state.pickupCoords, { icon: createPin('#10B981', 'P') }).addTo(map)
      .bindPopup('<b>Pickup:</b> ' + state.pickup);

    dropMarker = L.marker(state.dropCoords, { icon: createPin('#EF4444', 'D') }).addTo(map)
      .bindPopup('<b>Destination:</b> ' + state.drop);

    // Draw route line
    routePolyline = L.polyline([state.pickupCoords, [28.5900, 77.2200], state.dropCoords], {
      color: '#1FB6A6',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8'
    }).addTo(map);

    // Cab simulation marker
    const cabIcon = L.divIcon({
      className: 'cab-pin',
      html: `<div style="background: #0E5CAD; padding: 6px; border-radius: 50%; color: #fff; font-size: 14px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">🚖</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
    cabMarker = L.marker([28.6250, 77.3550], { icon: cabIcon }).addTo(map);

    map.fitBounds([state.pickupCoords, state.dropCoords], { padding: [50, 50] });
  }

  // Update Fares
  function calculateFares() {
    const dist = state.distanceKm;
    const cat = fleetData[state.selectedCategory];

    // Multipliers for Outstation / Rental
    let multiplier = 1;
    if (state.tripType === 'outstation') multiplier = 1.6;
    if (state.tripType === 'rental') multiplier = 1.4;

    const baseFare = Math.round(cat.base * multiplier);
    const distanceFare = Math.round(dist * cat.perKm * multiplier);
    const subtotal = baseFare + distanceFare;
    const finalTotal = Math.max(0, subtotal - state.discountAmount);

    // Update Fleet Item Cards
    Object.keys(fleetData).forEach(key => {
      const f = fleetData[key];
      const itemPrice = Math.round((f.base + (dist * f.perKm)) * multiplier);
      const priceElem = document.getElementById(`fare-${key}`);
      if (priceElem) priceElem.innerText = `₹${itemPrice}`;
    });

    // Update Summary Box
    if (summaryDistance) summaryDistance.innerText = `${dist.toFixed(1)} km`;
    if (summaryDuration) summaryDuration.innerText = `${Math.round(dist * 2.2)} mins`;
    if (summaryBaseFare) summaryBaseFare.innerText = `₹${subtotal}`;
    
    if (state.discountAmount > 0) {
      if (summaryDiscountRow) summaryDiscountRow.style.display = 'flex';
      if (summaryDiscount) summaryDiscount.innerText = `-₹${state.discountAmount}`;
    } else {
      if (summaryDiscountRow) summaryDiscountRow.style.display = 'none';
    }

    if (summaryTotalFare) summaryTotalFare.innerText = `₹${finalTotal}`;
  }

  // 2. Event Listeners for Trip Tabs
  tripTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tripTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.tripType = tab.dataset.type;

      if (state.tripType === 'outstation') {
        dropInput.placeholder = 'Enter Destination City (e.g. Agra, Jaipur, Chandigarh)';
        state.distanceKm = 185;
      } else if (state.tripType === 'rental') {
        dropInput.placeholder = 'Select Package (e.g. 4 hrs / 40 km, 8 hrs / 80 km)';
        state.distanceKm = 45;
      } else {
        dropInput.placeholder = 'Where do you want to go?';
        state.distanceKm = 34.5;
      }
      calculateFares();
    });
  });

  // 3. Fleet Selection
  fleetItems.forEach(item => {
    item.addEventListener('click', () => {
      fleetItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      state.selectedCategory = item.dataset.category;
      calculateFares();
    });
  });

  // 4. Payment Selection
  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      state.paymentMethod = opt.dataset.method;
    });
  });

  // 5. Popular Chips Click
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const loc = chip.dataset.location;
      const type = chip.dataset.type;
      if (type === 'drop') {
        dropInput.value = loc;
        state.drop = loc;
      } else {
        pickupInput.value = loc;
        state.pickup = loc;
      }
      calculateFares();
    });
  });

  // 6. Locate Me Feature
  if (locateMeBtn) {
    locateMeBtn.addEventListener('click', () => {
      locateMeBtn.innerHTML = '<span>Detecting...</span>';
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            state.pickupCoords = [lat, lng];
            state.pickup = `Current GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            pickupInput.value = state.pickup;
            locateMeBtn.innerHTML = '<span>📍 Current Loc</span>';
            if (pickupMarker) pickupMarker.setLatLng([lat, lng]);
            if (map) map.setView([lat, lng], 13);
            calculateFares();
          },
          () => {
            alert('Location access denied or unavailable. Using default location.');
            locateMeBtn.innerHTML = '<span>📍 Locate Me</span>';
          }
        );
      } else {
        alert('Geolocation not supported by your browser.');
        locateMeBtn.innerHTML = '<span>📍 Locate Me</span>';
      }
    });
  }

  // 7. Coupon Handler
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (!code) return;

      if (code === 'ZYGO100' || code === 'FIRST50' || code === 'WELCOME') {
        state.appliedCoupon = code;
        state.discountAmount = code === 'ZYGO100' ? 100 : 50;
        couponMsg.style.display = 'block';
        couponMsg.style.color = '#10B981';
        couponMsg.innerHTML = `✅ Promo code <strong>${code}</strong> applied! You saved ₹${state.discountAmount}.`;
        calculateFares();
      } else {
        couponMsg.style.display = 'block';
        couponMsg.style.color = '#EF4444';
        couponMsg.innerText = '❌ Invalid coupon code. Try ZYGO100 or FIRST50.';
      }
    });
  }

  // 8. Book Ride & Trigger Live Tracking
  if (bookRideBtn) {
    bookRideBtn.addEventListener('click', async () => {
      const btnText = bookRideBtn.querySelector('.btn-text');
      const originalText = btnText ? btnText.innerText : 'Book Zygo Ride';
      
      bookRideBtn.disabled = true;
      if (btnText) btnText.innerText = 'Connecting to Zygo Captain...';

      try {
        const payload = {
          pickup_address: pickupInput.value || state.pickup,
          drop_address: dropInput.value || state.drop,
          vehicle_type: fleetData[state.selectedCategory].name,
          payment_method: state.paymentMethod,
          coupon: state.appliedCoupon,
          estimated_fare: summaryTotalFare.innerText.replace('₹', '')
        };

        const res = await window.ZygoApi.request(API_CONFIG.ENDPOINTS.CREATE_RIDE, 'POST', payload);
        
        bookRideBtn.disabled = false;
        if (btnText) btnText.innerText = originalText;

        if (res && res.data) {
          state.currentTrip = res.data;
          openLiveTrackingModal(res.data);
        }
      } catch (err) {
        bookRideBtn.disabled = false;
        if (btnText) btnText.innerText = originalText;
        alert('Could not book ride. Please try again.');
      }
    });
  }

  // 9. Live Tracking Modal Functionality
  function openLiveTrackingModal(trip) {
    if (!trackingModal) return;

    document.getElementById('trackTripId').innerText = trip.trip_id;
    document.getElementById('trackOtp').innerText = trip.otp;
    document.getElementById('trackDriverName').innerText = trip.driver.name;
    document.getElementById('trackVehicleModel').innerText = trip.driver.vehicle_model;
    document.getElementById('trackPlate').innerText = trip.driver.vehicle_number;
    document.getElementById('trackRating').innerText = trip.driver.rating + ' ★';
    document.getElementById('trackPickup').innerText = trip.pickup;
    document.getElementById('trackDrop').innerText = trip.drop;
    document.getElementById('trackFare').innerText = '₹' + trip.estimated_fare;

    trackingModal.classList.add('active');

    // Simulate animated ride status progression
    simulateTripProgress();
  }

  function simulateTripProgress() {
    const steps = [
      { id: 'step-assign', time: 1000 },
      { id: 'step-arriving', time: 4000 },
      { id: 'step-trip', time: 8000 }
    ];

    steps.forEach(s => {
      setTimeout(() => {
        const el = document.getElementById(s.id);
        if (el) el.classList.add('completed');
      }, s.time);
    });
  }

  // Cancel Trip
  const cancelRideBtn = document.getElementById('cancelRideBtn');
  if (cancelRideBtn) {
    cancelRideBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel this ride?')) {
        trackingModal.classList.remove('active');
        alert('Your ride has been cancelled without any cancellation charge.');
      }
    });
  }

  // Emergency SOS
  const sosBtn = document.getElementById('sosBtn');
  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      alert('🚨 EMERGENCY SOS ALERT: Your live location has been shared with Zygo Emergency Response Team and your emergency contact numbers.');
    });
  }

  // Close Modals
  document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  // Auth Modal Triggers
  const openLoginBtn = document.getElementById('openLoginBtn');
  if (openLoginBtn && authModal) {
    openLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      authModal.classList.add('active');
    });
  }

  // OTP Login Simulation
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  const verifyOtpBtn = document.getElementById('verifyOtpBtn');
  const otpGroup = document.getElementById('otpGroup');
  const authPhone = document.getElementById('authPhone');
  const authOtp = document.getElementById('authOtp');

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async () => {
      const phone = authPhone.value.trim();
      if (!phone || phone.length < 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }
      sendOtpBtn.innerText = 'Sending...';
      const res = await window.ZygoApi.request(API_CONFIG.ENDPOINTS.SEND_OTP, 'POST', { phone });
      sendOtpBtn.style.display = 'none';
      if (otpGroup) otpGroup.style.display = 'block';
      if (verifyOtpBtn) verifyOtpBtn.style.display = 'block';
      alert('Mock OTP sent! Enter 1234 to verify.');
    });
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', async () => {
      const otp = authOtp.value.trim();
      if (!otp) {
        alert('Please enter the OTP.');
        return;
      }
      const res = await window.ZygoApi.request(API_CONFIG.ENDPOINTS.VERIFY_OTP, 'POST', {
        phone: authPhone.value,
        otp: otp
      });
      alert('Welcome to Zygo! You are now logged in.');
      authModal.classList.remove('active');
      if (openLoginBtn) openLoginBtn.innerText = 'Hi, Rahul';
    });
  }

  // Driver Registration Form
  const driverForm = document.getElementById('driverForm');
  if (driverForm) {
    driverForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = driverForm.querySelector('button[type="submit"]');
      submitBtn.innerText = 'Submitting Application...';

      const formData = {
        name: document.getElementById('driverName').value,
        phone: document.getElementById('driverPhone').value,
        city: document.getElementById('driverCity').value,
        vehicle_type: document.getElementById('driverVehicle').value
      };

      const res = await window.ZygoApi.request(API_CONFIG.ENDPOINTS.DRIVER_REGISTER, 'POST', formData);
      submitBtn.innerText = 'Application Submitted!';
      alert(res.message || 'Application submitted successfully! Our fleet team will reach out.');
      driverForm.reset();
    });
  }

  // Init
  initMap();
  calculateFares();
});

