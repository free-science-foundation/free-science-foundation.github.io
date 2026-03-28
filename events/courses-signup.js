(function () {
  var overlay = document.getElementById("course-signup-overlay");
  var form = document.getElementById("course-signup-form");
  if (!overlay || !form) return;

  var courseLabelEl = document.getElementById("course-signup-course-label");
  var errorEl = document.getElementById("course-signup-error");
  var closeBtn = overlay.querySelector(".course-signup-close");
  var emailInput = document.getElementById("course-signup-email");
  var phoneInput = document.getElementById("course-signup-phone");

  var currentCourseTitle = "";
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

  function openModal(courseTitle) {
    currentCourseTitle = courseTitle || "";
    clearError();
    form.reset();
    if (courseLabelEl) {
      if (currentCourseTitle) {
        courseLabelEl.textContent = "Course: " + currentCourseTitle;
        courseLabelEl.hidden = false;
      } else {
        courseLabelEl.textContent = "";
        courseLabelEl.hidden = true;
      }
    }
    lastFocus = document.activeElement;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () {
      emailInput.focus();
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

  function buildMessage(email, phone) {
    var lines = [
      "Hello Free Science Network,",
      "",
      "I'd like to sign up for this course:",
      currentCourseTitle || "(course not specified)",
      "",
      "My email: " + email,
      "My phone / WhatsApp: " + phone,
      "",
      "Thank you!",
    ];
    return lines.join("\n");
  }

  document.querySelectorAll(".course-signup-btn[data-course-title]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.getAttribute("data-course-title") || "");
    });
  });

  closeBtn.addEventListener("click", closeModal);

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

    var email = (emailInput.value || "").trim();
    var phone = (phoneInput.value || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Please enter a valid email address.");
      emailInput.focus();
      return;
    }
    if (!phone || phone.length < 6) {
      showError("Please enter a phone number (include country code if possible).");
      phoneInput.focus();
      return;
    }

    var wa = getOrganizerWhatsAppE164();
    if (!wa || wa.length < 8 || wa.length > 15) {
      showError(
        "WhatsApp number for sign-ups is not configured on this page. Please email info@freesciencenetwork.org instead."
      );
      return;
    }

    var text = buildMessage(email, phone);
    var url = "https://wa.me/" + wa + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
    closeModal();
  });
})();
