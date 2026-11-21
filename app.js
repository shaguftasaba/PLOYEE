const workers = [
  { name: 'Meera S.', service: 'Cooking', area: 'Green Park', languages: 'Hindi, English', availability: 'Weekday mornings', emoji: '🥘', about: 'Home-style vegetarian meals and weekly meal prep for busy families.' },
  { name: 'Rafiq A.', service: 'Cleaning', area: 'Lake View', languages: 'Hindi, Urdu', availability: 'Mon–Sat', emoji: '🧹', about: 'Careful home cleaning, kitchen refreshes, and one-time deep cleans.' },
  { name: 'Anita R.', service: 'Home help', area: 'Green Park', languages: 'Hindi, Bengali', availability: 'Flexible hours', emoji: '🏡', about: 'Friendly household support, errands, and help keeping daily routines on track.' },
  { name: 'Joseph D.', service: 'Cooking', area: 'Old Town', languages: 'English, Tamil', availability: 'Evenings', emoji: '🍲', about: 'Comforting home meals, including simple family dinners and lunch boxes.' },
  { name: 'Farah K.', service: 'Cleaning', area: 'Old Town', languages: 'Hindi, English', availability: 'Tue–Sun', emoji: '✨', about: 'Reliable regular cleaning with attention to the small details.' },
  { name: 'Lata P.', service: 'Home help', area: 'Lake View', languages: 'Hindi, Marathi', availability: 'Weekday afternoons', emoji: '🌼', about: 'Practical help with household tasks and thoughtful elder companionship.' }
];

const grid = document.querySelector('#workerGrid');
const searchInput = document.querySelector('#searchInput');
const serviceFilter = document.querySelector('#serviceFilter');
const resultCount = document.querySelector('#resultCount');
const emptyState = document.querySelector('#emptyState');
const profileDialog = document.querySelector('#profileDialog');
const dialogContent = document.querySelector('#dialogContent');

function cardMarkup(worker, index) {
  return `<article class="worker-card" tabindex="0" role="button" aria-label="View ${worker.name}'s ${worker.service} profile" data-index="${index}">
    <div class="worker-top"><div class="avatar" aria-hidden="true">${worker.emoji}</div><div><div class="worker-name">${worker.name}</div><div class="worker-meta">⌖ ${worker.area}</div></div></div>
    <span class="service-pill">${worker.service}</span><p class="worker-bio">${worker.about}</p>
    <div class="card-foot"><span class="availability">● ${worker.availability}</span><span class="view-link">View profile →</span></div>
  </article>`;
}

function renderWorkers() {
  const query = searchInput.value.trim().toLowerCase();
  const service = serviceFilter.value;
  const matches = workers.map((worker, index) => ({ worker, index })).filter(({worker}) => (service === 'all' || worker.service === service) && `${worker.name} ${worker.service} ${worker.area} ${worker.languages} ${worker.about}`.toLowerCase().includes(query));
  grid.innerHTML = matches.map(({worker,index}) => cardMarkup(worker,index)).join('');
  resultCount.textContent = `${matches.length} sample ${matches.length === 1 ? 'profile' : 'profiles'}`;
  emptyState.hidden = matches.length > 0;
}

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
  result.innerHTML = `<p class="eyebrow">PRIVATE PREVIEW · NOT PUBLISHED</p><div class="profile-detail"><div class="avatar">${values.service === 'Cooking' ? '🥘' : values.service === 'Cleaning' ? '🧹' : '🏡'}</div><div><h3>${escapeText(values.name)}</h3><p>⌖ ${escapeText(values.area)} · ${escapeText(values.languages || 'Languages not added')}</p></div></div><span class="service-pill">${escapeText(values.service)}</span><p class="detail-bio">${escapeText(values.about)}</p><p class="demo-disclaimer">Your preview exists only in this browser session. It has not been sent or saved to a shared directory.</p>`;
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