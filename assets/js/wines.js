async function loadWines() {
  try {
    const res = await fetch('wines.json');
    const wines = await res.json();
    renderWines(wines);
  } catch (e) {
    console.error('Failed to load wines:', e);
  }
}

function parseFrontmatter(md) {
  const result = { title: '', price: '', image: '', notes: '', type: '', region: '' };
  const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (match) {
    const fm = match[1];
    const body = match[2].trim();
    fm.split('\n').forEach(line => {
      const [key, ...val] = line.split(':');
      if (key && val.length) {
        const value = val.join(':').trim().replace(/^["']|["']$/g, '');
        if (key.trim() === 'title') result.title = value;
        else if (key.trim() === 'price') result.price = value;
        else if (key.trim() === 'image') result.image = value;
      }
    });
    result.notes = body.replace(/[#*_]/g, '').substring(0, 200);
  }
  return result;
}

function renderWines(wines) {
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.innerHTML = wines.map(w => `
    <div class="card fade-up">
      <div class="img-wrap">
        <img src="${w.image}" alt="${w.title}" loading="lazy" onerror="this.style.display='none'">
        ${w.notes ? `<div class="card-overlay">
          <div class="overlay-notes">${w.notes}</div>
          <div class="overlay-divider"></div>
          <div class="overlay-price">$${w.price}</div>
        </div>` : ''}
      </div>
      <div class="card-type">${w.type}</div>
      <div class="card-name">${w.title}</div>
      <div class="card-bottom">
        <div class="card-price">$${w.price}</div>
        <div class="card-region">${w.region}</div>
      </div>
    </div>`).join('');
  
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.01, rootMargin: '0px 0px 400px 0px' });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

loadWines();

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

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu(); 
  });
})();