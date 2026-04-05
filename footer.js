/* ============================================================
   Shared footer — loads partials/site-footer.html (single source).
   __BASE__ is replaced so links work from / and /events/.
   Serve over HTTP (e.g. python3 -m http.server); fetch() needs origin.
   ============================================================ */
(function () {
  var el = document.getElementById('site-footer-placeholder');
  if (!el) return;

  var base = /\/events\//.test(window.location.pathname) ? '../' : '';
  var url = base + 'partials/site-footer.html';

  function applyBase(html) {
    return html.split('__BASE__').join(base);
  }

  function inject(html) {
    el.outerHTML = applyBase(html.trim());
  }

  if (typeof fetch !== 'function') {
    inject(
      '<footer class="site-footer" role="contentinfo"><div class="container"><div class="footer-bottom"><p>Please use a modern browser with <code>fetch</code> to load the shared footer.</p></div></div></footer>'
    );
    return;
  }

  fetch(url, { credentials: 'same-origin' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(inject)
    .catch(function () {
      inject(
        '<footer class="site-footer" role="contentinfo">' +
          '<div class="container">' +
          '<div class="footer-bottom">' +
          '<p>Footer could not be loaded. Open the site via a local server from the project root ' +
          '(e.g. <code>python3 -m http.server 8080</code>) so <code>partials/site-footer.html</code> is available.</p>' +
          '</div></div></footer>'
      );
    });
})();
