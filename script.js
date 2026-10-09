const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');

if (menuButton && siteNav) {
  const closeMenu = ({ returnFocus = false } = {}) => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    siteNav.classList.remove('is-open');
    if (returnFocus) menuButton.focus();
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    siteNav.classList.toggle('is-open', !isOpen);
  });

  siteNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (menuButton.getAttribute('aria-expanded') === 'true' && !siteNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu({ returnFocus: true });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) closeMenu();
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealGroups = [
    ['.about-image-wrap', '.about-copy'],
    ['.section-heading', '.creative-card'],
    ['.portfolio-heading', '.work-tile'],
    ['.approach-intro', '.benefit-list li'],
    ['.collaborations .section-heading', '.collab-item'],
    ['.contact-inner'],
    ['.footer-top > div', '.footer-nav', '.footer-bottom']
  ];

  revealGroups.flat().forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (element.closest('.hero')) return;
      element.classList.add('reveal');
      if (index % 4) element.classList.add(`reveal-delay-${index % 4}`);
    });
  });

  document.documentElement.classList.add('js-motion');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
}

const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  observedSections.forEach((section) => navObserver.observe(section));
}
