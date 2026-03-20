(function () {
  var main = document.querySelector(".zambia-main");
  if (!main) return;

  var links = main.querySelectorAll("[data-zambia-section-link]");
  if (!links.length) return;

  var sections = [];
  links.forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) !== "#") return;
    var id = href.slice(1);
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el });
  });
  if (!sections.length) return;

  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }

  function pickSectionId() {
    var focusY = window.scrollY + window.innerHeight * 0.22;
    var current = sections[0].id;
    for (var i = 0; i < sections.length; i++) {
      var el = sections[i].el;
      var top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= focusY + 2) current = sections[i].id;
    }
    return current;
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        setActive(pickSectionId());
      });
    }
  }

  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", "#" + id);
      setActive(id);
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  window.addEventListener("hashchange", function () {
    var h = location.hash.slice(1);
    if (h && document.getElementById(h)) setActive(h);
  });
})();
