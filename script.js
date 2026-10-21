// Theme toggle handling
const htmlElement = document.documentElement;

function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let activeTheme = 'dark';
  if (savedTheme) {
    activeTheme = savedTheme;
  } else if (!systemPrefersDark) {
    activeTheme = 'light';
  }

  htmlElement.setAttribute('data-theme', activeTheme);
  updateToggleIcon(themeToggleBtn, activeTheme);

  if (themeToggleBtn) {
    themeToggleBtn.onclick = () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleIcon(themeToggleBtn, newTheme);
    };
  }
}

function updateToggleIcon(btn, theme) {
  if (btn) {
    btn.textContent = theme === 'light' ? '☀️' : '🌙';
  }
}

// Ensure manual scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Restore saved scroll position immediately on page load
const savedScrollY = sessionStorage.getItem('langSwitchScrollY');
if (savedScrollY !== null) {
  const y = parseInt(savedScrollY, 10);
  window.scrollTo({ top: y, behavior: 'instant' });
  sessionStorage.removeItem('langSwitchScrollY');
  window.addEventListener('load', () => {
    window.scrollTo({ top: y, behavior: 'instant' });
  }, { once: true });
}

// Language switch with seamless in-place swap & fallback
function setupLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.onclick = async (e) => {
      if (btn.classList.contains('active')) {
        e.preventDefault();
        return;
      }

      const targetUrl = btn.getAttribute('href');
      if (!targetUrl || targetUrl.startsWith('#')) return;

      const currentScroll = window.scrollY;
      sessionStorage.setItem('langSwitchScrollY', currentScroll.toString());

      // Attempt seamless in-page swap if served over http/https
      if (window.location.protocol.startsWith('http')) {
        e.preventDefault();
        try {
          const res = await fetch(targetUrl);
          if (!res.ok) throw new Error('Fetch failed');
          const htmlText = await res.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, 'text/html');

          // Update html lang and title
          document.documentElement.lang = doc.documentElement.lang || 'en';
          document.title = doc.title;

          // Swap navigation header
          const oldHeader = document.querySelector('.header');
          const newHeader = doc.querySelector('.header');
          if (oldHeader && newHeader) {
            oldHeader.innerHTML = newHeader.innerHTML;
          }

          // Swap main content sections
          const oldSections = document.querySelectorAll('section');
          const newSections = doc.querySelectorAll('section');
          oldSections.forEach((sec, idx) => {
            if (newSections[idx]) {
              sec.innerHTML = newSections[idx].innerHTML;
            }
          });

          // Swap footer
          const oldFooter = document.querySelector('footer');
          const newFooter = doc.querySelector('footer');
          if (oldFooter && newFooter) {
            oldFooter.innerHTML = newFooter.innerHTML;
          }

          // Update URL in address bar
          history.pushState({ langUrl: targetUrl }, doc.title, targetUrl);
          lastPathname = window.location.pathname;

          // Re-bind theme and language listeners
          initTheme();
          setupLanguageSwitcher();

          // Maintain exact scroll position
          window.scrollTo({ top: currentScroll, behavior: 'instant' });
        } catch (err) {
          window.location.href = targetUrl;
        }
      }
    };
  });
}

// Track pathname to only reload on language page transitions (back/forward between pages),
// never for in-page hash/anchor links (#about, #experience, etc.)
let lastPathname = window.location.pathname;

window.addEventListener('popstate', () => {
  if (window.location.pathname !== lastPathname) {
    window.location.reload();
  }
});

// Interactive Hobby Icons Click Handlers
function setupHobbyIconInteractions() {
  document.addEventListener('click', (e) => {
    const bakingBtn = e.target.closest('.icon-baking');
    if (bakingBtn) {
      triggerBakingAnimation(bakingBtn);
      return;
    }

    const gamesBtn = e.target.closest('.icon-games');
    if (gamesBtn) {
      triggerDiceAnimation(gamesBtn);
      return;
    }

    const gamingBtn = e.target.closest('.icon-gaming');
    if (gamingBtn) {
      triggerGamingAnimation(gamingBtn);
      return;
    }
  });
}

function triggerBakingAnimation(btn) {
  btn.classList.remove('anim-baking');
  void btn.offsetWidth;
  btn.classList.add('anim-baking');

  // Clear any existing crumb particles
  btn.querySelectorAll('.particle-crumb').forEach(p => p.remove());

  // Golden oven sparkles & buttery crumbs floating upwards
  const particles = [
    { text: '✨', dx: -18, dy: -34, delay: 0 },
    { text: '🥐', dx: -2, dy: -46, delay: 80, size: '0.8rem' },
    { text: '✨', dx: 16, dy: -30, delay: 40 },
    { text: '✨', dx: 2, dy: -24, delay: 100, size: '0.65rem' }
  ];

  particles.forEach(p => {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'particle-crumb';
      el.textContent = p.text;
      el.style.setProperty('--dx', `${p.dx}px`);
      el.style.setProperty('--dy', `${p.dy}px`);
      if (p.size) el.style.fontSize = p.size;
      btn.appendChild(el);
      setTimeout(() => el.remove(), 800);
    }, p.delay);
  });

  setTimeout(() => {
    btn.classList.remove('anim-baking');
  }, 700);
}

function triggerDiceAnimation(btn) {
  btn.classList.remove('anim-dice');
  void btn.offsetWidth;
  btn.classList.add('anim-dice');

  // Clear existing dice badge if any
  btn.querySelectorAll('.dice-roll-badge').forEach(b => b.remove());

  // Roll D20 with tabletop RPG flavor
  const roll = Math.floor(Math.random() * 20) + 1;
  const isSv = document.documentElement.lang === 'sv';

  let badgeText = `🎲 ${roll}`;
  let badgeClass = 'dice-roll-badge';

  if (roll === 20) {
    badgeText = isSv ? '🎲 20! (Kritisk! 🌟)' : '🎲 20! (Nat 20! 🌟)';
    badgeClass += ' is-nat20';
  } else if (roll === 1) {
    badgeText = isSv ? '🎲 1... (Miss! 💀)' : '🎲 1... (Nat 1 💀)';
    badgeClass += ' is-nat1';
  } else if (roll === 6) {
    badgeText = '🎲 6!';
  }

  const badge = document.createElement('span');
  badge.className = badgeClass;
  badge.textContent = badgeText;
  btn.appendChild(badge);

  setTimeout(() => {
    badge.remove();
  }, 1300);

  setTimeout(() => {
    btn.classList.remove('anim-dice');
  }, 750);
}

function triggerGamingAnimation(btn) {
  btn.classList.remove('anim-gaming');
  btn.querySelectorAll('.opt2-coin-wrap, .opt2-sparkle').forEach(el => el.remove());
  void btn.offsetWidth;
  btn.classList.add('anim-gaming');

  // Create the rich metallic SVG gold coin
  const coinWrap = document.createElement('span');
  coinWrap.className = 'opt2-coin-wrap';
  coinWrap.innerHTML = `
    <svg class="opt2-coin-svg" viewBox="0 0 32 32" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="goldCoinGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#fffbeb" />
          <stop offset="25%" stop-color="#fef08a" />
          <stop offset="55%" stop-color="#facc15" />
          <stop offset="85%" stop-color="#ca8a04" />
          <stop offset="100%" stop-color="#854d0e" />
        </radialGradient>
        <linearGradient id="goldRimGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="100%" stop-color="#78350f" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#goldCoinGrad)" stroke="url(#goldRimGrad)" stroke-width="1.75" />
      <circle cx="16" cy="16" r="10.5" fill="none" stroke="#fef08a" stroke-width="1" stroke-opacity="0.85" />
      <polygon points="16,8.5 18.2,13.2 23.2,13.8 19.5,17.2 20.6,22.2 16,19.6 11.4,22.2 12.5,17.2 8.8,13.8 13.8,13.2" fill="#78350f" opacity="0.75" />
      <polygon points="16,9.5 17.8,13.5 22,14 18.9,17 19.8,21.2 16,19 12.2,21.2 13.1,17 10,14 14.2,13.5" fill="#fef08a" opacity="0.95" />
    </svg>
  `;
  btn.appendChild(coinWrap);

  // Spawn 2 sparkling golden stars at jump apex
  setTimeout(() => {
    const sparkles = [
      { sx: -16, sy: -32 },
      { sx: 16, sy: -28 }
    ];
    sparkles.forEach(s => {
      const sp = document.createElement('span');
      sp.className = 'opt2-sparkle';
      sp.textContent = '✨';
      sp.style.setProperty('--sx', `${s.sx}px`);
      sp.style.setProperty('--sy', `${s.sy}px`);
      btn.appendChild(sp);
      setTimeout(() => sp.remove(), 600);
    });
  }, 120);

  setTimeout(() => {
    coinWrap.remove();
    btn.classList.remove('anim-gaming');
  }, 900);
}

// Initialize on page load
initTheme();
setupLanguageSwitcher();
setupHobbyIconInteractions();
