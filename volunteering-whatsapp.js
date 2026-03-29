(function () {
  var overlay = document.getElementById("volunteer-wa-overlay");
  var form = document.getElementById("volunteer-wa-form");
  if (!overlay || !form) return;

  var topicLabelEl = document.getElementById("volunteer-wa-topic-label");
  var topicSummaryEl = document.getElementById("volunteer-wa-topic-summary");
  var errorEl = document.getElementById("volunteer-wa-error");
  var closeBtn = overlay.querySelector(".volunteer-wa-close");
  var emailInput = document.getElementById("volunteer-wa-email");
  var phoneInput = document.getElementById("volunteer-wa-phone");
  var messageInput = document.getElementById("volunteer-wa-message");

  var currentTitle = "";
  var currentSummary = "";
  var currentContext = "join-team";
  var lastFocus = null;

  function getOrganizerWhatsAppE164() {
    var meta = document.querySelector('meta[name="fsn-whatsapp-e164"]');
    var raw = meta ? meta.getAttribute("content") || "" : "";
    return raw.replace(/\D/g, "");
  }

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  function clearError() {
    if (!errorEl) return;
    errorEl.textContent = "";
    errorEl.hidden = true;
  }

  function openModal(title, summary, context) {
    currentTitle = title || "";
    currentSummary = summary || "";
    currentContext = context || "join-team";
    clearError();
    form.reset();
    if (topicLabelEl) {
      topicLabelEl.textContent = currentTitle || "Free Science Network";
    }
    if (topicSummaryEl) {
      topicSummaryEl.textContent = currentSummary || "";
      topicSummaryEl.hidden = !currentSummary;
    }
    lastFocus = document.activeElement;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () {
      if (emailInput) emailInput.focus();
    });
  }

  function closeModal() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    clearError();
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function buildMessage(email, phone, userMessage) {
    var extra = (userMessage || "").trim();
    var tag =
      currentContext === "need-help"
        ? "Need help"
        : currentContext === "donate-time"
        ? "Donate time (path)"
        : "Join team";
    var lines = [
      "Hello Free Science Network — " + tag + " (volunteering page).",
      "Topic: " + (currentTitle || "—"),
      "Details: " + (currentSummary || "—"),
      "Email: " + email,
      "Phone/WhatsApp: " + phone,
      "More: " + (extra || "—"),
    ];
    return lines.join("\n");
  }

  function injectPathExplorerDetailButtons() {
    var root = document.getElementById("donate-time");
    if (!root) return;
    root.querySelectorAll(".tree-detail").forEach(function (detail) {
      if (detail.querySelector(".tree-detail-wa .volunteer-wa-open-btn")) return;

      var tree = detail.closest(".pillar-tree");
      var pillarTitleEl = tree ? tree.querySelector(".tree-title") : null;
      var pillarName = pillarTitleEl ? pillarTitleEl.textContent.replace(/\s+/g, " ").trim() : "Find your path";

      var titleEl = detail.querySelector(".detail-title");
      var detailName = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "Path";

      function clip(s, max) {
        s = (s || "").replace(/\s+/g, " ").trim();
        if (s.length <= max) return s;
        return s.slice(0, Math.max(0, max - 1)) + "…";
      }

      var bullets = [];
      var list = detail.querySelector(".detail-list");
      if (list) {
        list.querySelectorAll("li").forEach(function (li) {
          var t = li.textContent.replace(/\s+/g, " ").trim();
          if (t) bullets.push(t);
        });
      }

      var shortTitle = clip(pillarName + " · " + detailName, 80);
      var summary = "—";
      if (bullets.length > 0) {
        var bits = bullets.slice(0, 2).map(function (b) {
          return clip(b, 72);
        });
        summary = clip(bits.join(" · "), 200);
      }

      var wrap = document.createElement("div");
      wrap.className = "tree-detail-wa";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cta-button volunteer-wa-open-btn";
      btn.textContent = "Connect on WhatsApp";
      btn.setAttribute("data-wa-context", "donate-time");
      btn.setAttribute("data-wa-title", shortTitle);
      btn.setAttribute("data-wa-summary", summary);
      wrap.appendChild(btn);
      detail.appendChild(wrap);
    });
  }

  injectPathExplorerDetailButtons();

  document.body.addEventListener("click", function (e) {
    var btn = e.target.closest(".volunteer-wa-open-btn[data-wa-title]");
    if (!btn) return;
    e.stopPropagation();
    e.preventDefault();
    openModal(
      btn.getAttribute("data-wa-title") || "",
      btn.getAttribute("data-wa-summary") || "",
      btn.getAttribute("data-wa-context") || "join-team"
    );
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      e.preventDefault();
      closeModal();
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearError();

    var email = (emailInput && emailInput.value ? emailInput.value : "").trim();
    var phone = (phoneInput && phoneInput.value ? phoneInput.value : "").trim();
    var userMessage = (messageInput && messageInput.value ? messageInput.value : "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Please enter a valid email address.");
      if (emailInput) emailInput.focus();
      return;
    }
    if (!phone || phone.length < 6) {
      showError("Please enter a phone number (include country code if possible).");
      if (phoneInput) phoneInput.focus();
      return;
    }

    var wa = getOrganizerWhatsAppE164();
    if (!wa || wa.length < 8 || wa.length > 15) {
      showError(
        "WhatsApp number is not configured on this page. Please email info@freesciencenetwork.org instead."
      );
      return;
    }

    var text = buildMessage(email, phone, userMessage);
    var url = "https://wa.me/" + wa + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
    closeModal();
  });
})();
