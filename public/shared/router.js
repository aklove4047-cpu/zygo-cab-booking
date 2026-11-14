/**
 * ZYGO MASTER 2.0 - ROUTER & NAVIGATION ENGINE
 * Robust Cross-Platform Router (Browser & Android WebView)
 */

class ZygoRouterCore {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.historyStack = [];
  }

  register(viewId, onMount) {
    const el = document.getElementById(viewId);
    this.routes[viewId] = {
      el: el,
      onMount: onMount || null
    };
  }

  navigate(viewId, data = null, playSound = false) {
    if (playSound && window.ZygoSoundEngine && typeof window.ZygoSoundEngine.playTapSound === 'function') {
      try {
        window.ZygoSoundEngine.playTapSound();
      } catch(e) {}
    }

    // Hide all registered views
    Object.keys(this.routes).forEach(k => {
      const route = this.routes[k];
      if (route && route.el) {
        route.el.style.display = 'none';
      }
    });

    const target = this.routes[viewId];
    if (target && target.el) {
      target.el.style.display = 'block';
      this.currentRoute = viewId;
      this.historyStack.push(viewId);
      if (typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }

      if (typeof target.onMount === 'function') {
        try {
          target.onMount(data);
        } catch(err) {
          console.error('Error in route onMount for', viewId, err);
        }
      }
    } else {
      console.warn('ZygoRouter: Route target not found for id:', viewId);
    }

    // Toggle bottom nav visibility on auth screens
    const bottomNav = document.querySelector('.docked-bottom-nav, .driver-bottom-nav');
    if (bottomNav) {
      if (viewId === 'view-auth' || viewId === 'view-driver-auth') {
        bottomNav.style.display = 'none';
      } else {
        bottomNav.style.display = 'flex';
      }
    }

    // Update bottom nav highlighting
    this.updateBottomNav(viewId);
  }

  goBack() {
    if (this.historyStack.length > 1) {
      this.historyStack.pop(); // remove current
      const prev = this.historyStack.pop(); // take previous
      this.navigate(prev);
    } else {
      if (this.currentRoute && this.currentRoute.startsWith('view-driver-')) {
        this.navigate('view-driver-home');
      } else {
        this.navigate('view-home');
      }
    }
  }

  updateBottomNav(viewId) {
    document.querySelectorAll('.docked-bottom-nav .nav-tab-item, .driver-bottom-nav .driver-tab-item').forEach(btn => {
      const tab = btn.dataset.tab;
      if (
        (tab === 'home' && (viewId === 'view-home' || viewId === 'view-driver-home')) ||
        (tab === 'services' && viewId === 'view-services') ||
        (tab === 'activity' && (viewId === 'view-activity' || viewId === 'view-driver-activity')) ||
        (tab === 'messages' && viewId === 'view-driver-messages') ||
        (tab === 'wallet' && (viewId === 'view-wallet' || viewId === 'view-driver-wallet')) ||
        (tab === 'profile' && (viewId === 'view-profile' || viewId === 'view-driver-profile'))
      ) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// Global Singleton Instance (accessible as both ZygoRouter and window.ZygoRouter)
const zygoRouterInstance = new ZygoRouterCore();
window.ZygoRouter = zygoRouterInstance;
var ZygoRouter = zygoRouterInstance;
