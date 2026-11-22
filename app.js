const categories = [
  { name: 'Home Care & Cleaning', icon: '⌂', services: ['Maid / Housekeeper', 'Home Deep Cleaners', 'Laundry & Ironing (Dhobi / Presswala)'] },
  { name: 'Cooking & Kitchen Help', icon: '♨', services: ['Cook / Chef'] },
  { name: 'Family & Caregiving', icon: '♡', services: ['Babysitter / Nanny', 'Patient Attendant', 'Pet Sitter / Dog Walker'] },
  { name: 'Repair & Maintenance', icon: '⚒', services: ['Electrician', 'Plumber', 'Carpenter', 'Appliance Technician'] },
  { name: 'Outdoor & Support', icon: '✳', services: ['Driver', 'Security Guard / Watchman', 'Gardener', 'Car Washer', 'Delivery & Errand Helper'] }
];

// These are fictional demo profiles. Add real profiles only when the app has a secure backend.
const workers = [
  { name: 'Meera S.', service: 'Cook / Chef', area: 'Green Park', languages: 'Hindi, English', availability: 'Weekday mornings', emoji: '🥘', about: 'Home-style vegetarian meals and weekly meal prep for busy families.' },
  { name: 'Rafiq A.', service: 'Home Deep Cleaners', area: 'Lake View', languages: 'Hindi, Urdu', availability: 'Mon–Sat', emoji: '🧹', about: 'Careful home cleaning, kitchen refreshes, and one-time deep cleans.' },
  { name: 'Anita R.', service: 'Maid / Housekeeper', area: 'Green Park', languages: 'Hindi, Bengali', availability: 'Flexible hours', emoji: '🏡', about: 'Friendly household support and help keeping daily routines on track.' },
  { name: 'Joseph D.', service: 'Cook / Chef', area: 'Old Town', languages: 'English, Tamil', availability: 'Evenings', emoji: '🍲', about: 'Comforting home meals, including simple family dinners and lunch boxes.' },
  { name: 'Farah K.', service: 'Maid / Housekeeper', area: 'Old Town', languages: 'Hindi, English', availability: 'Tue–Sun', emoji: '✨', about: 'Reliable regular household help with attention to the small details.' },
  { name: 'Lata P.', service: 'Maid / Housekeeper', area: 'Lake View', languages: 'Hindi, Marathi', availability: 'Weekday afternoons', emoji: '🌼', about: 'Practical help with everyday household tasks.' }
];

const categoryGrid = document.querySelector('#categoryGrid');
const categoryView = document.querySelector('#categoryView');
const homeScreen = document.querySelector('#homeScreen');
const categoryPage = document.querySelector('#categoryPage');
const categoryTitle = document.querySelector('#categoryTitle');
const categoryIntro = document.querySelector('#categoryIntro');
const serviceFilters = document.querySelector('#serviceFilters');
const grid = document.querySelector('#workerGrid');
const searchInput = document.querySelector('#searchInput');
const resultCount = document.querySelector('#resultCount');
const emptyState = document.querySelector('#emptyState');
const profileDialog = document.querySelector('#profileDialog');
const dialogContent = document.querySelector('#dialogContent');
let selectedCategory = null;
let selectedService = 'all';

function categoryMarkup(category, index) {
  return `<button class="category-card" type="button" data-category="${index}">
    <span class="category-icon" aria-hidden="true">${category.icon}</span>
    <span class="category-card-copy"><strong>${category.name}</strong><small>${category.services.length} services</small>
      <span class="category-examples">${category.services.slice(0, 2).join(' · ')}${category.services.length > 2 ? ' · more' : ''}</span>
    </span><span class="category-arrow" aria-hidden="true">→</span>
  </button>`;
}

function serviceButtonMarkup(service, isActive) {
  const label = service === 'all' ? 'All services' : service;
  return `<button class="service-filter${isActive ? ' active' : ''}" type="button" data-service="${service}" aria-pressed="${isActive}">${label}</button>`;
}

function openCategory(index) {
  selectedCategory = categories[index];
function categorySlug(category) {
  return category.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function showCategory(category) {
  selectedCategory = category;
  selectedService = 'all';
  searchInput.value = '';
  categoryTitle.textContent = selectedCategory.name;
  categoryIntro.textContent = `Browse ${selectedCategory.services.join(', ')}. The profiles shown are fictional examples.`;
  serviceFilters.innerHTML = [serviceButtonMarkup('all', true), ...selectedCategory.services.map(service => serviceButtonMarkup(service, false))].join('');
  categoryGrid.hidden = true;
  categoryView.hidden = false;
  homeScreen.hidden = true;
  categoryPage.hidden = false;
  renderWorkers();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function showHome() {
  selectedCategory = null;
  categoryPage.hidden = true;
  homeScreen.hidden = false;
}

function renderRoute() {
  const route = location.hash.startsWith('#category/') ? location.hash.slice('#category/'.length) : '';
  const category = categories.find(item => categorySlug(item) === route);
  if (category) showCategory(category);
  else showHome();
}

function cardMarkup(worker, index) {
  return `<article class="worker-card" tabindex="0" role="button" aria-label="View ${worker.name}'s ${worker.service} profile" data-index="${index}">
    <div class="worker-top"><div class="avatar" aria-hidden="true">${worker.emoji}</div><div><div class="worker-name">${worker.name}</div><div class="worker-meta">⌖ ${worker.area}</div></div></div>
    <span class="service-pill">${worker.service}</span><p class="worker-bio">${worker.about}</p>
    <div class="card-foot"><span class="availability">● ${worker.availability}</span><span class="view-link">View profile →</span></div>
  </article>`;
}

function renderWorkers() {
  if (!selectedCategory) return;
  const query = searchInput.value.trim().toLowerCase();
  const matches = workers.map((worker, index) => ({ worker, index })).filter(({worker}) =>
    selectedCategory.services.includes(worker.service) &&
    (selectedService === 'all' || worker.service === selectedService) &&
    `${worker.name} ${worker.service} ${worker.area} ${worker.languages} ${worker.about}`.toLowerCase().includes(query)
  );
  grid.innerHTML = matches.map(({worker,index}) => cardMarkup(worker,index)).join('');
  resultCount.textContent = `${matches.length} sample ${matches.length === 1 ? 'profile' : 'profiles'}`;
  emptyState.hidden = matches.length > 0;
}

categoryGrid.innerHTML = categories.map(categoryMarkup).join('');
categoryGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-category]');
  if (card) openCategory(Number(card.dataset.category));
  if (card) {
    const category = categories[Number(card.dataset.category)];
    location.hash = `category/${categorySlug(category)}`;
  }
});

document.querySelector('#backToCategories').addEventListener('click', () => {
  selectedCategory = null;
  categoryView.hidden = true;
  categoryGrid.hidden = false;
  categoryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

function showProfile(worker) {
  dialogContent.innerHTML = `<p class="eyebrow">SAMPLE PROFESSIONAL</p><div class="profile-detail"><div class="avatar">${worker.emoji}</div><div><h3>${worker.name}</h3><p>⌖ ${worker.area} · ${worker.languages}</p></div></div><span class="service-pill">${worker.service}</span><p class="detail-bio">${worker.about}</p><div class="detail-facts"><b>Availability</b> · ${worker.availability}<br><b>Area</b> · ${worker.area}<br><b>Languages</b> · ${worker.languages}</div><p class="demo-disclaimer">This is a fictional demo profile. Contact details will be added only when real listings are supported.</p>`;
  profileDialog.showModal();
}

grid.addEventListener('click', event => {
  const card = event.target.closest('.worker-card');
  if (card) showProfile(workers[Number(card.dataset.index)]);
});

grid.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.worker-card')) {
    event.preventDefault();
    showProfile(workers[Number(event.target.dataset.index)]);
  }
});

searchInput.addEventListener('input', renderWorkers);

function showProfile(worker) {
  dialogContent.innerHTML = `<p class="eyebrow">SAMPLE PROFESSIONAL</p><div class="profile-detail"><div class="avatar">${worker.emoji}</div><div><h3>${worker.name}</h3><p>⌖ ${worker.area} · ${worker.languages}</p></div></div><span class="service-pill">${worker.service}</span><p class="detail-bio">${worker.about}</p><div class="detail-facts"><b>Availability</b> · ${worker.availability}<br><b>Area</b> · ${worker.area}<br><b>Languages</b> · ${worker.languages}</div><p class="demo-disclaimer">This is a fictional demo profile. Contact details will be added only when real listings are supported.</p>`;
  profileDialog.showModal();
}

grid.addEventListener('click', event => {
  const card = event.target.closest('.worker-card');
  if (card) showProfile(workers[Number(card.dataset.index)]);
});

grid.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.worker-card')) {
    event.preventDefault();
    showProfile(workers[Number(event.target.dataset.index)]);
  }
});

searchInput.addEventListener('input', renderWorkers);
serviceFilter.addEventListener('change', renderWorkers);
renderWorkers();

const createDialog = document.querySelector('#createDialog');
document.querySelector('#openForm').addEventListener('click', () => createDialog.showModal());

document.querySelector('#createForm').addEventListener('submit', event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  const result = document.querySelector('#previewResult');
  const serviceIcon = values.service.includes('Cook') ? '🥘' : values.service.includes('Clean') || values.service.includes('Maid') ? '🧹' : '🏡';
  result.innerHTML = `<p class="eyebrow">PRIVATE PREVIEW · NOT PUBLISHED</p><div class="profile-detail"><div class="avatar">${serviceIcon}</div><div><h3>${escapeText(values.name)}</h3><p>⌖ ${escapeText(values.area)} · ${escapeText(values.languages || 'Languages not added')}</p></div></div><span class="service-pill">${escapeText(values.service)}</span><p class="detail-bio">${escapeText(values.about)}</p><p class="demo-disclaimer">Your preview exists only in this browser session. It has not been sent or saved to a shared directory.</p>`;
  result.hidden = false;
});

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

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

window.addEventListener('appinstalled', () => {
  installButton.hidden = true;
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
const comingSoonDialog = document.querySelector('#comingSoonDialog');
const comingSoonTitle = document.querySelector('#comingSoonTitle');
const comingSoonMessage = document.querySelector('#comingSoonMessage');
document.querySelectorAll('[data-coming-soon]').forEach(button => {
  button.addEventListener('click', () => {
    const isAdmin = button.dataset.comingSoon === 'admin';
    comingSoonTitle.textContent = isAdmin ? 'Admin Panel' : 'Employer Login';
    comingSoonMessage.textContent = isAdmin
      ? 'The admin panel is not active yet.'
      : 'Employer sign-in is not active yet.';
    comingSoonDialog.showModal();
  });
});
document.querySelector('#closeComingSoon').addEventListener('click', () => comingSoonDialog.close());
