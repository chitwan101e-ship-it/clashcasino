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
    updateGallery();
  });
}
search.addEventListener('input', updateGallery);
updateGallery();

moreButton.addEventListener('click', () => {
  showAll = !showAll;
  updateGallery();
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

