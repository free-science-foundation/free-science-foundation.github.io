// Theme Toggle Functionality
(function() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check for saved theme preference or default to system preference
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  
  // Apply theme
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update checkbox state
    if (themeToggle) {
      themeToggle.checked = (theme === 'dark');
    }
  }
  
  // Initialize theme on page load
  const preferredTheme = getPreferredTheme();
  setTheme(preferredTheme);
  
  // Toggle theme on checkbox change
  if (themeToggle) {
    themeToggle.addEventListener('change', function() {
      const newTheme = this.checked ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
})();

// Language Selector Functionality
(function() {
  const languageSelector = document.querySelector('.language-selector');
  const languageBtn = document.querySelector('.language-btn');
  const currentLangSpan = document.querySelector('.current-lang');
  const langOptions = document.querySelectorAll('.lang-option');
  
  if (!languageSelector || !languageBtn) return;
  
  // Language codes to display names
  const langCodes = {
    'en': 'EN',
    'es': 'ES',
    'pt': 'PT',
    'fr': 'FR',
    'de': 'DE',
    'it': 'IT',
    'nl': 'NL',
    'pl': 'PL',
    'ro': 'RO',
    'hu': 'HU',
    'cs': 'CS',
    'el': 'EL',
    'sv': 'SV',
    'da': 'DA',
    'no': 'NO',
    'fi': 'FI',
    'bg': 'BG',
    'hr': 'HR',
    'sr': 'SR',
    'sk': 'SK',
    'sl': 'SL',
    'lt': 'LT',
    'lv': 'LV',
    'et': 'ET',
    'sq': 'SQ',
    'mk': 'MK',
    'be': 'BE',
    'uk': 'UK',
    'ru': 'RU',
    'ca': 'CA',
    'gl': 'GL',
    'eu': 'EU',
    'ga': 'GA',
    'cy': 'CY',
    'is': 'IS',
    'mt': 'MT',
    'tr': 'TR',
    'ar': 'AR',
    'fa': 'FA',
    'ur': 'UR',
    'hi': 'HI',
    'bn': 'BN',
    'pa': 'PA',
    'gu': 'GU',
    'mr': 'MR',
    'te': 'TE',
    'ta': 'TA',
    'kn': 'KN',
    'ml': 'ML',
    'si': 'SI',
    'ne': 'NE',
    'zh': 'ZH',
    'ja': 'JA',
    'ko': 'KO',
    'id': 'ID',
    'ms': 'MS',
    'tl': 'TL',
    'ceb': 'CEB',
    'vi': 'VI',
    'th': 'TH',
    'lo': 'LO',
    'my': 'MY',
    'km': 'KM',
    'sw': 'SW',
    'ha': 'HA',
    'yo': 'YO',
    'ig': 'IG',
    'ff': 'FF',
    'am': 'AM',
    'ti': 'TI',
    'om': 'OM',
    'so': 'SO',
    'mg': 'MG',
    'sn': 'SN',
    'zu': 'ZU'
  };
  
  // Get saved language or default to English
  function getSavedLanguage() {
    return localStorage.getItem('language') || 'en';
  }
  
  // Set language
  function setLanguage(lang) {
    localStorage.setItem('language', lang);
    if (currentLangSpan) {
      currentLangSpan.textContent = langCodes[lang] || 'EN';
    }
    
    // Update active state
    langOptions.forEach(option => {
      option.classList.toggle('active', option.dataset.lang === lang);
    });
    
    // Set HTML lang attribute
    document.documentElement.lang = lang;
    
    // Close dropdown
    languageSelector.classList.remove('open');
    languageBtn.setAttribute('aria-expanded', 'false');
  }
  
  // Initialize language
  const savedLang = getSavedLanguage();
  setLanguage(savedLang);
  
  // Toggle dropdown
  languageBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = languageSelector.classList.toggle('open');
    this.setAttribute('aria-expanded', isOpen);
  });
  
  // Handle language selection
  langOptions.forEach(option => {
    option.addEventListener('click', function() {
      const lang = this.dataset.lang;
      setLanguage(lang);
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!languageSelector.contains(e.target)) {
      languageSelector.classList.remove('open');
      languageBtn.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close dropdown on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      languageSelector.classList.remove('open');
      languageBtn.setAttribute('aria-expanded', 'false');
    }
  });
})();
