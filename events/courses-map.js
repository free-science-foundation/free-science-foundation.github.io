(function () {
  function fixDefaultIcons() {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }

  function init() {
    var el = document.getElementById("courses-map-leaflet");
    if (!el || typeof L === "undefined") return;

    fixDefaultIcons();

    var places = [
      { name: "Basel", lat: 47.5596, lng: 7.5886 },
      { name: "Zurich", lat: 47.3769, lng: 8.5417 },
      { name: "Baden", lat: 47.4733, lng: 8.3075 },
    ];

    var map = L.map(el, {
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    var group = L.featureGroup();
    places.forEach(function (p) {
      L.marker([p.lat, p.lng])
        .bindPopup("<strong>" + p.name + "</strong><br>Switzerland")
        .addTo(group);
    });
    group.addTo(map);

    map.fitBounds(group.getBounds().pad(0.22));

    window.addEventListener(
      "resize",
      function () {
        map.invalidateSize();
      },
      { passive: true }
    );

    requestAnimationFrame(function () {
      map.invalidateSize();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
