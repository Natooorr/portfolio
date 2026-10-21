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

window.addEventListener('popstate', () => {
  window.location.reload();
});

// Initialize on page load
initTheme();
setupLanguageSwitcher();
