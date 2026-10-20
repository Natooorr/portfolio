// Theme toggle handling
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check saved theme or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
  htmlElement.setAttribute('data-theme', savedTheme);
  updateToggleIcon(savedTheme);
} else if (!systemPrefersDark) {
  htmlElement.setAttribute('data-theme', 'light');
  updateToggleIcon('light');
} else {
  htmlElement.setAttribute('data-theme', 'dark');
  updateToggleIcon('dark');
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateToggleIcon(newTheme);
});

function updateToggleIcon(theme) {
  themeToggleBtn.textContent = theme === 'light' ? '☀️' : '🌙';
}

// Preserve scroll position when switching language
const langButtons = document.querySelectorAll('.lang-btn');
langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sessionStorage.setItem('langSwitchScrollY', window.scrollY.toString());
  });
});

const savedScrollY = sessionStorage.getItem('langSwitchScrollY');
if (savedScrollY !== null) {
  sessionStorage.removeItem('langSwitchScrollY');
  window.scrollTo({
    top: parseInt(savedScrollY, 10),
    behavior: 'instant'
  });
  // Also re-apply after full load in case of images loading
  window.addEventListener('load', () => {
    window.scrollTo({
      top: parseInt(savedScrollY, 10),
      behavior: 'instant'
    });
  }, { once: true });
}
