// Category artwork: keep these PNG files beside index.html and app.js.
const categories = [
  {
    name: 'Home Care & Cleaning',
    image: './home-care-cleaning.png',
    image: './home-care-cleaning.png.png',
    services: ['Maid / Housekeeper', 'Home Deep Cleaners', 'Laundry & Ironing (Dhobi / Presswala)']
  },
  {
    name: 'Cooking & Kitchen Help',
    image: './cooking-kitchen-help.png',
    image: './cooking-kitchen-help.png.png',
    services: ['Cook / Chef']
  },
  {
    name: 'Family & Caregiving',
    image: './family-caregiving.png',
    image: './family-caregiving.png.png',
    services: ['Babysitter / Nanny', 'Patient Attendant', 'Pet Sitter / Dog Walker']
  },
  {
    name: 'Repair & Maintenance',
    image: './repair-maintenance.png',
    image: './repair-maintenance.png.png',
    services: ['Electrician', 'Plumber', 'Carpenter', 'Appliance Technician']
  },
  {
    name: 'Outdoor & Support',
    image: './outdoor-support.png',
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
