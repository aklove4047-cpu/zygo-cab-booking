/**
 * ZYGO V2.0 - MODULAR STORE & STATE ENGINE
 * Offline-first, reactive, zero external bloat
 */

class ZygoStore {
  constructor() {
    this.state = {
      // User Profile & Auth
      user: this.getStorage('zygo_user', {
        id: 'ZYGO-USR-108',
        name: 'Kamlesh',
        phone: '+91 95110 88531',
        greeting: 'Good Morning 👋',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        rating: 4.95,
        isGuest: false,
        language: 'Hindi'
      }),

      // Location State (Default Indore as per Roadmap Phase A)
      location: {
        city: 'Indore',
        state: 'Madhya Pradesh',
        address: 'Indore, Madhya Pradesh',
        lat: 22.7196,
        lng: 75.8577
      },

      // Wallet System
      wallet: this.getStorage('zygo_wallet', {
        balance: 4560.75,
        currency: '₹',
        coins: 1250,
        transactions: [
          { id: 'TXN-901', type: 'debit', title: 'Cab Ride - Home to Office', amount: 120.00, date: 'Yesterday' },
          { id: 'TXN-902', type: 'credit', title: 'ZYGO Referral Bonus', amount: 150.00, date: '12 Nov' },
          { id: 'TXN-903', type: 'credit', title: 'UPI Topup', amount: 1000.00, date: '10 Nov' }
        ]
      }),

      // ZYGO PRIME Membership
      prime: {
        active: true,
        plan: 'ZYGO GOLD',
        price: '₹299/mo',
        benefits: ['Zero Commission Surge', 'Priority Captain Support', 'Exclusive 20% Extra Cashback']
      },

      // Active Service Categories
      services: [
        { id: 'cab', title: 'Cab', subtitle: 'Mini, Sedan, EV', icon: 'fa-car-side', badge: '', color: '#FCC82C' },
        { id: 'auto', title: 'Auto', subtitle: 'Everyday quick auto', icon: 'fa-taxi', badge: '', color: '#2ECC71' },
        { id: 'bike', title: 'Bike', subtitle: 'Fast traffic moto', icon: 'fa-motorcycle', badge: '', color: '#EFAF19' },
        { id: 'parcel', title: 'Parcel', subtitle: 'Instant delivery', icon: 'fa-box-open', badge: 'Fast', color: '#E67E22' },
        { id: 'rentals', title: 'Rentals', subtitle: 'Hourly & Daily', icon: 'fa-calendar-check', badge: '', color: '#3498DB' },
        { id: 'travel', title: 'Travel', subtitle: 'Bus, Train, Flight', icon: 'fa-suitcase-rolling', badge: 'New', color: '#9B59B6' },
      ],

      // Offers
      offers: [
        { code: 'ZYGO20', title: 'FLAT 20% OFF', desc: 'On All City Rides', bg: '#0C1017', accent: '#FCC82C' },
        { code: 'RENT50', title: 'UP TO 50% OFF', desc: 'On Car & Bike Rentals', bg: '#FCC82C', accent: '#040608' },
        { code: 'PARCEL15', title: 'FLAT 15% OFF', desc: 'On First 3 Parcel Deliveries', bg: '#141A24', accent: '#EFAF19' }
      ],

      // Active booking state
      currentBooking: null
    };

    this.listeners = [];
  }

  getStorage(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  setStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  updateWallet(amount, title, type = 'credit') {
    const num = parseFloat(amount);
    if (isNaN(num)) return;
    this.state.wallet.balance += (type === 'credit' ? num : -num);
    this.state.wallet.transactions.unshift({
      id: 'TXN-' + Math.floor(1000 + Math.random() * 9000),
      type,
      title,
      amount: num,
      date: 'Just Now'
    });
    this.setStorage('zygo_wallet', this.state.wallet);
    this.notify();
  }
}

window.ZygoStore = new ZygoStore();
