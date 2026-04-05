/* Apply saved theme or NGO (green) before first paint. Keep in sync with theme.js STORAGE + VALID. */
(function () {
  var k = 'theme';
  var ok = ['light', 'dark', 'zambia', 'ngo'];
  var t;
  try {
    t = localStorage.getItem(k);
  } catch (e) {
    t = null;
  }
  document.documentElement.setAttribute(
    'data-theme',
    ok.indexOf(t) !== -1 ? t : 'ngo'
  );
})();
