(function () {
  "use strict";

  function getCards(grid) {
    return Array.prototype.slice.call(grid.children).filter(function (el) {
      return el.classList && el.classList.contains("team-member-card");
    });
  }

  var collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });

  function listingIndex(card) {
    var v = card.getAttribute("data-listing-index");
    var n = v == null ? NaN : parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  }

  function compareName(a, b, dir) {
    var elA = a.querySelector(".team-member-name");
    var elB = b.querySelector(".team-member-name");
    var na = elA ? elA.textContent.trim() : "";
    var nb = elB ? elB.textContent.trim() : "";
    var c = collator.compare(na, nb);
    if (c === 0) return listingIndex(a) - listingIndex(b);
    return dir * c;
  }

  function compareListed(a, b, dir) {
    return dir * (listingIndex(a) - listingIndex(b));
  }

  function applySort(grid, mode) {
    var cards = getCards(grid);
    if (cards.length < 2) return;
    var sorted = cards.slice();
    if (mode === "alpha-asc") sorted.sort(function (a, b) { return compareName(a, b, 1); });
    else if (mode === "alpha-desc") sorted.sort(function (a, b) { return compareName(a, b, -1); });
    else if (mode === "listed-desc") sorted.sort(function (a, b) { return compareListed(a, b, -1); });
    else sorted.sort(function (a, b) { return compareListed(a, b, 1); });

    sorted.forEach(function (card) {
      grid.appendChild(card);
    });
  }

  function init() {
    var grid = document.getElementById("team-grid");
    if (!grid) return;
    var cards = getCards(grid);
    if (cards.length < 2) return;

    cards.forEach(function (card, i) {
      card.setAttribute("data-listing-index", String(i));
    });

    var select = document.getElementById("team-sort-select");
    if (!select) return;

    var live = document.getElementById("team-sort-live");

    select.addEventListener("change", function () {
      applySort(grid, select.value);
      if (live) live.textContent = "Members reordered.";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
