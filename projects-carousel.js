(function () {
  var root = document.querySelector('[data-pillar-carousel]');
  if (!root) return;

  var track = root.querySelector('.pillar-carousel__track');
  var slides = root.querySelectorAll('.pillar-carousel__slide');
  var prev = root.querySelector('.pillar-carousel__nav--prev');
  var next = root.querySelector('.pillar-carousel__nav--next');
  var dotsWrap = root.querySelector('.pillar-carousel__dots');

  var n = slides.length;
  var i = 0;

  if (n <= 1) {
    root.classList.add('pillar-carousel--single');
    return;
  }

  function indexFromHash() {
    var raw = (window.location.hash || '').replace(/^#/, '');
    if (!raw) return 0;
    var h = decodeURIComponent(raw);
    for (var j = 0; j < n; j++) {
      if (slides[j].id && slides[j].id === h) return j;
    }
    return 0;
  }

  function syncUrlToSlide(skip) {
    if (skip) return;
    var el = slides[i];
    if (!el || !el.id) return;
    var nextHash = '#' + el.id;
    if (window.location.hash !== nextHash) {
      history.replaceState(null, '', window.location.pathname + window.location.search + nextHash);
    }
  }

  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (var d = 0; d < n; d++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pillar-carousel__dot';
      b.setAttribute('aria-label', 'Go to slide ' + (d + 1));
      if (d === i) b.setAttribute('aria-current', 'true');
      (function (idx) {
        b.addEventListener('click', function () {
          i = idx;
          update();
        });
      })(d);
      dotsWrap.appendChild(b);
    }
  }

  function update(options) {
    var skipUrl = options && options.skipUrl;
    track.style.transform = 'translateX(' + -i * 100 + '%)';
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === n - 1;
    if (dotsWrap) {
      var dots = dotsWrap.querySelectorAll('.pillar-carousel__dot');
      for (var k = 0; k < dots.length; k++) {
        if (k === i) dots[k].setAttribute('aria-current', 'true');
        else dots[k].removeAttribute('aria-current');
      }
    }
    syncUrlToSlide(skipUrl);
  }

  if (prev) {
    prev.addEventListener('click', function () {
      if (i > 0) {
        i--;
        update({});
      }
    });
  }
  if (next) {
    next.addEventListener('click', function () {
      if (i < n - 1) {
        i++;
        update({});
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' && i > 0) {
      i--;
      update({});
    } else if (e.key === 'ArrowRight' && i < n - 1) {
      i++;
      update({});
    }
  });

  window.addEventListener('hashchange', function () {
    var idx = indexFromHash();
    if (idx !== i) {
      i = idx;
      update({ skipUrl: true });
    }
  });

  i = indexFromHash();
  renderDots();
  update({ skipUrl: true });
})();
