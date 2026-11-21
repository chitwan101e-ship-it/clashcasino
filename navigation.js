const siteHeader = document.querySelector('.site-header');
const menuButton = siteHeader.querySelector('.menu-toggle');
const primaryNav = document.getElementById(menuButton.getAttribute('aria-controls'));
const mobileView = window.matchMedia('(max-width: 800px)');

function menuIsOpen() {
  return menuButton.getAttribute('aria-expanded') === 'true';
}

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', String(!menuIsOpen()));
});

primaryNav.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('click', event => {
  if (!siteHeader.contains(event.target)) closeMenu();
});

document.addEventListener('focusin', event => {
  if (!siteHeader.contains(event.target)) closeMenu();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuIsOpen()) {
    closeMenu();
    menuButton.focus();
  }
});

mobileView.addEventListener('change', () => {
  if (mobileView.matches && primaryNav.contains(document.activeElement)) menuButton.focus();
  closeMenu();
});
window.addEventListener('pageshow', closeMenu);
siteHeader.classList.add('menu-ready');
