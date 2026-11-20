/**
 * ZYGO MASTER 2.0 - COMPLETE INDIA VEHICLE CATALOG
 * Comprehensive database of all 2-Wheelers, 4-Wheelers, Electric Vehicles & Autos
 */

const ZYGO_VEHICLE_DATABASE = {
  // ================= 4-WHEELERS (CARS & CABS) =================
  cars: {
    "Maruti Suzuki": [
      "Dzire", "Swift", "Wagon R", "Baleno", "Alto K10", "Ertiga", "Brezza", 
      "Grand Vitara", "Fronx", "Celerio", "S-Presso", "Ignis", "XL6", "Invicto", "Jimny", "Eeco"
    ],
    "Hyundai": [
      "Aura", "Grand i10 Nios", "i20", "Exter", "Venue", "Creta", "Creta Electric", 
      "Verna", "Alcazar", "Tucson", "Ioniq 5"
    ],
    "Tata Motors": [
      "Tiago", "Tiago EV", "Tigor", "Tigor EV", "Altroz", "Punch", "Punch EV", 
      "Nexon", "Nexon EV", "Curvv", "Curvv EV", "Harrier", "Harrier EV", "Safari", "Sierra"
    ],
    "Mahindra": [
      "Bolero", "Bolero Neo", "Bolero Neo Plus", "Thar", "Thar Roxx", "Scorpio Classic", 
      "Scorpio-N", "XUV 3XO", "XUV700", "Marazzo", "BE 6", "XEV 9e", "XEV 9S"
    ],
    "Toyota": [
      "Glanza", "Urban Cruiser Taisor", "Urban Cruiser Hyryder", "Rumion", 
      "Innova Crysta", "Innova Hycross", "Fortuner", "Fortuner Legender", "Hilux", "Camry", "Vellfire", "Land Cruiser 300"
    ],
    "Kia": [
      "Sonet", "Syros", "Seltos", "Carens", "Carens Clavis", "Carens Clavis EV", "EV6", "EV9"
    ],
    "Honda": [
      "Amaze", "City", "Elevate"
    ],
    "Renault": [
      "Kwid", "Triber", "Kiger", "Duster"
    ],
    "Nissan": [
      "Magnite", "X-Trail"
    ],
    "MG Motor": [
      "Comet EV", "Windsor EV", "ZS EV", "Astor", "Hector", "Hector Plus", "Gloster", "Cyberster", "M9"
    ],
    "Skoda": [
      "Kylaq", "Kushaq", "Slavia", "Kodiaq", "Superb"
    ],
    "Volkswagen": [
      "Taigun", "Virtus", "Tiguan", "Golf GTI"
    ],
    "Citroën": [
      "C3", "ë-C3", "Aircross", "Basalt", "C5 Aircross"
    ],
    "Jeep": [
      "Compass", "Meridian", "Wrangler", "Grand Cherokee"
    ],
    "BYD": [
      "Atto 3", "eMAX 7", "Seal", "Sealion 7"
    ],
    "VinFast": [
      "VF 6", "VF 7", "VF 8"
    ],
    "Isuzu": [
      "D-Max", "V-Cross", "Hi-Lander", "MU-X"
    ],
    "Force Motors": [
      "Gurkha", "Urbania", "Trax Cruiser"
    ]
  },

  // ================= 2-WHEELERS (BIKES & SCOOTERS) =================
  bikes: {
    "Hero MotoCorp": [
      "HF Deluxe", "Splendor Plus", "Splendor Plus XTEC", "Super Splendor XTEC", "Passion Plus", 
      "Glamour", "Glamour X", "Xtreme 125R", "Xtreme 160R", "Xtreme 160R 4V", "Xtreme 200S 4V", 
      "Xpulse 200 4V", "Xpulse 210", "Karizma XMR", "Mavrick 440", "Hunk 150", "Destini 125", 
      "Pleasure Plus", "Xoom 110", "Xoom 125", "Xoom 160"
    ],
    "Honda Motorcycle & Scooter": [
      "Activa", "Activa 125", "Shine 100", "Shine 125", "SP125", "Dio", "Dio 125", 
      "Unicorn", "Livo", "Hornet 2.0", "NX200", "CB350", "H'ness CB350", "CB350RS", 
      "CB300F", "CB300R", "CB650R", "CBR650R", "Transalp XL750", "Africa Twin", "Gold Wing", 
      "Activa e:", "QC1"
    ],
    "TVS Motor": [
      "Jupiter", "Jupiter 125", "Raider 125", "Apache RTR 160", "Apache RTR 160 4V", 
      "Apache RTR 180", "Apache RTR 200 4V", "Apache RR 310", "Ronin", "Apache RTX 300", 
      "NTORQ 125", "Sport", "Radeon", "Star City Plus", "Zest 110", "iQube", "X", "Orbiter"
    ],
    "Bajaj Auto": [
      "Pulsar 125", "Pulsar NS125", "Pulsar 150", "Pulsar N150", "Pulsar NS160", "Pulsar N160", 
      "Pulsar NS200", "Pulsar N250", "Pulsar F250", "Pulsar RS200", "CT 110", "Platina 100", 
      "Platina 110", "Freedom 125", "Dominar 250", "Dominar 400", "Avenger Street 160", 
      "Avenger Cruise 220", "Chetak Electric"
    ],
    "Royal Enfield": [
      "Classic 350", "Bullet 350", "Hunter 350", "Meteor 350", "Goan Classic 350", 
      "Himalayan 450", "Guerrilla 450", "Scram 440", "Classic 650", "Interceptor 650", 
      "Continental GT 650", "Super Meteor 650", "Shotgun 650", "Bear 650", "Flying Flea C6"
    ],
    "Yamaha": [
      "FZ-FI", "FZ-S FI", "FZ-X", "MT-15", "R15 V4", "R15M", "R3", "R7", "MT-03", 
      "XSR 155", "Fascino 125", "Ray ZR 125", "Aerox 155"
    ],
    "Suzuki 2-Wheelers": [
      "Access 125", "Burgman Street", "Avenis 125", "e-Access", "Gixxer", "Gixxer SF", 
      "Gixxer 250", "Gixxer SF 250", "V-Strom SX", "V-Strom 800DE", "Hayabusa", "GSX-8R"
    ],
    "KTM": [
      "200 Duke", "250 Duke", "390 Duke", "125 Duke", "160 Duke", "390 Adventure", 
      "390 Adventure X", "390 Enduro R", "RC 125", "RC 200", "RC 390", "790 Duke", 
      "890 Adventure", "1290 Super Adventure"
    ],
    "Aprilia": [
      "SR 125", "SR 160", "SR GT 200", "SXR 125", "SXR 160", "RS 457", "Tuono 457", "RSV4", "Tuono V4"
    ],
    "Vespa": [
      "Vespa 125", "Vespa S 125", "Vespa VXL 125", "Vespa ZX 125", "Vespa 150", "Vespa SXL 150", "Elettrica"
    ],
    "Jawa": [
      "Jawa 42", "Jawa 42 FJ", "Jawa 350", "Jawa Perak", "Jawa 42 Bobber"
    ],
    "Yezdi": [
      "Roadster", "Adventure", "Scrambler"
    ],
    "Triumph": [
      "Speed 400", "Scrambler 400 X", "Scrambler 400 XC", "Speed T4", "Trident 660", 
      "Daytona 660", "Tiger Sport 660", "Street Triple 765", "Tiger 900", "Tiger 1200", 
      "Bonneville T100", "Bonneville T120", "Speed Twin 900", "Speed Twin 1200", 
      "Scrambler 900", "Scrambler 1200", "Rocket 3"
    ],
    "Harley-Davidson": [
      "X440", "Nightster", "Sportster S", "Fat Boy", "Heritage Classic", "Street Bob", 
      "Low Rider S", "Low Rider ST", "Fat Bob", "Pan America 1250", "Road Glide", "Street Glide"
    ],
    "BMW Motorrad": [
      "G 310 R", "G 310 GS", "G 310 RR", "F 450 GS", "F 900 GS", "F 900 GS Adventure", 
      "F 900 R", "F 900 XR", "R 12", "R 12 nineT", "R 1300 GS", "R 1300 GS Adventure", 
      "S 1000 RR", "S 1000 R", "S 1000 XR", "M 1000 RR", "R 18"
    ],
    "Kawasaki": [
      "Ninja 300", "Ninja 500", "Ninja 650", "Ninja ZX-4R", "Ninja ZX-6R", "Ninja ZX-10R", 
      "Ninja H2", "Z650", "Z900", "Z H2", "Versys 650", "Versys 1100", "Vulcan S", 
      "W175", "KLX 230", "KX Series"
    ],
    "Ducati": [
      "Monster", "Scrambler Icon", "Scrambler Full Throttle", "Panigale V2", "Panigale V4", 
      "Streetfighter V2", "Streetfighter V4", "Multistrada V2", "Multistrada V4", 
      "DesertX", "Diavel V4", "XDiavel V4", "Hypermotard"
    ],
    "Other International Brands": [
      "Benelli TNT 300", "Benelli TRK 502", "Benelli Leoncino 500", "Keeway SR125", 
      "Keeway K-Light 250V", "Keeway V302C", "Keeway Vieste 300", "QJ Motor SRC 250", 
      "QJ Motor SRK 400", "QJ Motor SRV 300", "Zontes 350R", "Zontes 350T", "Zontes 350X", 
      "Husqvarna Vitpilen 250", "Husqvarna Svartpilen 401", "BSA Gold Star 650", 
      "Brixton Crossfire 500", "Brixton Cromwell 1200", "Moto Guzzi V85 TT", 
      "Moto Guzzi V100 Mandello", "Indian Scout", "Indian Chief", "CFMoto 300NK", 
      "CFMoto 650NK", "Norton Commando"
    ]
  },

  // ================= ELECTRIC 2-WHEELERS =================
  ev2w: {
    "Ather Energy": [
      "450X", "450S", "450 Apex", "Rizta"
    ],
    "Ola Electric": [
      "S1 Pro", "S1 X", "S1 X+", "S1 Pro+", "S1 Z", "Roadster", "Roadster X", "Roadster Pro"
    ],
    "Hero VIDA": [
      "V2 Plus", "V2 Lite", "V2 Pro", "VX2"
    ],
    "Revolt Motors": [
      "RV400", "RV1", "RV1+"
    ],
    "Ultraviolette": [
      "F77", "F77 SuperStreet", "X-47"
    ],
    "Oben Electric": [
      "Rorr", "Rorr EZ"
    ],
    "Matter": [
      "Aera"
    ],
    "Tork Motors": [
      "Kratos R", "Kratos"
    ],
    "Raptee": [
      "T30"
    ],
    "Komaki": [
      "Ranger", "MX3", "XGT"
    ],
    "PURE EV": [
      "ecoDryft", "eTryst", "EPluto", "ETrance"
    ],
    "Kabira Mobility": [
      "KM 3000", "KM 4000"
    ],
    "Ampere": [
      "Magnus", "Nexus", "Reo"
    ],
    "Okinawa": [
      "Praise", "Ridge", "iPraise"
    ],
    "BGauss": [
      "C12", "RUV 350"
    ],
    "River": [
      "Indie"
    ],
    "Simple Energy": [
      "One", "OneS", "One Gen 2"
    ],
    "Kinetic Green": [
      "Zing", "Zoom", "E-Luna"
    ]
  },

  // ================= 3-WHEELERS (PASSENGER AUTO RICKSHAWS) =================
  autos: {
    "Bajaj Auto (3W)": [
      "Compact RE CNG", "Compact RE LPG", "Maxima Z", "RE E-TEC 9.0"
    ],
    "Piaggio Ape": [
      "Ape City+", "Ape Auto DX", "Ape E-City FX"
    ],
    "Mahindra (3W)": [
      "Treo Auto EV", "Alfa DX CNG", "Alfa Passenger"
    ],
    "TVS Motor (3W)": [
      "King Deluxe CNG", "King Duramax", "King EV"
    ]
  },

  // ================= THREE-WHEELER LOADING AUTO (CARGO) =================
  loadingAutos: {
    "Piaggio Ape (Cargo)": [
      "Ape Xtra", "Ape Xtra LDX", "Ape Xtra LDX+", "Ape E-Xtra EV"
    ],
    "Bajaj Maxima (Cargo)": [
      "Bajaj Maxima C", "Bajaj Maxima XL Cargo", "Maxima C CNG"
    ],
    "Mahindra Alfa & Zor": [
      "Mahindra Alfa Plus", "Mahindra Alfa Load", "Mahindra Zor Grand EV"
    ],
    "Atul Auto (Cargo)": [
      "Atul Gem Cargo", "Atul Shakti Cargo", "Atul Elite Cargo EV"
    ],
    "TVS Motor (Cargo)": [
      "TVS King Kargo", "TVS King Kargo EV"
    ],
    "Euler Motors": [
      "Euler HiLoad EV"
    ],
    "Omega Seiki Mobility": [
      "Omega Seiki Rage+", "Rage+ Rapid EV", "Rage+ Frost"
    ]
  },

  // ================= MINI TRUCKS & PICKUPS (COMMERCIAL LOGISTICS) =================
  trucks: {
    "Tata Motors (Commercial)": [
      "Tata Ace Gold", "Tata Ace Gold Petrol", "Tata Ace Gold Diesel", "Tata Ace EV", 
      "Tata Intra V10", "Tata Intra V20", "Tata Intra V30", "Tata Intra V50", "Tata Yodha"
    ],
    "Mahindra (Commercial)": [
      "Jeeto", "Jeeto Plus", "Jeeto Strong", "Supro Mini Truck", "Supro Profit Truck", 
      "Bolero Maxx Pik-Up", "Bolero Camper"
    ],
    "Ashok Leyland": [
      "Dost", "Dost Plus", "Dost Strong", "Bada Dost i1", "Bada Dost i2", "Bada Dost i3", "Bada Dost i4"
    ],
    "Maruti Suzuki (Commercial)": [
      "Super Carry", "Super Carry CNG"
    ],
    "Piaggio Commercial": [
      "Ape Xtra", "Ape Xtra LDX"
    ]
  }
};

const ZygoVehicleCatalog = {
  db: ZYGO_VEHICLE_DATABASE,

  getAllBrands() {
    const list = [];
    Object.keys(this.db).forEach(category => {
      Object.keys(this.db[category]).forEach(brand => {
        if (!list.includes(brand)) list.push(brand);
      });
    });
    return list;
  },

  getCategoryBrands(categoryType) {
    if (!categoryType) return this.getAllBrands();
    const cat = categoryType.toLowerCase();
    if (cat.includes('bike')) {
      return [...Object.keys(this.db.bikes), ...Object.keys(this.db.ev2w)];
    }
    if (cat.includes('auto')) {
      return Object.keys(this.db.autos);
    }
    // Default to cars + others
    return Object.keys(this.db.cars);
  },

  getModels(brand) {
    if (!brand) return [];
    for (const cat of Object.keys(this.db)) {
      if (this.db[cat][brand]) {
        return this.db[cat][brand];
      }
    }
    // Fallback: search partial match
    for (const cat of Object.keys(this.db)) {
      for (const b of Object.keys(this.db[cat])) {
        if (b.toLowerCase().includes(brand.toLowerCase()) || brand.toLowerCase().includes(b.toLowerCase())) {
          return this.db[cat][b];
        }
      }
    }
    return ["Standard Model", "Base Variant", "Top Variant", "Custom Model"];
  },

  populateBrandDropdown(brandSelectElement, selectedBrand = 'Maruti Suzuki', filterCategory = null) {
    if (!brandSelectElement) return;
    brandSelectElement.innerHTML = '';

    // Create groups: 4-Wheelers, 2-Wheelers, Electric 2W, Auto Rickshaws, Cargo 3W, Mini Trucks
    const groups = [
      { label: "🚗 Cars & Cabs (4-Wheelers)", brands: Object.keys(this.db.cars) },
      { label: "🚚 Mini Trucks & Pickups (Commercial Logistics)", brands: Object.keys(this.db.trucks) },
      { label: "📦 Three-Wheeler Loading Auto (Cargo)", brands: Object.keys(this.db.loadingAutos) },
      { label: "🛺 Passenger Auto Rickshaws (3-Wheelers)", brands: Object.keys(this.db.autos) },
      { label: "🛵 Bikes & Scooters (2-Wheelers)", brands: Object.keys(this.db.bikes) },
      { label: "⚡ Electric 2-Wheelers (EV)", brands: Object.keys(this.db.ev2w) }
    ];

    let foundSelected = false;

    groups.forEach(g => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = g.label;
      g.brands.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b;
        opt.textContent = b;
        if (b === selectedBrand) {
          opt.selected = true;
          foundSelected = true;
        }
        optgroup.appendChild(opt);
      });
      brandSelectElement.appendChild(optgroup);
    });

    // Add Other option
    const otherGroup = document.createElement('optgroup');
    otherGroup.label = "Other Manufacturers";
    const otherOpt = document.createElement('option');
    otherOpt.value = "Other Brand";
    otherOpt.textContent = "Other Brand / Custom";
    otherGroup.appendChild(otherOpt);
    brandSelectElement.appendChild(otherGroup);

    if (!foundSelected && selectedBrand) {
      const customOpt = document.createElement('option');
      customOpt.value = selectedBrand;
      customOpt.textContent = selectedBrand;
      customOpt.selected = true;
      brandSelectElement.prepend(customOpt);
    }
  },

  populateModelDropdown(brand, modelContainerElement, selectedModel = 'Dzire') {
    if (!modelContainerElement) return;
    const models = this.getModels(brand);

    // If modelContainerElement is a select
    if (modelContainerElement.tagName.toLowerCase() === 'select') {
      modelContainerElement.innerHTML = '';
      let foundSelected = false;
      models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        if (m === selectedModel) {
          opt.selected = true;
          foundSelected = true;
        }
        modelContainerElement.appendChild(opt);
      });

      // Add custom option
      const otherOpt = document.createElement('option');
      otherOpt.value = "Other Model";
      otherOpt.textContent = "Other / Type Custom Model";
      modelContainerElement.appendChild(otherOpt);

      if (!foundSelected && selectedModel) {
        const customOpt = document.createElement('option');
        customOpt.value = selectedModel;
        customOpt.textContent = selectedModel;
        customOpt.selected = true;
        modelContainerElement.prepend(customOpt);
      }
    }
  },

  initDynamicDropdowns(brandSelectId, modelSelectId, customModelInputId, initialBrand = 'Maruti Suzuki', initialModel = 'Dzire') {
    const brandSelect = document.getElementById(brandSelectId);
    const modelSelect = document.getElementById(modelSelectId);
    const customInput = customModelInputId ? document.getElementById(customModelInputId) : null;

    if (!brandSelect || !modelSelect) return;

    this.populateBrandDropdown(brandSelect, initialBrand);
    this.populateModelDropdown(initialBrand, modelSelect, initialModel);

    brandSelect.addEventListener('change', () => {
      const chosenBrand = brandSelect.value;
      this.populateModelDropdown(chosenBrand, modelSelect);
      if (customInput) customInput.style.display = 'none';
    });

    modelSelect.addEventListener('change', () => {
      if (modelSelect.value === 'Other Model') {
        if (customInput) {
          customInput.style.display = 'block';
          customInput.value = '';
          customInput.focus();
        } else {
          const userM = prompt('Enter your vehicle model:');
          if (userM) {
            const newOpt = document.createElement('option');
            newOpt.value = userM;
            newOpt.textContent = userM;
            newOpt.selected = true;
            modelSelect.prepend(newOpt);
          }
        }
      } else if (customInput) {
        customInput.style.display = 'none';
      }
    });
  }
};

if (typeof window !== 'undefined') {
  window.ZygoVehicleCatalog = ZygoVehicleCatalog;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ZYGO_VEHICLE_DATABASE, ZygoVehicleCatalog };
}
