
const nav = document.getElementById('nav');
const heroBg = document.querySelector('.hero > img');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let ticking = false;
function onScroll() {
  const sy = window.scrollY;
  nav.classList.toggle('scrolled', sy > 70);
  if (heroBg && !reduceMotion) {
    heroBg.style.transform = 'translateY(' + (sy * 0.15) + 'px) scale(1.08)';
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.01, rootMargin: '0px 0px 400px 0px' });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

// SMOOTH ANCHOR SCROLL with nav offset
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('nav').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// PAGE INTRO + AGE GATE SEQUENCE
(function() {
  var mark    = document.getElementById('intro-mark');
  var gate    = document.getElementById('intro-gate');
  var panel   = document.getElementById('page-intro');
  var btnYes  = document.getElementById('gate-yes');
  var btnNo   = document.getElementById('gate-no');
  var btnBack = document.getElementById('gate-back');
  var decline = document.getElementById('gate-decline');
  if (!mark || !panel) return;

  // 1 — logo fades in
  setTimeout(function() { mark.classList.add('show'); }, 300);

  // 2 — gate fades in
  setTimeout(function() {
    if (gate) gate.classList.add('show');
    if (btnYes) btnYes.focus();
  }, 700);

  // 3a — confirmed: cinematic hold then slow fade to site
  if (btnYes) {
    btnYes.addEventListener('click', function() {
      // Gate dissolves, logo stays on pure black
      if (gate) { gate.style.transition = 'opacity 0.4s ease'; gate.style.opacity = '0'; }
      // Hold on black with logo visible for a full beat, then slow cinematic fade
      setTimeout(function() {
        if (mark) { mark.style.transition = 'opacity 0.8s ease'; mark.style.opacity = '0'; }
        panel.classList.add('fade-out');
        setTimeout(function() { panel.style.display = 'none'; }, 2600);
      }, 1200);
    });
  }

  // 3b — not 21
  if (btnNo) {
    btnNo.addEventListener('click', function() {
      var btns = document.querySelector('.gate-btns');
      if (btns) btns.style.display = 'none';
      var sub = document.querySelector('.gate-sub');
      if (sub) sub.style.display = 'none';
      var rule = document.querySelector('.gate-rule');
      if (rule) rule.style.display = 'none';
      if (decline) decline.style.display = 'flex';
    });
  }

  // 3c — go back
  if (btnBack) {
    btnBack.addEventListener('click', function() {
      if (decline) decline.style.display = 'none';
      var btns = document.querySelector('.gate-btns');
      if (btns) btns.style.display = 'flex';
      var sub = document.querySelector('.gate-sub');
      if (sub) sub.style.display = '';
      var rule = document.querySelector('.gate-rule');
      if (rule) rule.style.display = '';
    });
  }
})();


// MOBILE NAV OVERLAY
(function() {
  var menuBtn = document.getElementById('nav-menu-btn');
  var overlay = document.getElementById('nav-overlay');
  var closeBtn = document.getElementById('overlay-close');
  var links = document.querySelectorAll('.overlay-link');

  function openMenu() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    if (closeBtn) closeBtn.focus();
  }
  function closeMenu() {
    if (!overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); }
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  links.forEach(function(link) {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });

  // Close on escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });
})();

