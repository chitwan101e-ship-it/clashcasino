const pathSteps = [
  {
    tab: 'path-tab-1',
    kicker: 'Create an account',
    title: 'Create your Clash Casino account',
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
    title: 'Add a game and send credits',
    copy: 'When you add a game, Clash Casino creates that game account and sends you its login. Play on the game platform, redeem balance to the wallet from the game card, and cash out after identity verification — the site mentions cashouts to your card.',
    cta: 'Read the game blog',
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


const worldFilter = document.querySelector('#world-filter');
const worldCards = [...document.querySelectorAll('.world-card')];
const worldCount = document.querySelector('#world-count');
worldFilter.addEventListener('input', () => {
  const query = worldFilter.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  let count = 0;
  worldCards.forEach((card) => {
    const terms = (card.dataset.terms + " " + card.textContent).toLowerCase().replace(/[^a-z0-9]/g, '');
    card.hidden = !terms.includes(query);
    if (!card.hidden) count++;
  });
  worldCount.textContent = count ? count + (count === 1 ? ' article' : ' articles') : 'No matching articles. Try a game or platform name.';
});
