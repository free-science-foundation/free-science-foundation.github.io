let allItems = [];
let searchInput;
let typeFilter;
let categoryFilter;
let clearFiltersButton;
let resultsCount;
let itemsContainer;
let noResults;

document.addEventListener("DOMContentLoaded", async () => {
  searchInput = document.getElementById("search-input");
  typeFilter = document.getElementById("type-filter");
  categoryFilter = document.getElementById("category-filter");
  clearFiltersButton = document.getElementById("clear-filters");
  resultsCount = document.getElementById("results-count");
  itemsContainer = document.getElementById("items-container");
  noResults = document.getElementById("no-results");

  setupListeners();
  await loadData();
  renderItems();
  updateClearButtonState();
});

function setupListeners() {
  searchInput?.addEventListener("input", debounce(handleFilterChange, 220));
  typeFilter?.addEventListener("change", handleFilterChange);
  categoryFilter?.addEventListener("change", handleFilterChange);
  clearFiltersButton?.addEventListener("click", clearFilters);
}

async function loadData() {
  try {
    const response = await fetch("tools-services-data.json");
    if (!response.ok) {
      throw new Error("Could not load data file.");
    }

    const json = await response.json();
    allItems = Array.isArray(json) ? json : [];
    populateCategories(allItems);
  } catch (error) {
    allItems = [];
    resultsCount.textContent = "Unable to load tools and services data.";
    noResults.style.display = "block";
    noResults.innerHTML = "<p>Data file not found or invalid JSON format.</p>";
  }
}

function populateCategories(items) {
  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))].sort();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = toTitleCase(category);
    categoryFilter.appendChild(option);
  });
}

function clearFilters() {
  searchInput.value = "";
  typeFilter.value = "";
  categoryFilter.value = "";
  handleFilterChange();
  searchInput.focus();
}

function handleFilterChange() {
  renderItems();
  updateClearButtonState();
}

function updateClearButtonState() {
  const hasFilters =
    searchInput.value.trim() !== "" ||
    typeFilter.value !== "" ||
    categoryFilter.value !== "";
  clearFiltersButton.disabled = !hasFilters;
}

function getFilteredItems() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedType = typeFilter.value;
  const selectedCategory = categoryFilter.value;

  return allItems.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.type.toLowerCase().includes(searchTerm) ||
      (item.category || "").toLowerCase().includes(searchTerm);

    const matchesType = !selectedType || item.type === selectedType;
    const matchesCategory = !selectedCategory || item.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });
}

function renderItems() {
  const filtered = getFilteredItems();
  updateResultsCount(filtered.length, allItems.length);

  if (filtered.length === 0) {
    itemsContainer.innerHTML = "";
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";
  itemsContainer.innerHTML = filtered.map(createCard).join("");
}

function updateResultsCount(count, total) {
  if (count === total) {
    resultsCount.textContent = `Showing all ${count} items`;
    return;
  }

  resultsCount.textContent = `Showing ${count} of ${total} items`;
}

function createCard(item) {
  const safeType = escapeHtml(item.type || "");
  const safeCategory = escapeHtml(item.category || "");
  const safeName = escapeHtml(item.name || "");
  const safeDescription = escapeHtml(item.description || "");
  const safeLink = escapeAttribute(item.link || "#");

  const typeClass = safeType === "service" ? "chip-type-service" : "chip-type-project";

  return `
    <article class="item-card">
      <div class="item-meta">
        <span class="item-chip ${typeClass}">${toTitleCase(safeType)}</span>
        <span class="item-chip chip-category">${toTitleCase(safeCategory)}</span>
      </div>
      <h3 class="item-name">${safeName}</h3>
      <p class="item-description">${safeDescription}</p>
      <a href="${safeLink}" class="item-link" target="_blank" rel="noopener">Open link</a>
    </article>
  `;
}

function debounce(fn, waitMs) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), waitMs);
  };
}

function toTitleCase(value) {
  return String(value)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return String(value).replace(/"/g, "&quot;");
}
