// Free Software Foundation Projects Page JavaScript
// Client-side filtering and project display functionality

// FSF-Affiliated Projects - Only repositories from https://github.com/topics/fsf-affiliated (excluding FSF itself)
const projectsData = [
  {
    id: 1,
    name: "Small MP4 Compressor",
    description: "A lightweight tool for compressing MP4 video files to reduce file size while maintaining quality.",
    pageDescription: "A Python-based tool for efficiently compressing MP4 video files, perfect for reducing file sizes while maintaining acceptable quality for sharing and storage.",
    category: "multimedia",
    tags: ["video", "compression", "multimedia", "tools"],
    license: "mit",
    homepage: "https://github.com/YodaGitMaster/smallmp4compressor",
    repository: "https://github.com/YodaGitMaster/smallmp4compressor",
    stars: 0,
    language: "Python",
    thumbnail: ""
  },
  {
    id: 2,
    name: "StudyNote",
    description: "A containerized note-taking application for efficient study management.",
    pageDescription: "Docker-based note-taking application designed for students and researchers to organize study materials, notes, and resources efficiently.",
    category: "education",
    tags: ["notes", "study", "education", "containers"],
    license: "mit",
    homepage: "https://hub.docker.com/r/francescocozzolino/studynote",
    repository: "https://hub.docker.com/r/francescocozzolino/studynote",
    stars: 0,
    language: "Dockerfile",
    thumbnail: ""
  },
  {
    id: 3,
    name: "Rust Compiler Backend",
    description: "A containerized Rust compiler backend service for distributed compilation.",
    pageDescription: "Docker container providing Rust compiler backend services, enabling distributed compilation and build processes for Rust projects.",
    category: "development",
    tags: ["rust", "compiler", "backend", "containers"],
    license: "mit",
    homepage: "https://hub.docker.com/r/francescocozzolino/rust-compiler-backend",
    repository: "https://hub.docker.com/r/francescocozzolino/rust-compiler-backend",
    stars: 0,
    language: "Rust",
    thumbnail: ""
  },
  {
    id: 4,
    name: "Echoes of the Ashes",
    description: "A containerized gaming or interactive application experience.",
    pageDescription: "Docker-based interactive application or game container, providing a unique digital experience with echoes-themed content.",
    category: "multimedia",
    tags: ["game", "interactive", "multimedia", "containers"],
    license: "mit",
    homepage: "https://hub.docker.com/r/francescocozzolino/echoes-of-the-ashes",
    repository: "https://hub.docker.com/r/francescocozzolino/echoes-of-the-ashes",
    stars: 0,
    language: "Unknown",
    thumbnail: ""
  }
];

// License display names
const licenseNames = {
  'gplv3': 'GPL v3',
  'gplv2': 'GPL v2',
  'agplv3': 'AGPL v3',
  'lgplv3': 'LGPL v3',
  'apache': 'Apache 2.0',
  'mit': 'MIT',
  'mplv2': 'MPL v2',
  'bsd': 'BSD'
};

// Category display names
const categoryNames = {
  'scientific': 'Scientific Tools',
  'development': 'Development Tools',
  'utilities': 'Utilities',
  'education': 'Education',
  'multimedia': 'Multimedia',
  'system': 'System Tools',
  'documentation': 'Documentation'
};

// DOM elements
let searchInput, categoryFilter, licenseFilter, clearFiltersButton, resultsCount, projectsContainer, noResults;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  searchInput = document.getElementById('search-input');
  categoryFilter = document.getElementById('category-filter');
  licenseFilter = document.getElementById('license-filter');
  clearFiltersButton = document.getElementById('clear-filters');
  resultsCount = document.getElementById('results-count');
  projectsContainer = document.getElementById('projects-container');
  noResults = document.getElementById('no-results');

  // Set up event listeners (enhanced with screen reader announcements)
  setupEventListeners();

  // Initial render
  renderProjects();
  updateClearFiltersButton();
});

function setupEventListeners() {
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleFilterChangeWithAnnouncement, 300));
  }

  // Category filter
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleFilterChangeWithAnnouncement);
  }

  // License filter
  if (licenseFilter) {
    licenseFilter.addEventListener('change', handleFilterChangeWithAnnouncement);
  }

  // Clear filters button
  if (clearFiltersButton) {
    clearFiltersButton.addEventListener('click', clearFilters);
  }

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

function clearFilters() {
  searchInput.value = '';
  categoryFilter.value = '';
  licenseFilter.value = '';
  renderProjects();
  updateClearFiltersButton();
  searchInput.focus();
}

function updateClearFiltersButton() {
  const hasFilters = searchInput.value || categoryFilter.value || licenseFilter.value;
  clearFiltersButton.disabled = !hasFilters;
}

function getFilteredProjects() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;
  const selectedLicense = licenseFilter.value;

  return projectsData.filter(project => {
    // Search filter
    const matchesSearch = !searchTerm || 
      project.name.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm));

    // Category filter
    const matchesCategory = !selectedCategory || project.category === selectedCategory;

    // License filter
    const matchesLicense = !selectedLicense || project.license === selectedLicense;

    return matchesSearch && matchesCategory && matchesLicense;
  });
}

function renderProjects() {
  const filteredProjects = getFilteredProjects();
  
  // Update results count
  updateResultsCount(filteredProjects.length);
  
  // Show/hide no results message
  if (filteredProjects.length === 0) {
    projectsContainer.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }
  
  projectsContainer.style.display = 'grid';
  noResults.style.display = 'none';
  
  // Render project cards
  projectsContainer.innerHTML = filteredProjects.map(project => createProjectCard(project)).join('');
}

function updateResultsCount(count) {
  const total = projectsData.length;
  const text = count === total 
    ? `Showing all ${count} projects`
    : `Showing ${count} of ${total} projects`;
  resultsCount.textContent = text;
}

function createProjectCard(project) {
  const licenseName = licenseNames[project.license] || project.license;
  const categoryName = categoryNames[project.category] || project.category;
  
  return `
    <article class="project-card" tabindex="0" role="article">
      <div class="project-content">
        <div class="project-info">
          <h3 class="project-name">
            <a href="${project.homepage}" target="_blank" rel="noopener" aria-label="Visit ${project.name} homepage">
              ${project.name}
            </a>
          </h3>
          <p class="project-description">
            ${project.pageDescription || project.description}
          </p>
        </div>
        <div class="project-meta">
          <div class="project-tags">
            <span class="project-tag" aria-label="Category: ${categoryName}">${categoryName}</span>
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
          </div>
          
          <div class="project-license">
            <span class="license-badge" aria-label="License: ${licenseName}">${licenseName}</span>
          </div>
          
          <div class="project-links">
            <a href="${project.repository}" target="_blank" rel="noopener" class="project-link" aria-label="View ${project.name} source code">
              Source
            </a>
            <a href="${project.homepage}" target="_blank" rel="noopener" class="project-link" aria-label="Visit ${project.name} homepage">
              Website
            </a>
          </div>
        </div>
      </div>
    </article>
  `;
}

// Keyboard navigation for project cards
function handleKeyboardNavigation(event) {
  // Only handle keys when focus is on a project card
  if (!event.target.closest('.project-card')) {
    return;
  }

  const cards = Array.from(document.querySelectorAll('.project-card'));
  const currentIndex = cards.indexOf(event.target.closest('.project-card'));
  
  let nextIndex = currentIndex;
  
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = (currentIndex + 1) % cards.length;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = (currentIndex - 1 + cards.length) % cards.length;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = cards.length - 1;
      break;
    default:
      return;
  }
  
  if (nextIndex !== currentIndex) {
    event.preventDefault();
    cards[nextIndex].focus();
  }
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Accessibility enhancements
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'visually-hidden';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Enhanced filter change handler with screen reader announcements
function handleFilterChangeWithAnnouncement() {
  const filteredProjects = getFilteredProjects();
  const count = filteredProjects.length;
  
  renderProjects();
  updateClearFiltersButton();
  
  // Announce filter results to screen readers
  const message = count === 0 
    ? 'No projects found with current filters'
    : `Found ${count} projects with current filters`;
  announceToScreenReader(message);
}
