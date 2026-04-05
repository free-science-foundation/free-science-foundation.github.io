(function () {
  var root = document.querySelector("[data-hero-carousel]");
  if (!root) return;

  var slides = root.querySelectorAll(".hero-carousel-slide");
  var dots = root.querySelectorAll(".hero-carousel-dot");
  var prevBtn = root.querySelector(".hero-carousel-prev");
  var nextBtn = root.querySelector(".hero-carousel-next");
  if (!slides.length) return;

  var i = 0;
  var n = slides.length;
  var autoInterval = null;
  var AUTO_DELAY = 5000;

  function applySlide(index) {
    i = (index + n) % n;
    slides.forEach(function (slide, j) {
      var active = j === i;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      if (active) slide.removeAttribute("inert");
      else slide.setAttribute("inert", "");
    });
    dots.forEach(function (dot, j) {
      var active = j === i;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
      dot.tabIndex = active ? 0 : -1;
    });
  }

  function go(delta) {
    applySlide(i + delta);
  }

  function startAuto() {
    stopAuto();
    autoInterval = setInterval(function () { go(1); }, AUTO_DELAY);
  }

  function stopAuto() {
    if (autoInterval) { clearInterval(autoInterval); autoInterval = null; }
  }

  function userNav(fn) {
    stopAuto();
    fn();
    startAuto();
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { userNav(function () { go(-1); }); });
  if (nextBtn) nextBtn.addEventListener("click", function () { userNav(function () { go(1); }); });

  dots.forEach(function (dot, j) {
    dot.addEventListener("click", function () { userNav(function () { applySlide(j); }); });
  });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); userNav(function () { go(-1); }); }
    else if (e.key === "ArrowRight") { e.preventDefault(); userNav(function () { go(1); }); }
  });

  /* Pause auto-play while the user hovers over the carousel */
  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);
  root.addEventListener("focusin",  stopAuto);
  root.addEventListener("focusout", startAuto);

  applySlide(0);
  startAuto();
})();
