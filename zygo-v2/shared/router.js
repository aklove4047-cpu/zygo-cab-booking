/**
 * ZYGO MASTER 2.0 - ROUTER & NAVIGATION ENGINE
 * Real Page Transitions - Zero Alert Popups
 */

class ZygoRouter {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.historyStack = [];
  }

  register(viewId, onMount) {
    this.routes[viewId] = {
      el: document.getElementById(viewId),
      onMount: onMount || null
    };
  }

  navigate(viewId, data = null) {
    if (window.ZygoSoundEngine) {
      window.ZygoSoundEngine.playTapSound();
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
      window.scrollTo(0, 0);
      if (typeof target.onMount === 'function') {
        target.onMount(data);
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
      this.navigate('view-home');
    }
  }

  updateBottomNav(viewId) {
    document.querySelectorAll('.docked-bottom-nav .nav-tab-item').forEach(btn => {
      const tab = btn.dataset.tab;
      if (
        (tab === 'home' && viewId === 'view-home') ||
        (tab === 'services' && viewId === 'view-services') ||
        (tab === 'activity' && (viewId === 'view-activity' || viewId === 'view-driver-activity')) ||
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

window.ZygoRouter = new ZygoRouter();
