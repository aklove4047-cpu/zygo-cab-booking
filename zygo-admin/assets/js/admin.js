/**
 * Zygo Admin Panel - Main Controller Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Tab Switching
  const menuItems = document.querySelectorAll('.menu-item[data-tab]');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const globalSearchInput = document.getElementById('globalSearchInput');

  let revenueChart = null;
  let dispatchMap = null;

  // 1. Tab Switcher
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.dataset.tab;

      menuItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `tab-${targetTab}`) {
          pane.classList.add('active');
        }
      });

      // Special initializations on tab open
      if (targetTab === 'dispatch') {
        setTimeout(initDispatchMap, 150);
      }
      if (targetTab === 'dashboard' && !revenueChart) {
        initCharts();
      }
    });
  });

  // 2. Render Analytics Chart
  function initCharts() {
    const ctx = document.getElementById('revenueChartCanvas');
    if (!ctx || typeof Chart === 'undefined') return;

    revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Total Revenue (₹ in Thousands)',
            data: [18.5, 22.4, 19.8, 25.1, 31.4, 38.6, 42.8],
            borderColor: '#1FB6A6',
            backgroundColor: 'rgba(31, 182, 166, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 3
          },
          {
            label: 'Trips Completed',
            data: [140, 165, 150, 190, 240, 290, 320],
            borderColor: '#0E5CAD',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.35,
            borderWidth: 2,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => '₹' + v + 'k' }
          },
          y1: {
            position: 'right',
            beginAtZero: true,
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  // 3. Render Trips Table
  function renderTripsTable(filterStatus = 'all', searchQuery = '') {
    const tbody = document.getElementById('tripsTableBody');
    if (!tbody) return;

    let filtered = AdminMockData.trips;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(q) || 
        t.customer.toLowerCase().includes(q) ||
        t.driver.toLowerCase().includes(q)
      );
    }

    tbody.innerHTML = filtered.map(t => {
      let badgeClass = 'badge-completed';
      if (t.status === 'Ongoing') badgeClass = 'badge-ongoing';
      if (t.status === 'Pending') badgeClass = 'badge-pending';
      if (t.status === 'Cancelled') badgeClass = 'badge-cancelled';

      return `
        <tr>
          <td><strong>${t.id}</strong></td>
          <td>
            <div style="font-weight: 700;">${t.customer}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${t.phone}</div>
          </td>
          <td>
            <div style="font-weight: 600;">${t.driver}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${t.vehicle}</div>
          </td>
          <td>
            <div style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              <span style="color: #10B981;">●</span> ${t.pickup} <br>
              <span style="color: #EF4444;">●</span> ${t.drop}
            </div>
          </td>
          <td><strong>₹${t.fare}</strong> <small style="color: var(--text-muted);">(${t.payment})</small></td>
          <td><span class="badge-status ${badgeClass}">${t.status}</span></td>
          <td>
            <button class="btn-table-action view-trip-btn" data-id="${t.id}">
              <i class="fa-solid fa-eye"></i> Details
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Details Button Listener
    document.querySelectorAll('.view-trip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const trip = AdminMockData.trips.find(t => t.id === btn.dataset.id);
        if (trip) openTripDetailsModal(trip);
      });
    });
  }

  // 4. Trip Details Modal
  function openTripDetailsModal(trip) {
    const modal = document.getElementById('tripDetailsModal');
    if (!modal) return;

    document.getElementById('modalTripId').innerText = trip.id;
    document.getElementById('modalCustomer').innerText = trip.customer + ' (' + trip.phone + ')';
    document.getElementById('modalDriver').innerText = trip.driver;
    document.getElementById('modalVehicle').innerText = trip.vehicle;
    document.getElementById('modalPickup').innerText = trip.pickup;
    document.getElementById('modalDrop').innerText = trip.drop;
    document.getElementById('modalFare').innerText = '₹' + trip.fare;
    document.getElementById('modalPayment').innerText = trip.payment;
    document.getElementById('modalStatus').innerText = trip.status;

    modal.classList.add('active');
  }

  // 5. Render Drivers Table
  function renderDriversTable(kycFilter = 'all') {
    const tbody = document.getElementById('driversTableBody');
    if (!tbody) return;

    let filtered = AdminMockData.drivers;
    if (kycFilter !== 'all') {
      filtered = filtered.filter(d => d.kycStatus === kycFilter);
    }

    tbody.innerHTML = filtered.map(d => {
      let kycBadge = d.kycStatus === 'Approved' ? 'badge-approved' : 'badge-pending-kyc';
      let statusBadge = 'badge-offline';
      if (d.status === 'Online') statusBadge = 'badge-online';
      if (d.status === 'Busy') statusBadge = 'badge-busy';

      return `
        <tr>
          <td><strong>${d.id}</strong></td>
          <td>
            <div style="font-weight: 700;">${d.name}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${d.phone}</div>
          </td>
          <td>${d.vehicle}</td>
          <td><strong>${d.rating} ★</strong> (${d.totalRides} trips)</td>
          <td><span class="badge-status ${statusBadge}">${d.status}</span></td>
          <td><span class="badge-status ${kycBadge}">${d.kycStatus}</span></td>
          <td><strong>${d.earnings}</strong></td>
          <td>
            <div class="action-btn-group">
              ${d.kycStatus === 'Pending KYC' ? `
                <button class="btn-table-action primary approve-kyc-btn" data-id="${d.id}">
                  <i class="fa-solid fa-check"></i> Review KYC
                </button>
              ` : `
                <button class="btn-table-action" onclick="alert('Viewing driver history for ${d.name}')">
                  <i class="fa-solid fa-id-badge"></i> Profile
                </button>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach KYC review click
    document.querySelectorAll('.approve-kyc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const driver = AdminMockData.drivers.find(d => d.id === btn.dataset.id);
        if (driver) openKycModal(driver);
      });
    });
  }

  // 6. Driver KYC Review Modal
  function openKycModal(driver) {
    const modal = document.getElementById('kycModal');
    if (!modal) return;

    document.getElementById('kycDriverName').innerText = driver.name;
    document.getElementById('kycDriverPhone').innerText = driver.phone;
    document.getElementById('kycVehicle').innerText = driver.vehicle;

    const approveBtn = document.getElementById('approveKycActionBtn');
    approveBtn.onclick = () => {
      driver.kycStatus = 'Approved';
      modal.classList.remove('active');
      renderDriversTable();
      alert(`Driver ${driver.name} KYC has been approved! Driver is now activated on the Zygo Captain App.`);
    };

    modal.classList.add('active');
  }

  // 7. Render Customers Table
  function renderCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    tbody.innerHTML = AdminMockData.customers.map(c => `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td>
          <div style="font-weight: 700;">${c.name}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${c.email}</div>
        </td>
        <td>${c.phone}</td>
        <td><strong>${c.totalTrips}</strong> rides</td>
        <td><strong style="color: var(--primary);">${c.wallet}</strong></td>
        <td><span class="badge-status badge-active">${c.status}</span></td>
        <td>
          <button class="btn-table-action" onclick="alert('Customer ride history: ${c.name}')">
            <i class="fa-solid fa-clock-rotate-left"></i> History
          </button>
        </td>
      </tr>
    `).join('');
  }

  // 8. Render Coupons Table
  function renderCouponsTable() {
    const tbody = document.getElementById('couponsTableBody');
    if (!tbody) return;

    tbody.innerHTML = AdminMockData.coupons.map(cp => `
      <tr>
        <td><strong style="background: var(--primary-light); color: var(--primary-dark); padding: 4px 8px; border-radius: 4px;">${cp.code}</strong></td>
        <td>${cp.discount}</td>
        <td>Min. ${cp.minRide}</td>
        <td>${cp.expiry}</td>
        <td><strong>${cp.uses}</strong> times</td>
        <td><span class="badge-status badge-active">${cp.status}</span></td>
        <td>
          <button class="btn-table-action danger" onclick="alert('Promo code deactivated.')">
            <i class="fa-solid fa-ban"></i> Deactivate
          </button>
        </td>
      </tr>
    `).join('');
  }

  // 9. Live Dispatch Radar Map
  function initDispatchMap() {
    const mapElement = document.getElementById('dispatchMap');
    if (!mapElement || typeof L === 'undefined' || dispatchMap) return;

    dispatchMap = L.map('dispatchMap').setView([28.6139, 77.2090], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap | Zygo Fleet Ops'
    }).addTo(dispatchMap);

    // Mock Fleet GPS Pins
    const fleetLocations = [
      { name: 'Rajesh Sharma (Sedan)', status: 'Online', lat: 28.6280, lng: 77.3649, color: '#10B981' },
      { name: 'Vikram Singh (Mini)', status: 'Busy', lat: 28.5355, lng: 77.3910, color: '#F59E0B' },
      { name: 'Sunil Yadav (SUV)', status: 'Online', lat: 28.5700, lng: 77.3200, color: '#10B981' },
      { name: 'Mohammad Arshad (Auto)', status: 'Online', lat: 28.6500, lng: 77.2800, color: '#10B981' },
      { name: 'Deepak Verma (Sedan)', status: 'On Trip', lat: 28.5900, lng: 77.2200, color: '#3B82F6' }
    ];

    fleetLocations.forEach(f => {
      const pin = L.divIcon({
        className: 'dispatch-driver-pin',
        html: `<div style="background: ${f.color}; color: #fff; padding: 6px 10px; border-radius: 9999px; font-size: 11px; font-weight: 800; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap; display: flex; align-items: center; gap: 4px;">🚖 ${f.name}</div>`,
        iconSize: [120, 26]
      });

      L.marker([f.lat, f.lng], { icon: pin }).addTo(dispatchMap)
        .bindPopup(`<b>${f.name}</b><br>Status: ${f.status}`);
    });
  }

  // 10. Filter Tabs in Trips Table
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTripsTable(btn.dataset.filter);
    });
  });

  // Global search input
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      renderTripsTable('all', e.target.value);
    });
  }

  // ================= 11. DYNAMIC API SETTINGS MANAGER =================
  const settingsForm = document.getElementById('settingsForm');
  const pingServerBtn = document.getElementById('pingServerBtn');
  const connectionBadge = document.getElementById('connectionBadge');
  const exportConfigBtn = document.getElementById('exportConfigBtn');
  const importConfigFile = document.getElementById('importConfigFile');
  const resetConfigBtn = document.getElementById('resetConfigBtn');

  // Load current settings into form
  function populateSettingsForm() {
    const cfg = window.AdminApi.getConfig();
    
    // Mode radios
    const radioMock = document.getElementById('radioMockMode');
    const radioLive = document.getElementById('radioLiveMode');
    if (radioMock && radioLive) {
      if (cfg.USE_MOCK) {
        radioMock.checked = true;
      } else {
        radioLive.checked = true;
      }
    }

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };

    setVal('settingBaseUrl', cfg.BASE_URL);
    setVal('settingGoogleMapsKey', cfg.GOOGLE_MAPS_KEY);
    setVal('settingMapProvider', cfg.MAP_PROVIDER || 'leaflet');
    setVal('settingSearchRadius', cfg.SEARCH_RADIUS_KM || 5);
    setVal('settingAuthProvider', cfg.AUTH_PROVIDER || 'firebase');
    setVal('settingFirebaseProject', cfg.FIREBASE_PROJECT_ID || 'zygo-cab-prod');
    setVal('settingSmsKey', cfg.SMS_GATEWAY_KEY || '');
    setVal('settingPaymentGateway', cfg.PAYMENT_GATEWAY || 'razorpay');
    setVal('settingRazorpayKeyId', cfg.RAZORPAY_KEY_ID || '');
    setVal('settingRazorpaySecret', cfg.RAZORPAY_KEY_SECRET || '');
    setVal('settingPusherKey', cfg.PUSHER_KEY || '');
    setVal('settingPusherCluster', cfg.PUSHER_CLUSTER || 'ap2');
    setVal('settingCommission', cfg.PLATFORM_COMMISSION_PERCENT || 12);

    const cashCheck = document.getElementById('settingCashOnTrip');
    if (cashCheck) cashCheck.checked = cfg.CASH_ON_TRIP_ENABLED !== false;
  }

  // Ping Server Button
  if (pingServerBtn && connectionBadge) {
    pingServerBtn.addEventListener('click', async () => {
      const url = document.getElementById('settingBaseUrl').value.trim();
      connectionBadge.className = 'badge-status badge-busy';
      connectionBadge.innerText = 'Pinging...';
      pingServerBtn.disabled = true;

      const res = await window.AdminApi.testServerConnection(url);
      pingServerBtn.disabled = false;

      if (res.success) {
        connectionBadge.className = 'badge-status badge-approved';
        connectionBadge.innerText = `🟢 Connected (${res.latency})`;
        alert(`✅ Server connected successfully!\nStatus: ${res.status}\nLatency: ${res.latency}\nEndpoint: ${url}`);
      } else {
        connectionBadge.className = 'badge-status badge-cancelled';
        connectionBadge.innerText = `🔴 Unreachable (${res.latency})`;
        alert(`⚠️ Could not reach server at ${url}\nDetails: ${res.message}\nMake sure your server is active and CORS is enabled for web access.`);
      }
    });
  }

  // Save Settings Form
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const isMock = document.getElementById('radioMockMode')?.checked ?? true;
      const updatedConfig = {
        USE_MOCK: isMock,
        USE_MOCK_DATA: isMock,
        BASE_URL: document.getElementById('settingBaseUrl')?.value.trim() || 'https://login.zygocab.in',
        GOOGLE_MAPS_KEY: document.getElementById('settingGoogleMapsKey')?.value.trim() || '',
        MAP_PROVIDER: document.getElementById('settingMapProvider')?.value || 'leaflet',
        SEARCH_RADIUS_KM: Number(document.getElementById('settingSearchRadius')?.value || 5),
        AUTH_PROVIDER: document.getElementById('settingAuthProvider')?.value || 'firebase',
        FIREBASE_PROJECT_ID: document.getElementById('settingFirebaseProject')?.value.trim() || '',
        SMS_GATEWAY_KEY: document.getElementById('settingSmsKey')?.value.trim() || '',
        PAYMENT_GATEWAY: document.getElementById('settingPaymentGateway')?.value || 'razorpay',
        RAZORPAY_KEY_ID: document.getElementById('settingRazorpayKeyId')?.value.trim() || '',
        RAZORPAY_KEY_SECRET: document.getElementById('settingRazorpaySecret')?.value.trim() || '',
        CASH_ON_TRIP_ENABLED: document.getElementById('settingCashOnTrip')?.checked ?? true,
        PUSHER_KEY: document.getElementById('settingPusherKey')?.value.trim() || '',
        PUSHER_CLUSTER: document.getElementById('settingPusherCluster')?.value.trim() || 'ap2',
        PLATFORM_COMMISSION_PERCENT: Number(document.getElementById('settingCommission')?.value || 12)
      };

      window.AdminApi.saveConfig(updatedConfig);
      alert(`✅ All API Keys & System Settings successfully saved!\n\nMode: ${isMock ? '🧪 Mock Demo Mode' : '🚀 Live Backend API Mode'}\nBase URL: ${updatedConfig.BASE_URL}\nAll updates have synced across the website and admin panel.`);
    });
  }

  // Export JSON Configuration
  if (exportConfigBtn) {
    exportConfigBtn.addEventListener('click', () => {
      const cfg = window.AdminApi.getConfig();
      const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
      const url = URL.now ? URL.createObjectURL(blob) : window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zygo-api-config-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // Import JSON Configuration
  if (importConfigFile) {
    importConfigFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          window.AdminApi.saveConfig(imported);
          populateSettingsForm();
          alert('✅ Configuration imported and applied successfully!');
        } catch (err) {
          alert('❌ Failed to parse JSON configuration file.');
        }
      };
      reader.readAsText(file);
    });
  }

  // Reset to Defaults
  if (resetConfigBtn) {
    resetConfigBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all API configurations to default demo settings?')) {
        localStorage.removeItem('zygo_api_config');
        populateSettingsForm();
        alert('Reset to default configuration complete.');
      }
    });
  }

  // Close Modals
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-modal').forEach(m => m.classList.remove('active'));
    });
  });

  // Init all tables and views
  renderTripsTable();
  renderDriversTable();
  renderCustomersTable();
  renderCouponsTable();
  populateSettingsForm();
  initCharts();
});

