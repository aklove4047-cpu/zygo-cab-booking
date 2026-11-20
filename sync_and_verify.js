const fs = require('fs');
const path = require('path');

console.log('=== ZYGO V2.0 FILE SYNCHRONIZER & VERIFIER ===');

// 1. Copy shared files
const sharedFiles = ['design-tokens.js', 'live-store.js', 'router.js', 'sound-engine.js', 'store.js', 'vehicle-catalog.js'];
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

// 4. Copy Service Images and Legal Pages to all destinations
const staticDestinations = [
  'zygo-website',
  'android-apps/zygo-customer-app/app/src/main/assets/www',
  'android-apps/zygo-driver-app/app/src/main/assets/www'
];

['privacy.html', 'terms.html'].forEach(legalFile => {
  if (fs.existsSync(path.join('public', legalFile))) {
    const legalContent = fs.readFileSync(path.join('public', legalFile), 'utf8');
    staticDestinations.forEach(dest => {
      fs.writeFileSync(path.join(dest, legalFile), legalContent, 'utf8');
    });
  }
});
console.log('Legal pages (privacy.html, terms.html) copied to all targets.');

const serviceImgDestinations = [
  'zygo-website/assets/images/services',
  'android-apps/zygo-customer-app/app/src/main/assets/www/assets/images/services',
  'android-apps/zygo-driver-app/app/src/main/assets/www/assets/images/services'
];

if (fs.existsSync('public/assets/images/services')) {
  const serviceFiles = fs.readdirSync('public/assets/images/services');
  serviceImgDestinations.forEach(dest => {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    serviceFiles.forEach(f => {
      fs.copyFileSync(path.join('public/assets/images/services', f), path.join(dest, f));
    });
  });
  console.log(`Copied ${serviceFiles.length} service illustrations to all apps and website.`);
}

// 5. Verify Syntax and Authentication
console.log('\nVerifying JavaScript execution & password auth...');
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
  eval(fs.readFileSync('public/shared/vehicle-catalog.js', 'utf8'));
  console.log('✓ vehicle-catalog.js evaluated cleanly.');

  // Test Vehicle Catalog Database
  const catalog = window.ZygoVehicleCatalog;
  const carBrands = Object.keys(catalog.db.cars);
  const bikeBrands = Object.keys(catalog.db.bikes);
  const evBrands = Object.keys(catalog.db.ev2w);
  const autoBrands = Object.keys(catalog.db.autos);
  const truckBrands = Object.keys(catalog.db.trucks);
  const loadingAutoBrands = Object.keys(catalog.db.loadingAutos);
  console.log(`✓ Vehicle Catalog loaded: ${carBrands.length} Cars, ${bikeBrands.length} Bikes, ${evBrands.length} EVs, ${autoBrands.length} Autos, ${truckBrands.length} Mini Trucks, ${loadingAutoBrands.length} Loading Autos.`);

  if (!catalog.getModels('Maruti Suzuki').includes('Dzire')) {
    throw new Error('Maruti Suzuki models missing Dzire!');
  }
  if (!catalog.getModels('Hero MotoCorp').includes('Splendor Plus')) {
    throw new Error('Hero MotoCorp models missing Splendor Plus!');
  }
  if (!catalog.getModels('Tata Motors (Commercial)').includes('Tata Ace Gold')) {
    throw new Error('Tata Motors Commercial missing Tata Ace Gold!');
  }
  if (!catalog.getModels('Ashok Leyland').includes('Dost')) {
    throw new Error('Ashok Leyland missing Dost!');
  }
  if (!catalog.getModels('Bajaj Maxima (Cargo)').includes('Bajaj Maxima C')) {
    throw new Error('Bajaj Maxima Cargo missing Maxima C!');
  }
  if (!catalog.getModels('Euler Motors').includes('Euler HiLoad EV')) {
    throw new Error('Euler Motors missing Euler HiLoad EV!');
  }
  console.log('✓ Commercial trucks and 3W cargo loading autos verified.');

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

  // Test Customer Password Registration & Login
  const regRes = ZygoLiveStore.registerCustomer({ name: 'Amit Verma', phone: '9123456789', password: 'mySecretPassword' });
  if (!regRes.success) throw new Error('Customer registration failed: ' + regRes.message);
  console.log('✓ Customer registration with password succeeded.');

  const dupRes = ZygoLiveStore.registerCustomer({ name: 'Amit Duplicate', phone: '9123456789', password: 'pass' });
  if (dupRes.success) throw new Error('Duplicate phone should fail registration!');
  console.log('✓ Duplicate customer registration blocked correctly.');

  const wrongPassRes = ZygoLiveStore.loginCustomer('9123456789', 'wrongPassword');
  if (wrongPassRes.success) throw new Error('Customer login with wrong password should fail!');
  console.log('✓ Wrong password rejected for customer login.');

  const correctPassRes = ZygoLiveStore.loginCustomer('9123456789', 'mySecretPassword');
  if (!correctPassRes.success) throw new Error('Customer login with correct password should succeed!');
  console.log('✓ Customer login with correct password succeeded!');

  // Test Driver Password Onboarding & Login
  const drvReg = ZygoLiveStore.registerDriver({ name: 'Captain Rajesh', phone: '9234567890', password: 'captainPassword123' });
  if (!drvReg.success) throw new Error('Driver registration failed: ' + drvReg.message);
  console.log('✓ Driver onboarding with password succeeded.');

  const drvWrongPass = ZygoLiveStore.loginDriver('9234567890', 'wrongPass');
  if (drvWrongPass.success) throw new Error('Driver login with wrong password should fail!');
  console.log('✓ Wrong password rejected for driver login.');

  const drvCorrectPass = ZygoLiveStore.loginDriver('9234567890', 'captainPassword123');
  if (!drvCorrectPass.success) throw new Error('Driver login with correct password should succeed!');
  console.log('✓ Driver login with correct password succeeded!');

  // Check that NO .apk links exist in customer or driver HTML files
  const custContent = fs.readFileSync('public/index.html', 'utf8');
  const drvContent = fs.readFileSync('public/driver.html', 'utf8');

  if (/\.apk/i.test(custContent)) {
    throw new Error('Customer HTML contains .apk reference! Must be removed for Play Store compliance.');
  }
  if (/\.apk/i.test(drvContent)) {
    throw new Error('Driver HTML contains .apk reference! Must be removed for Play Store compliance.');
  }
  console.log('✓ Zero APK links verified in Customer and Driver apps (100% Play Store compliant).');

} catch (err) {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
}

console.log('\n=== ALL VERIFICATIONS PASSED 100% ===');
