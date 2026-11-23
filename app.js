// Category artwork: keep these PNG files beside index.html and app.js.
const categories = [
  {
    name: 'Home Care & Cleaning',
    image: './home-care-cleaning.png.png',
    services: ['Maid / Housekeeper', 'Home Deep Cleaners', 'Laundry & Ironing (Dhobi / Presswala)']
  },
  {
    name: 'Cooking & Kitchen Help',
    image: './cooking-kitchen-help.png.png',
    services: ['Cook / Chef']
  },
  {
    name: 'Family & Caregiving',
    image: './family-caregiving.png.png',
    services: ['Babysitter / Nanny', 'Patient Attendant', 'Pet Sitter / Dog Walker']
  },
  {
    name: 'Repair & Maintenance',
    image: './repair-maintenance.png.png',
    services: ['Electrician', 'Plumber', 'Carpenter', 'Appliance Technician']
  },
  {
    name: 'Outdoor & Support',
    image: './outdoor-support.png.png',
    services: ['Driver', 'Security Guard / Watchman', 'Gardener', 'Car Washer', 'Delivery & Errand Helper']
  }
];

// Fictional demo profiles only; these are not real workers.
const workers = [
  { name: 'Meera S.', service: 'Cook / Chef', area: 'Green Park', languages: 'Hindi, English', availability: 'Weekday mornings', emoji: '🥘', about: 'Home-style vegetarian meals and weekly meal prep for busy families.' },
  { name: 'Rafiq A.', service: 'Home Deep Cleaners', area: 'Lake View', languages: 'Hindi, Urdu', availability: 'Mon–Sat', emoji: '🧹', about: 'Careful home cleaning, kitchen refreshes, and one-time deep cleans.' },
  { name: 'Anita R.', service: 'Maid / Housekeeper', area: 'Green Park', languages: 'Hindi, Bengali', availability: 'Flexible hours', emoji: '🏡', about: 'Friendly household support and help keeping daily routines on track.' },
  { name: 'Joseph D.', service: 'Cook / Chef', area: 'Old Town', languages: 'English, Tamil', availability: 'Evenings', emoji: '🍲', about: 'Comforting home meals, including simple family dinners and lunch boxes.' },
  { name: 'Farah K.', service: 'Maid / Housekeeper', area: 'Old Town', languages: 'Hindi, English', availability: 'Tue–Sun', emoji: '✨', about: 'Reliable regular household help with attention to the small details.' },
  { name: 'Lata P.', service: 'Maid / Housekeeper', area: 'Lake View', languages: 'Hindi, Marathi', availability: 'Weekday afternoons', emoji: '🌼', about: 'Practical help with everyday household tasks.' }
];

const categoryGrid = document.querySelector('#categoryGrid');
const homeScreen = document.querySelector('#homeScreen');
const categoryPage = document.querySelector('#categoryPage');
const categoryTitle = document.querySelector('#categoryTitle');
const categoryIntro = document.querySelector('#categoryIntro');
const serviceFilters = document.querySelector('#serviceFilters');
const workerGrid = document.querySelector('#workerGrid');
const searchInput = document.querySelector('#searchInput');
const resultCount = document.querySelector('#resultCount');
const emptyState = document.querySelector('#emptyState');
const profileDialog = document.querySelector('#profileDialog');
const dialogContent = document.querySelector('#dialogContent');

let selectedCategory = null;
let selectedService = 'all';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

// Dashboard preview translations. The public home page remains in English for now.
const dashboardTranslations = {
  en: { customerEyebrow: 'CUSTOMER DASHBOARD · DEMO', customerTitle: 'Welcome to NEX PLOYEE+', customerSubtitle: 'Find and keep track of trusted help near you.', providerEyebrow: 'SERVICE PROVIDER DASHBOARD · DEMO', providerTitle: 'Your work, all in one place', providerSubtitle: 'Manage example requests and your service profile.', tabHome: 'Home', tabFind: 'Find Help', tabSaved: 'Saved', tabRequests: 'Requests', tabProfile: 'Profile', tabDashboard: 'Dashboard', tabSchedule: 'Schedule', languageLabel: 'Language', languageNote: 'Your choice is saved in this browser. This demo translates tab names and key headings; other text remains English.', customerHomeTitle: 'What help do you need today?', findTitle: 'Explore services', savedTitle: 'Your saved professionals', customerRequestsTitle: 'Your service requests', profileTitle: 'Profile & preferences', overviewTitle: 'Good work starts with a complete profile', providerRequestsTitle: 'Requests from customers', scheduleTitle: 'Your upcoming work', providerProfileTitle: 'Your skills and preferences' },
  hi: { customerEyebrow: 'ग्राहक डैशबोर्ड · डेमो', customerTitle: 'NEX PLOYEE+ में आपका स्वागत है', customerSubtitle: 'अपने आस-पास भरोसेमंद मदद खोजें और सेव करें।', providerEyebrow: 'सेवा प्रदाता डैशबोर्ड · डेमो', providerTitle: 'आपका काम, एक ही जगह', providerSubtitle: 'नमूना अनुरोध और अपनी सेवा प्रोफ़ाइल देखें।', tabHome: 'होम', tabFind: 'मदद खोजें', tabSaved: 'सेव किए', tabRequests: 'अनुरोध', tabProfile: 'प्रोफ़ाइल', tabDashboard: 'डैशबोर्ड', tabSchedule: 'समय-सारणी', languageLabel: 'भाषा', languageNote: 'चयन इस ब्राउज़र में सेव होता है। इस डेमो में टैब और मुख्य शीर्षक बदलते हैं; बाकी पाठ अंग्रेज़ी में है।', customerHomeTitle: 'आज आपको किस मदद की ज़रूरत है?', findTitle: 'सेवाएँ देखें', savedTitle: 'आपके सेव किए पेशेवर', customerRequestsTitle: 'आपके सेवा अनुरोध', profileTitle: 'प्रोफ़ाइल और पसंद', overviewTitle: 'अच्छे काम की शुरुआत पूरी प्रोफ़ाइल से होती है', providerRequestsTitle: 'ग्राहकों के अनुरोध', scheduleTitle: 'आपका आने वाला काम', providerProfileTitle: 'आपके कौशल और पसंद' },
  ur: { customerEyebrow: 'کسٹمر ڈیش بورڈ · ڈیمو', customerTitle: 'NEX PLOYEE+ میں خوش آمدید', customerSubtitle: 'اپنے قریب قابل اعتماد مدد تلاش کریں اور محفوظ کریں۔', providerEyebrow: 'سروس فراہم کرنے والے کا ڈیش بورڈ · ڈیمو', providerTitle: 'آپ کا کام، ایک ہی جگہ', providerSubtitle: 'نمونہ درخواستیں اور اپنی سروس پروفائل دیکھیں۔', tabHome: 'ہوم', tabFind: 'مدد تلاش کریں', tabSaved: 'محفوظ', tabRequests: 'درخواستیں', tabProfile: 'پروفائل', tabDashboard: 'ڈیش بورڈ', tabSchedule: 'شیڈول', languageLabel: 'زبان', languageNote: 'انتخاب اس براؤزر میں محفوظ ہے۔ اس ڈیمو میں ٹیب اور اہم عنوانات بدلتے ہیں؛ باقی متن انگریزی میں ہے۔', customerHomeTitle: 'آج آپ کو کس مدد کی ضرورت ہے؟', findTitle: 'سروسز دیکھیں', savedTitle: 'آپ کے محفوظ پیشہ ور افراد', customerRequestsTitle: 'آپ کی سروس درخواستیں', profileTitle: 'پروفائل اور ترجیحات', overviewTitle: 'اچھے کام کی شروعات مکمل پروفائل سے ہوتی ہے', providerRequestsTitle: 'صارفین کی درخواستیں', scheduleTitle: 'آپ کا آنے والا کام', providerProfileTitle: 'آپ کی مہارتیں اور ترجیحات' },
  bn: { customerEyebrow: 'গ্রাহক ড্যাশবোর্ড · ডেমো', customerTitle: 'NEX PLOYEE+-এ স্বাগতম', customerSubtitle: 'কাছাকাছি নির্ভরযোগ্য সহায়তা খুঁজুন ও সংরক্ষণ করুন।', providerEyebrow: 'পরিষেবা প্রদানকারী ড্যাশবোর্ড · ডেমো', providerTitle: 'আপনার কাজ, এক জায়গায়', providerSubtitle: 'নমুনা অনুরোধ ও আপনার পরিষেবা প্রোফাইল দেখুন।', tabHome: 'হোম', tabFind: 'সহায়তা খুঁজুন', tabSaved: 'সংরক্ষিত', tabRequests: 'অনুরোধ', tabProfile: 'প্রোফাইল', tabDashboard: 'ড্যাশবোর্ড', tabSchedule: 'সময়সূচি', languageLabel: 'ভাষা', languageNote: 'নির্বাচনটি এই ব্রাউজারে সংরক্ষিত হয়। এই ডেমোতে ট্যাব ও মূল শিরোনাম বদলায়; বাকি লেখা ইংরেজিতে থাকে।', customerHomeTitle: 'আজ আপনার কী সাহায্য দরকার?', findTitle: 'পরিষেবাগুলি দেখুন', savedTitle: 'আপনার সংরক্ষিত পেশাদাররা', customerRequestsTitle: 'আপনার পরিষেবা অনুরোধ', profileTitle: 'প্রোফাইল ও পছন্দ', overviewTitle: 'ভালো কাজ শুরু হয় সম্পূর্ণ প্রোফাইল দিয়ে', providerRequestsTitle: 'গ্রাহকদের অনুরোধ', scheduleTitle: 'আপনার আসন্ন কাজ', providerProfileTitle: 'আপনার দক্ষতা ও পছন্দ' },
  ta: { customerEyebrow: 'வாடிக்கையாளர் டாஷ்போர்டு · டெமோ', customerTitle: 'NEX PLOYEE+க்கு வரவேற்கிறோம்', customerSubtitle: 'அருகிலுள்ள நம்பகமான உதவியைத் தேடி சேமிக்கவும்.', providerEyebrow: 'சேவை வழங்குநர் டாஷ்போர்டு · டெமோ', providerTitle: 'உங்கள் வேலை, ஒரே இடத்தில்', providerSubtitle: 'மாதிரி கோரிக்கைகளையும் உங்கள் சேவை சுயவிவரத்தையும் நிர்வகிக்கவும்.', tabHome: 'முகப்பு', tabFind: 'உதவி தேடுக', tabSaved: 'சேமித்தவை', tabRequests: 'கோரிக்கைகள்', tabProfile: 'சுயவிவரம்', tabDashboard: 'டாஷ்போர்டு', tabSchedule: 'அட்டவணை', languageLabel: 'மொழி', languageNote: 'தேர்வு இந்த உலாவியில் சேமிக்கப்படும். இந்த டெமோவில் தாவல் பெயர்களும் முக்கிய தலைப்புகளும் மாறும்; மற்ற உரை ஆங்கிலத்தில் இருக்கும்.', customerHomeTitle: 'இன்று உங்களுக்கு என்ன உதவி தேவை?', findTitle: 'சேவைகளைப் பார்க்கவும்', savedTitle: 'நீங்கள் சேமித்த தொழில்முனைவோர்', customerRequestsTitle: 'உங்கள் சேவை கோரிக்கைகள்', profileTitle: 'சுயவிவரம் மற்றும் விருப்பங்கள்', overviewTitle: 'முழுமையான சுயவிவரத்தில் நல்ல வேலை தொடங்குகிறது', providerRequestsTitle: 'வாடிக்கையாளர் கோரிக்கைகள்', scheduleTitle: 'உங்கள் வரவிருக்கும் வேலை', providerProfileTitle: 'உங்கள் திறன்கள் மற்றும் விருப்பங்கள்' }
};

function applyDashboardLanguage(language) {
  const translations = dashboardTranslations[language] || dashboardTranslations.en;
  document.documentElement.lang = language;
  document.querySelectorAll('#customerDashboard, #providerDashboard').forEach(dashboard => {
    dashboard.dir = language === 'ur' ? 'rtl' : 'ltr';
  });
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const translated = translations[element.dataset.i18n];
    if (!translated) return;
    const icon = element.querySelector(':scope > span');
    element.innerHTML = icon ? `${icon.outerHTML}${escapeHtml(translated)}` : escapeHtml(translated);
  });
  document.querySelectorAll('[data-language-select]').forEach(select => {
    select.value = language;
  });
  try { localStorage.setItem('nexPployeeLanguage', language); } catch (_) {}
}

function showDashboard(role) {
  homeScreen.hidden = true;
  categoryPage.hidden = true;
  document.querySelector('#customerDashboard').hidden = role !== 'customer';
  document.querySelector('#providerDashboard').hidden = role !== 'provider';
  const prefix = role === 'customer' ? 'customer' : 'provider';
  const firstTab = role === 'customer' ? 'home' : 'dashboard';
  document.querySelectorAll(`[data-${prefix}-tab]`).forEach(button => {
    const active = button.dataset[`${prefix}Tab`] === firstTab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-current', active ? 'page' : 'false');
  });
  document.querySelectorAll(`[data-${prefix}-screen]`).forEach(panel => {
    panel.hidden = panel.dataset[`${prefix}Screen`] !== firstTab;
  });
  let language = 'en';
  try { language = localStorage.getItem('nexPployeeLanguage') || 'en'; } catch (_) {}
  applyDashboardLanguage(language);
  window.scrollTo({ top: 0, behavior: 'auto' });
}

document.querySelectorAll('[data-open-dashboard]').forEach(button => {
  button.addEventListener('click', () => {
    if (typeof closeHeaderMenu === 'function') closeHeaderMenu();
    showDashboard(button.dataset.openDashboard);
  });
});

document.querySelectorAll('[data-back-home]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('#customerDashboard').hidden = true;
    document.querySelector('#providerDashboard').hidden = true;
    categoryPage.hidden = true;
    homeScreen.hidden = false;
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
});

document.querySelectorAll('[data-customer-tab]').forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.dataset.customerTab;
    document.querySelectorAll('[data-customer-tab]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-current', active ? 'page' : 'false');
    });
    document.querySelectorAll('[data-customer-screen]').forEach(panel => { panel.hidden = panel.dataset.customerScreen !== tab; });
  });
});

document.querySelectorAll('[data-provider-tab]').forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.dataset.providerTab;
    document.querySelectorAll('[data-provider-tab]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-current', active ? 'page' : 'false');
    });
    document.querySelectorAll('[data-provider-screen]').forEach(panel => { panel.hidden = panel.dataset.providerScreen !== tab; });
  });
});

document.querySelectorAll('[data-open-public-directory]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('#customerDashboard').hidden = true;
    document.querySelector('#providerDashboard').hidden = true;
    homeScreen.hidden = false;
    categoryPage.hidden = true;
    document.querySelector('#directory').scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelectorAll('[data-language-select]').forEach(select => {
  select.addEventListener('change', () => applyDashboardLanguage(select.value));
});

let savedDashboardLanguage = 'en';
try { savedDashboardLanguage = localStorage.getItem('nexPployeeLanguage') || 'en'; } catch (_) {}
applyDashboardLanguage(savedDashboardLanguage);

function categorySlug(category) {
  return category.name.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function categoryMarkup(category, index) {
  const examples = category.services.slice(0, 2).join(' · ');
  const more = category.services.length > 2 ? ' · more' : '';

  return `<button class="category-card" type="button" data-category="${index}">
    <span class="category-art category-art-${index + 1}">
      <img src="${category.image}" alt="${escapeHtml(category.name)}" loading="lazy" decoding="async">
    </span>
    <span class="category-card-copy">
      <strong>${escapeHtml(category.name)}</strong>
      <small>${category.services.length} ${category.services.length === 1 ? 'service' : 'services'}</small>
      <span class="category-examples">${escapeHtml(examples + more)}</span>
    </span>
    <span class="category-arrow" aria-hidden="true">Explore →</span>
  </button>`;
}

function serviceButtonMarkup(service, active) {
  const label = service === 'all' ? 'All services' : service;
  return `<button class="service-filter${active ? ' active' : ''}" type="button" data-service="${escapeHtml(service)}" aria-pressed="${active}">${escapeHtml(label)}</button>`;
}

function renderCategory(category) {
  selectedCategory = category;
  selectedService = 'all';
  searchInput.value = '';
  categoryTitle.textContent = category.name;
  categoryIntro.textContent = `Browse ${category.services.join(', ')}. The profiles shown are fictional examples.`;
  serviceFilters.innerHTML = [
    serviceButtonMarkup('all', true),
    ...category.services.map(service => serviceButtonMarkup(service, false))
  ].join('');
  homeScreen.hidden = true;
  categoryPage.hidden = false;
  renderWorkers();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function showHome() {
  selectedCategory = null;
  categoryPage.hidden = true;
  homeScreen.hidden = false;
}

function renderRoute() {
  const slug = location.hash.startsWith('#category/')
    ? location.hash.slice('#category/'.length)
    : '';
  const category = categories.find(item => categorySlug(item) === slug);
  if (category) renderCategory(category);
  else showHome();
}

function workerCardMarkup(worker, index) {
  return `<article class="worker-card" tabindex="0" role="button" aria-label="View ${escapeHtml(worker.name)}'s ${escapeHtml(worker.service)} profile" data-index="${index}">
    <div class="worker-top">
      <div class="avatar" aria-hidden="true">${worker.emoji}</div>
      <div><div class="worker-name">${escapeHtml(worker.name)}</div><div class="worker-meta">⌖ ${escapeHtml(worker.area)}</div></div>
    </div>
    <span class="service-pill">${escapeHtml(worker.service)}</span>
    <p class="worker-bio">${escapeHtml(worker.about)}</p>
    <div class="card-foot"><span class="availability">● ${escapeHtml(worker.availability)}</span><span class="view-link">View profile →</span></div>
  </article>`;
}

function renderWorkers() {
  if (!selectedCategory) return;
  const query = searchInput.value.trim().toLowerCase();
  const matches = workers
    .map((worker, index) => ({ worker, index }))
    .filter(({ worker }) => selectedCategory.services.includes(worker.service))
    .filter(({ worker }) => selectedService === 'all' || worker.service === selectedService)
    .filter(({ worker }) => `${worker.name} ${worker.service} ${worker.area} ${worker.languages} ${worker.about}`.toLowerCase().includes(query));

  workerGrid.innerHTML = matches.map(({ worker, index }) => workerCardMarkup(worker, index)).join('');
  resultCount.textContent = `${matches.length} sample ${matches.length === 1 ? 'profile' : 'profiles'}`;
  emptyState.hidden = matches.length > 0;
}

function showProfile(worker) {
  dialogContent.innerHTML = `<p class="eyebrow">SAMPLE PROFESSIONAL</p>
    <div class="profile-detail"><div class="avatar" aria-hidden="true">${worker.emoji}</div>
      <div><h3>${escapeHtml(worker.name)}</h3><p>⌖ ${escapeHtml(worker.area)} · ${escapeHtml(worker.languages)}</p></div>
    </div>
    <span class="service-pill">${escapeHtml(worker.service)}</span>
    <p class="detail-bio">${escapeHtml(worker.about)}</p>
    <div class="detail-facts"><b>Availability</b> · ${escapeHtml(worker.availability)}<br>
      <b>Area</b> · ${escapeHtml(worker.area)}<br><b>Languages</b> · ${escapeHtml(worker.languages)}</div>
    <p class="demo-disclaimer">This is a fictional demo profile. Contact details will be added only when real listings are supported.</p>`;
  profileDialog.showModal();
}

categoryGrid.innerHTML = categories.map(categoryMarkup).join('');
categoryGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-category]');
  if (!card) return;
  const category = categories[Number(card.dataset.category)];
  if (category) location.hash = `category/${categorySlug(category)}`;
});

document.querySelector('#backToCategories').addEventListener('click', () => {
  location.hash = 'directory';
});
window.addEventListener('hashchange', renderRoute);
renderRoute();

serviceFilters.addEventListener('click', event => {
  const button = event.target.closest('[data-service]');
  if (!button) return;
  selectedService = button.dataset.service;
  serviceFilters.querySelectorAll('[data-service]').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderWorkers();
});

workerGrid.addEventListener('click', event => {
  const card = event.target.closest('.worker-card');
  if (card) showProfile(workers[Number(card.dataset.index)]);
});
workerGrid.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.worker-card')) {
    event.preventDefault();
    showProfile(workers[Number(event.target.dataset.index)]);
  }
});
searchInput.addEventListener('input', renderWorkers);

const createDialog = document.querySelector('#createDialog');
document.querySelector('#openForm').addEventListener('click', () => createDialog.showModal());
document.querySelector('#createForm').addEventListener('submit', event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  const icon = values.service.includes('Cook') ? '🥘' : values.service.includes('Clean') || values.service.includes('Maid') ? '🧹' : '🏡';
  const result = document.querySelector('#previewResult');
  result.innerHTML = `<p class="eyebrow">PRIVATE PREVIEW · NOT PUBLISHED</p>
    <div class="profile-detail"><div class="avatar" aria-hidden="true">${icon}</div>
      <div><h3>${escapeHtml(values.name)}</h3><p>⌖ ${escapeHtml(values.area)} · ${escapeHtml(values.languages || 'Languages not added')}</p></div>
    </div><span class="service-pill">${escapeHtml(values.service)}</span>
    <p class="detail-bio">${escapeHtml(values.about)}</p>
    <p class="demo-disclaimer">Your preview exists only in this browser session. It has not been sent or saved to a shared directory.</p>`;
  result.hidden = false;
});

let installPrompt;
const installButton = document.querySelector('#installButton');
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
});
window.addEventListener('appinstalled', () => { installButton.hidden = true; });

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

const menuToggle = document.querySelector('#menuToggle');
const mainMenu = document.querySelector('#mainMenu');

function closeHeaderMenu() {
  mainMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}

menuToggle.addEventListener('click', () => {
  const isOpening = mainMenu.hidden;
  mainMenu.hidden = !isOpening;
  menuToggle.setAttribute('aria-expanded', String(isOpening));
  menuToggle.setAttribute('aria-label', isOpening ? 'Close menu' : 'Open menu');
});

document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.topbar-actions')) closeHeaderMenu();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mainMenu.hidden) closeHeaderMenu();
});

