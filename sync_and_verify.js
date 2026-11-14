const fs = require('fs');
const path = require('path');

console.log('=== ZYGO V2.0 FILE SYNCHRONIZER & VERIFIER ===');

// 1. Copy shared files
const sharedFiles = ['design-tokens.js', 'live-store.js', 'router.js', 'sound-engine.js', 'store.js'];
const sharedDestinations = [
  'public/shared',
  'zygo-website/shared',
  'android-apps/zygo-customer-app/app/src/main/assets/www/shared',
  'android-apps/zygo-driver-app/app/src/main/assets/www/shared'
];

sharedDestinations.forEach(dest => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  sharedFiles.forEach(file => {
    const srcPath = path.join('zygo-v2/shared', file);
    if (fs.existsSync(srcPath)) {
      const content = fs.readFileSync(srcPath, 'utf8');
      fs.writeFileSync(path.join(dest, file), content, 'utf8');
    }
  });
});
console.log('Shared files copied to all 4 targets.');

// 2. Process Customer App (index.html)
let custHtml = fs.readFileSync('zygo-v2/customer/index.html', 'utf8');
// Fix relative paths
custHtml = custHtml.replace(/\.\.\/shared\//g, 'shared/').replace(/\.\.\/assets\//g, 'assets/');

// Ensure view-terms and view-privacy views exist in customer index
if (!custHtml.includes('id="view-terms"')) {
  const termsViews = `
    <!-- ================= VIEW 23: TERMS OF SERVICE ================= -->
    <div id="view-terms" class="view-screen">
      <div class="subpage-header">
        <div class="subpage-back-btn" onclick="ZygoRouter.goBack()">
          <i class="fa-solid fa-arrow-left"></i>
        </div>
        <div class="subpage-title">Terms of Service</div>
        <div style="width: 40px;"></div>
      </div>
      <div style="padding: 20px;">
        <div class="clay-box-white">
          <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 8px;">ZYGO Rider Agreement</h3>
          <p style="font-size: 13px; color: #64748B; line-height: 1.5;">ZYGO provides digital aggregator mobility services connecting independent driver partners and riders. Transparent meter pricing with 0% surge charges is guaranteed across all standard city transit.</p>
        </div>
      </div>
    </div>

    <!-- ================= VIEW 24: PRIVACY POLICY ================= -->
    <div id="view-privacy" class="view-screen">
      <div class="subpage-header">
        <div class="subpage-back-btn" onclick="ZygoRouter.goBack()">
          <i class="fa-solid fa-arrow-left"></i>
        </div>
        <div class="subpage-title">Privacy Policy</div>
        <div style="width: 40px;"></div>
      </div>
      <div style="padding: 20px;">
        <div class="clay-box-white">
          <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 8px;">Data & Location Privacy</h3>
          <p style="font-size: 13px; color: #64748B; line-height: 1.5;">Your GPS coordinates and personal contact details are 256-bit encrypted. Contact numbers are masked between riders and driver partners for privacy protection.</p>
        </div>
      </div>
    </div>
  `;
  custHtml = custHtml.replace('<!-- ================= DOCKED BOTTOM NAVIGATION', termsViews + '\n    <!-- ================= DOCKED BOTTOM NAVIGATION');
  
  // Register in router
  custHtml = custHtml.replace("ZygoRouter.register('view-profile', initProfileScreen);", "ZygoRouter.register('view-profile', initProfileScreen);\n      ZygoRouter.register('view-terms');\n      ZygoRouter.register('view-privacy');");
}

fs.writeFileSync('public/index.html', custHtml, 'utf8');
fs.writeFileSync('zygo-website/index.html', custHtml, 'utf8');
fs.writeFileSync('android-apps/zygo-customer-app/app/src/main/assets/www/index.html', custHtml, 'utf8');
console.log('Customer HTML written to public, website, and customer APK assets.');

// 3. Process Driver App (driver.html)
let drvHtml = fs.readFileSync('zygo-v2/driver/index.html', 'utf8');
drvHtml = drvHtml.replace(/\.\.\/shared\//g, 'shared/').replace(/\.\.\/assets\//g, 'assets/');

fs.writeFileSync('public/driver.html', drvHtml, 'utf8');
fs.writeFileSync('zygo-website/driver.html', drvHtml, 'utf8');
fs.writeFileSync('android-apps/zygo-driver-app/app/src/main/assets/www/driver.html', drvHtml, 'utf8');
console.log('Driver HTML written to public, website, and driver APK assets.');

// 4. Verify Syntax
console.log('\nVerifying JavaScript execution...');
const mockGlobal = {
  window: {},
  document: {
    addEventListener: () => {},
    getElementById: (id) => ({ id, style: {}, classList: { add: () => {}, remove: () => {} } }),
    querySelectorAll: () => [],
    querySelector: () => ({ style: {} })
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }
};

mockGlobal.window = mockGlobal;
global.window = mockGlobal;
global.document = mockGlobal.document;
global.localStorage = mockGlobal.localStorage;

try {
  eval(fs.readFileSync('public/shared/sound-engine.js', 'utf8'));
  console.log('✓ sound-engine.js evaluated cleanly.');
  eval(fs.readFileSync('public/shared/router.js', 'utf8'));
  console.log('✓ router.js evaluated cleanly.');
  eval(fs.readFileSync('public/shared/live-store.js', 'utf8'));
  console.log('✓ live-store.js evaluated cleanly.');

  // Test ZygoRouter instance methods
  ZygoRouter.register('view-auth');
  ZygoRouter.register('view-home');
  ZygoRouter.navigate('view-auth');
  console.log('✓ ZygoRouter.navigate("view-auth") succeeded! Active route:', ZygoRouter.currentRoute);

  ZygoRouter.navigate('view-home');
  console.log('✓ ZygoRouter.navigate("view-home") succeeded! Active route:', ZygoRouter.currentRoute);

  // Test Driver Router
  ZygoRouter.register('view-driver-auth');
  ZygoRouter.register('view-driver-home');
  ZygoRouter.navigate('view-driver-auth');
  console.log('✓ ZygoRouter.navigate("view-driver-auth") succeeded! Active route:', ZygoRouter.currentRoute);
  ZygoRouter.navigate('view-driver-home');
  console.log('✓ ZygoRouter.navigate("view-driver-home") succeeded! Active route:', ZygoRouter.currentRoute);

} catch (err) {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
}

console.log('\n=== ALL VERIFICATIONS PASSED 100% ===');
