/**
 * ZYGO MASTER 2.0 - LIVE STORE & PERSISTENCE ENGINE
 * Zero dummy locks: Clean dynamic state for Customer and Driver
 */

class ZygoLiveStoreCore {
  constructor() {
    this.user = this.load('zygo_active_customer', null);
    this.driver = this.load('zygo_active_driver', null);

    this.wallet = this.load('zygo_customer_wallet', {
      balance: 500.00,
      coins: 250,
      transactions: [
        { id: 'TXN-WELCOME', type: 'credit', title: 'Welcome Joining Bonus', amount: 500.00, date: 'Today' }
      ]
    });

    this.driverWallet = this.load('zygo_driver_wallet', {
      balance: 0.00,
      payableBalance: 0.00,
      pendingWithdrawal: 0.00,
      todayTrips: 0,
      todayEarned: 0.00,
      activeHours: '0h 0m',
      transactions: []
    });

    this.bookings = this.load('zygo_user_bookings', []);

    this.driverTrips = this.load('zygo_driver_trips', []);

    this.savedAddresses = this.load('zygo_saved_addresses', [
      { id: '1', name: 'Home', address: 'Vijay Nagar Square, Indore', icon: 'fa-house' },
      { id: '2', name: 'Office', address: 'Crystal IT Park, Ring Road, Indore', icon: 'fa-briefcase' }
    ]);

    this.scheduledRides = this.load('zygo_scheduled_rides', []);

    this.notifications = this.load('zygo_customer_notifications', [
      { id: 'n1', title: 'Welcome to ZYGO!', message: '₹500 welcome bonus credited to your wallet.', time: 'Just now', unread: true },
      { id: 'n2', title: 'Special Promo: ZYGO20', message: 'Use code ZYGO20 for 20% discount on your next ride.', time: '1 hour ago', unread: true }
    ]);

    this.driverMessages = this.load('zygo_driver_messages', [
      { id: 'm1', from: 'ZYGO Fleet Operations', text: 'Welcome Captain! Complete 5 rides today to earn ₹250 extra incentive.', time: 'Just now', unread: true },
      { id: 'm2', from: 'Safety Team', text: 'Monsoon guidelines: Keep headlights on and speed within 50 km/h.', time: '2 hours ago', unread: false }
    ]);

    this.driverSettings = this.load('zygo_driver_settings', {
      soundEnabled: true,
      ringVolume: 90,
      autoAccept: false,
      navigationApp: 'inapp',
      nightMode: true,
      speedWarning: true
    });

    this.driverWithdrawInfo = this.load('zygo_driver_withdraw_info', {
      bankName: 'State Bank of India',
      accountNumber: 'XXXXXX4829',
      ifscCode: 'SBIN0001234',
      upiId: 'captain@upi',
      status: 'Verified'
    });
  }

  load(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch(e) {
      return fallback;
    }
  }

  save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch(e) {}
  }

  // Customer Auth
  registerCustomer(data) {
    this.user = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: data.name,
      phone: data.phone,
      email: data.email || `${data.phone}@zygo.in`,
      city: data.city || 'Indore, Madhya Pradesh',
      isPrime: false,
      registeredAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    this.save('zygo_active_customer', this.user);
    return this.user;
  }

  logoutCustomer() {
    this.user = null;
    localStorage.removeItem('zygo_active_customer');
  }

  // Driver Auth
  registerDriver(data) {
    this.driver = {
      id: 'CAP-' + Math.floor(1000 + Math.random() * 9000),
      name: data.name,
      phone: data.phone,
      city: data.city || 'Indore',
      brand: data.brand || 'Maruti Suzuki',
      model: data.model || 'Dzire',
      category: data.category || 'Sedan',
      plate: data.plate || 'MP-09-AB-1234',
      licenseExpiry: data.licenseExpiry || '2030-12-31',
      fuelType: data.fuelType || 'CNG',
      parcelWeight: data.parcelWeight || '25',
      services: data.services || ['Ride Share', 'Parcel Delivery'],
      rating: '5.0',
      totalRides: 0,
      level: 1,
      isApproved: true,
      registeredAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    this.save('zygo_active_driver', this.driver);
    return this.driver;
  }

  logoutDriver() {
    this.driver = null;
    localStorage.removeItem('zygo_active_driver');
  }

  deleteDriverAccount() {
    this.driver = null;
    localStorage.removeItem('zygo_active_driver');
    localStorage.removeItem('zygo_driver_wallet');
    localStorage.removeItem('zygo_driver_trips');
  }

  // Customer Wallet Operations
  addCustomerMoney(amt, method = 'UPI Instant') {
    const num = parseFloat(amt);
    if (isNaN(num) || num <= 0) return false;
    this.wallet.balance += num;
    this.wallet.transactions.unshift({
      id: 'TXN-' + Math.floor(10000 + Math.random() * 90000),
      type: 'credit',
      title: `Added via ${method}`,
      amount: num,
      date: 'Today, Just Now'
    });
    this.save('zygo_customer_wallet', this.wallet);
    return true;
  }

  sendCustomerMoney(to, amt, note = 'Peer Transfer') {
    const num = parseFloat(amt);
    if (isNaN(num) || num <= 0 || num > this.wallet.balance) return false;
    this.wallet.balance -= num;
    this.wallet.transactions.unshift({
      id: 'TXN-' + Math.floor(10000 + Math.random() * 90000),
      type: 'debit',
      title: `Sent to ${to} (${note})`,
      amount: num,
      date: 'Today, Just Now'
    });
    this.save('zygo_customer_wallet', this.wallet);
    return true;
  }

  // Customer Booking Operations
  addBooking(booking) {
    this.bookings.unshift(booking);
    this.save('zygo_user_bookings', this.bookings);

    // Deduct from wallet if wallet payment
    if (booking.paymentMethod === 'Wallet' && this.wallet.balance >= booking.fare) {
      this.wallet.balance -= booking.fare;
      this.wallet.transactions.unshift({
        id: 'TXN-' + Math.floor(10000 + Math.random() * 90000),
        type: 'debit',
        title: `${booking.tier} Ride: ${booking.pickup} → ${booking.drop}`,
        amount: booking.fare,
        date: 'Today, Just Now'
      });
      this.save('zygo_customer_wallet', this.wallet);
    }
  }

  // Driver Earnings & Wallet Operations
  driverCompleteRide(fare, customerName, pickup, drop) {
    const num = parseFloat(fare);
    this.driverWallet.balance += num;
    this.driverWallet.todayEarned += num;
    this.driverWallet.todayTrips += 1;

    const tripRecord = {
      id: 'TRP-' + Math.floor(10000 + Math.random() * 90000),
      customer: customerName || 'Aman Verma',
      pickup: pickup || 'Vijay Nagar, Indore',
      drop: drop || 'Palasia Square, Indore',
      fare: num,
      status: 'Completed',
      date: 'Today, Just Now'
    };

    this.driverTrips.unshift(tripRecord);
    this.driverWallet.transactions.unshift({
      id: 'TXN-' + Math.floor(10000 + Math.random() * 90000),
      type: 'credit',
      title: `Trip Earnings (${tripRecord.pickup} → ${tripRecord.drop})`,
      amount: num,
      date: 'Today, Just Now'
    });

    if (this.driver) {
      this.driver.totalRides = (this.driver.totalRides || 0) + 1;
      this.save('zygo_active_driver', this.driver);
    }

    this.save('zygo_driver_wallet', this.driverWallet);
    this.save('zygo_driver_trips', this.driverTrips);
    return tripRecord;
  }

  driverRequestPayout(amt) {
    const num = parseFloat(amt);
    if (isNaN(num) || num <= 0 || num > this.driverWallet.balance) return false;
    this.driverWallet.balance -= num;
    this.driverWallet.pendingWithdrawal += num;
    this.driverWallet.transactions.unshift({
      id: 'WDR-' + Math.floor(10000 + Math.random() * 90000),
      type: 'debit',
      title: `Payout to ${this.driverWithdrawInfo.upiId || 'Bank Account'}`,
      amount: num,
      date: 'Today, Just Now'
    });
    this.save('zygo_driver_wallet', this.driverWallet);
    return true;
  }

  saveDriverWithdrawInfo(info) {
    this.driverWithdrawInfo = { ...this.driverWithdrawInfo, ...info, status: 'Verified' };
    this.save('zygo_driver_withdraw_info', this.driverWithdrawInfo);
  }

  saveDriverSettings(settings) {
    this.driverSettings = { ...this.driverSettings, ...settings };
    this.save('zygo_driver_settings', this.driverSettings);
  }

  saveDriverVehicle(vData) {
    if (this.driver) {
      this.driver = { ...this.driver, ...vData };
      this.save('zygo_active_driver', this.driver);
    }
  }

  // Scheduled Rides
  addScheduleRide(ride) {
    this.scheduledRides.unshift(ride);
    this.save('zygo_scheduled_rides', this.scheduledRides);
  }

  // Saved Addresses
  addFavoriteAddress(name, address, icon = 'fa-location-dot') {
    const item = { id: 'addr-' + Date.now(), name, address, icon };
    this.savedAddresses.push(item);
    this.save('zygo_saved_addresses', this.savedAddresses);
    return item;
  }

  removeFavoriteAddress(id) {
    this.savedAddresses = this.savedAddresses.filter(a => a.id !== id);
    this.save('zygo_saved_addresses', this.savedAddresses);
  }
}

const zygoLiveStoreInstance = new ZygoLiveStoreCore();
window.ZygoLiveStore = zygoLiveStoreInstance;
var ZygoLiveStore = zygoLiveStoreInstance;
