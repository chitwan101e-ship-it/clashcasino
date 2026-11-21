const filters = document.querySelectorAll('[data-filter]');
const search = document.querySelector('#game-search');
const coverCount = document.querySelector('#cover-count');
const games = Array.from(document.querySelectorAll('[data-game]'), (card) => ({
  card,
  title: card.querySelector('h3').textContent.toLowerCase()
}));
let category = 'all';
const PREVIEW = 12;
const moreButton = document.querySelector('#gallery-more');
let showAll = false;

function updateGallery() {
  const query = search.value.trim().toLowerCase();
  const matches = [];
  for (const item of games) {
    const isMatch = (category === 'all' || item.card.dataset.game === category) && item.title.includes(query);
    item.card.hidden = !isMatch;
    if (isMatch) matches.push(item.card);
  }
  matches.forEach((card, index) => {
    if (!showAll && index >= PREVIEW) card.hidden = true;
  });
  coverCount.textContent = matches.length === 1 ? '1 cover' : matches.length + ' covers';
  const empty = document.querySelector('#gallery-empty');
  if (empty) empty.hidden = matches.length !== 0;
  if (matches.length <= PREVIEW) {
    showAll = false;
    moreButton.hidden = true;
  } else {
    moreButton.hidden = false;
    moreButton.textContent = showAll ? 'Show fewer covers' : 'View all ' + matches.length + ' covers';
  }
}

for (const filter of filters) {
  filter.addEventListener('click', () => {
    category = filter.dataset.filter;
    for (const option of filters) option.setAttribute('aria-pressed', String(option === filter));
    document.querySelectorAll('[data-world]').forEach((world) => {
      world.setAttribute('aria-pressed', String(world.dataset.world === category));
    });
    updateGallery();
  });
}
search.addEventListener('input', updateGallery);
updateGallery();

const catalog = games.map(({ card }) => ({
  card,
  title: card.querySelector('h3').textContent,
  category: card.dataset.game,
  src: card.querySelector('img').getAttribute('src'),
  alt: card.querySelector('img').getAttribute('alt')
}));
const reelButtons = [...document.querySelectorAll('.reel')];
const reelStatus = document.querySelector('#reel-status');
const spinButton = document.querySelector('#spin-reels');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let spinning = false;
let landed = [catalog[0], catalog[3], catalog[14]];

function pickCover() {
  return catalog[Math.floor(Math.random() * catalog.length)];
}

function showCover(reel, cover) {
  const img = reel.querySelector('img');
  img.src = cover.src;
  img.alt = cover.alt;
  reel.dataset.title = cover.title;
}

function announceLanded() {
  const titles = landed.map((cover) => cover.title).join(' · ');
  const locked = landed.every((cover) => cover.category === landed[0].category);
  reelStatus.textContent = locked ? 'World lock · ' + landed[0].category + ' · ' + titles : titles;
}

function spinReels() {
  if (spinning || !catalog.length) return;
  spinning = true;
  spinButton.disabled = true;
  spinButton.textContent = 'Spinning…';
  reelStatus.textContent = 'Reels in motion';
  document.querySelector('.reels').classList.add('is-spinning');
  landed = [pickCover(), pickCover(), pickCover()];
  if (reduceMotion) {
    reelButtons.forEach((reel, index) => showCover(reel, landed[index]));
    document.querySelector('.reels').classList.remove('is-spinning');
    spinning = false;
    spinButton.disabled = false;
    spinButton.textContent = 'Spin again';
    announceLanded();
    return;
  }
  const timers = [];
  reelButtons.forEach((reel, index) => {
    const tick = setInterval(() => showCover(reel, pickCover()), 70 + index * 15);
    timers.push(tick);
    setTimeout(() => {
      clearInterval(tick);
      showCover(reel, landed[index]);
      if (index === reelButtons.length - 1) {
        document.querySelector('.reels').classList.remove('is-spinning');
        spinning = false;
        spinButton.disabled = false;
        spinButton.textContent = 'Spin again';
        announceLanded();
      }
    }, 700 + index * 280);
  });
}

reelButtons.forEach((reel, index) => showCover(reel, landed[index]));
announceLanded();
spinButton.addEventListener('click', spinReels);
reelButtons.forEach((reel) => {
  reel.addEventListener('click', () => {
    const cover = landed[Number(reel.dataset.reel)];
    if (spinning || !cover || !cover.card) return;
    cover.card.click();
  });
});

const pathSteps = [
  {
    tab: 'path-tab-1',
    kicker: 'Create an account',
    title: 'Sign up in a few seconds',
    copy: 'Open Sign Up on Clash Casino. Enter a username, email, and password of at least 8 characters, then confirm the password. An optional 4-digit invite code can be added. Tick the Terms and Privacy checkbox and tap Register.',
    cta: 'Create account',
    href: 'https://clashcasino.us/register'
  },
  {
    tab: 'path-tab-2',
    kicker: 'Verify email',
    title: 'Unlock the account with a code',
    copy: 'Clash Casino verifies email with a one-time code before the account can be used. Keep the address current. After that, log in with username or email plus password. Forgot password is on the login screen.',
    cta: 'Go to login',
    href: 'https://clashcasino.us/login'
  },
  {
    tab: 'path-tab-3',
    kicker: 'Fund the wallet',
    title: 'Buy balance, then move credits',
    copy: 'Purchases are in US dollars through a third-party processor, from the amounts shown at checkout. Credits land after confirmation. One wallet feeds every game. Adding credits and redeeming them back can take a few moments.',
    cta: 'Open Clash Casino',
    href: 'https://clashcasino.us/'
  },
  {
    tab: 'path-tab-4',
    kicker: 'Add a game and play',
    title: 'Send credits in, then spin',
    copy: 'When you add a game, Clash Casino creates that game account and sends you its login. Play on the game platform, redeem balance to the wallet from the game card, and cash out after identity verification — the site mentions cashouts to your card.',
    cta: 'Browse games',
    href: '#games'
  }
];
const pathTabs = document.querySelectorAll('.play-path [role="tab"]');
const pathPanel = document.querySelector('#path-panel');
const pathKicker = document.querySelector('#path-kicker');
const pathTitle = document.querySelector('#path-title');
const pathCopy = document.querySelector('#path-copy');
const pathCta = document.querySelector('#path-cta');

function showPath(index) {
  const step = pathSteps[index];
  pathTabs.forEach((tab, i) => tab.setAttribute('aria-selected', String(i === index)));
  pathPanel.setAttribute('aria-labelledby', step.tab);
  pathKicker.textContent = step.kicker;
  pathTitle.textContent = step.title;
  pathCopy.textContent = step.copy;
  pathCta.textContent = step.cta;
  pathCta.setAttribute('href', step.href);
}
pathTabs.forEach((tab) => {
  tab.addEventListener('click', () => showPath(Number(tab.dataset.step)));
  tab.addEventListener('keydown', (event) => {
    const current = Number(tab.dataset.step);
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = (current + 1) % pathTabs.length;
      pathTabs[next].focus();
      showPath(next);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = (current - 1 + pathTabs.length) % pathTabs.length;
      pathTabs[prev].focus();
      showPath(prev);
    }
  });
});

moreButton.addEventListener('click', () => {
  showAll = !showAll;
  updateGallery();
});

const worldButtons = document.querySelectorAll('[data-world]');
worldButtons.forEach((world) => {
  world.addEventListener('click', () => {
    const match = [...filters].find((option) => option.dataset.filter === world.dataset.world);
    if (match) match.click();
    worldButtons.forEach((option) => option.setAttribute('aria-pressed', String(option === world)));
    document.querySelector('#games').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const dialog = document.querySelector('#cover-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogTitle = document.querySelector('#dialog-title');
const dialogCat = document.querySelector('#dialog-cat');
games.forEach(({ card }) => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  const open = () => {
    const img = card.querySelector('img');
    dialogImage.src = img.src;
    dialogImage.alt = img.alt;
    dialogTitle.textContent = card.querySelector('h3').textContent;
    dialogCat.textContent = card.dataset.game;
    if (typeof dialog.showModal === 'function') dialog.showModal();
  };
  card.addEventListener('click', open);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
});
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const faqFilters = document.querySelectorAll('[data-faq-filter]');
const faqSearch = document.querySelector('#faq-search');
const faqItems = Array.from(document.querySelectorAll('#faq-list details'));
const faqCount = document.querySelector('#faq-count');
let faqTopic = 'all';
function updateFaq() {
  const query = faqSearch.value.trim().toLowerCase();
  let visible = 0;
  for (const item of faqItems) {
    const text = (item.querySelector('summary').textContent + ' ' + item.querySelector('p').textContent).toLowerCase();
    const matchTopic = faqTopic === 'all' || item.dataset.faq === faqTopic;
    const matchQuery = !query || text.includes(query);
    item.hidden = !(matchTopic && matchQuery);
    if (!item.hidden) visible++;
  }
  faqCount.textContent = visible === 1 ? '1 question' : visible + ' questions';
}
faqFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    faqTopic = filter.dataset.faqFilter;
    faqFilters.forEach((option) => option.setAttribute('aria-pressed', String(option === filter)));
    updateFaq();
  });
});
faqSearch.addEventListener('input', updateFaq);
updateFaq();

document.querySelectorAll('img[src^="art/"]').forEach((img) => {
  img.addEventListener('error', () => {
    img.classList.add('broken');
    img.removeAttribute('src');
  });
});

const navLinks = document.querySelectorAll('header nav a');
const sections = [...navLinks].map((link) => document.querySelector(link.hash)).filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      if (link.hash === '#' + visible.target.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.4] });
  sections.forEach((section) => spy.observe(section));
}
