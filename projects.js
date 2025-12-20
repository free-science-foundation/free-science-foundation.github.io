// Free Software Foundation Projects Page JavaScript
// Client-side filtering and project display functionality

// Sample project data - in a real implementation, this would come from an API
const projectsData = [
  {
    id: 1,
    name: "GNU Core Utilities",
    description: "The basic file, shell and text manipulation utilities of the GNU operating system.",
    category: "system",
    tags: ["utilities", "system", "command-line"],
    license: "gplv3",
    homepage: "https://www.gnu.org/software/coreutils/",
    repository: "https://github.com/coreutils/coreutils",
    stars: 8547,
    language: "C"
  },
  {
    id: 2,
    name: "GNU Compiler Collection",
    description: "The GNU Compiler Collection includes front ends for C, C++, Objective-C, Fortran, Ada, Go, and D.",
    category: "development",
    tags: ["compiler", "development", "programming"],
    license: "gplv3",
    homepage: "https://gcc.gnu.org/",
    repository: "https://github.com/gcc-mirror/gcc",
    stars: 12468,
    language: "C++"
  },
  {
    id: 3,
    name: "GNU Emacs",
    description: "An extensible, customizable, free/libre text editor — and more.",
    category: "development",
    tags: ["editor", "development", "lisp"],
    license: "gplv3",
    homepage: "https://www.gnu.org/software/emacs/",
    repository: "https://github.com/emacs-mirror/emacs",
    stars: 5234,
    language: "C"
  },
  {
    id: 4,
    name: "GIMP",
    description: "GNU Image Manipulation Program - a free and open-source raster graphics editor.",
    category: "multimedia",
    tags: ["graphics", "image-editing", "multimedia"],
    license: "gplv3",
    homepage: "https://www.gimp.org/",
    repository: "https://gitlab.gnome.org/GNOME/gimp",
    stars: 8921,
    language: "C"
  },
  {
    id: 5,
    name: "Inkscape",
    description: "Professional vector graphics editor for Linux, Windows, macOS.",
    category: "multimedia",
    tags: ["graphics", "vector", "svg"],
    license: "gplv3",
    homepage: "https://inkscape.org/",
    repository: "https://gitlab.com/inkscape/inkscape",
    stars: 15672,
    language: "C++"
  },
  {
    id: 6,
    name: "GNU Bash",
    description: "The GNU Bourne-Again SHell is the shell or command language interpreter.",
    category: "system",
    tags: ["shell", "system", "command-line"],
    license: "gplv3",
    homepage: "https://www.gnu.org/software/bash/",
    repository: "https://git.savannah.gnu.org/cgit/bash.git",
    stars: 3947,
    language: "C"
  },
  {
    id: 7,
    name: "GNU Privacy Guard",
    description: "Complete and free implementation of the OpenPGP standard as defined by RFC4880.",
    category: "utilities",
    tags: ["security", "encryption", "privacy"],
    license: "gplv3",
    homepage: "https://gnupg.org/",
    repository: "https://git.gnupg.org/cgi-bin/gitweb.cgi?p=gnupg.git",
    stars: 2845,
    language: "C"
  },
  {
    id: 8,
    name: "LibreOffice",
    description: "The LibreOffice office suite - a complete open-source productivity suite.",
    category: "utilities",
    tags: ["office", "productivity", "documents"],
    license: "mplv2",
    homepage: "https://www.libreoffice.org/",
    repository: "https://github.com/LibreOffice/core",
    stars: 8456,
    language: "C++"
  },
  {
    id: 9,
    name: "GNU Octave",
    description: "High-level interpreted language for numerical computations.",
    category: "education",
    tags: ["mathematics", "scientific", "education"],
    license: "gplv3",
    homepage: "https://www.gnu.org/software/octave/",
    repository: "https://hg.savannah.gnu.org/hgweb/octave/",
    stars: 2156,
    language: "C++"
  },
  {
    id: 10,
    name: "GNU Health",
    description: "Free Health and Hospital Information System.",
    category: "utilities",
    tags: ["health", "medical", "management"],
    license: "gplv3",
    homepage: "https://www.gnuhealth.org/",
    repository: "https://hg.savannah.gnu.org/hgweb/health/",
    stars: 523,
    language: "Python"
  },
  {
    id: 11,
    name: "GNU Parallel",
    description: "Shell tool for executing jobs in parallel using one or more computers.",
    category: "system",
    tags: ["system", "parallel", "shell"],
    license: "gplv3",
    homepage: "https://www.gnu.org/software/parallel/",
    repository: "https://git.savannah.gnu.org/cgit/parallel.git",
    stars: 1823,
    language: "Perl"
  },
  {
    id: 12,
    name: "GNU Make",
    description: "Tool which controls the generation of executables and other non-source files.",
    category: "development",
    tags: ["build", "development", "tools"],
    license: "gplv3",
    homepage: "https://www.gnu.org/software/make/",
    repository: "https://git.savannah.gnu.org/cgit/make.git",
    stars: 1432,
    language: "C"
  },
  {
    id: 13,
    name: "GNU Nano",
    description: "Small, friendly text editor inspired by Pico.",
    category: "development",
    tags: ["editor", "terminal", "text"],
    license: "gplv3",
    homepage: "https://www.nano-editor.org/",
    repository: "https://git.savannah.gnu.org/cgit/nano.git",
    stars: 892,
    language: "C"
  },
  {
    id: 14,
    name: "GNU wget",
    description: "GNU Wget is a free utility for non-interactive download of files from the Web.",
    category: "utilities",
    tags: ["network", "download", "web"],
    license: "gplv3",
    homepage: "https://www.gnu.org/software/wget/",
    repository: "https://git.savannah.gnu.org/cgit/wget.git",
    stars: 2678,
    language: "C"
  },
  {
    id: 15,
    name: "GNU Guile",
    description: "GNU extension language and Scheme interpreter.",
    category: "development",
    tags: ["scheme", "lisp", "interpreter"],
    license: "gplv3",
    homepage: "https://www.gnu.org/software/guile/",
    repository: "https://git.savannah.gnu.org/cgit/guile.git",
    stars: 734,
    language: "C"
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
  'mplv2': 'MPL v2'
};

// Category display names
const categoryNames = {
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

  // Set up event listeners
  setupEventListeners();
  
  // Initial render
  renderProjects();
});

function setupEventListeners() {
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleFilterChange, 300));
  }

  // Category filter
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleFilterChange);
  }

  // License filter
  if (licenseFilter) {
    licenseFilter.addEventListener('change', handleFilterChange);
  }

  // Clear filters button
  if (clearFiltersButton) {
    clearFiltersButton.addEventListener('click', clearFilters);
  }

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

function handleFilterChange() {
  renderProjects();
  updateClearFiltersButton();
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
      <div class="project-header">
        <h3 class="project-name">
          <a href="${project.homepage}" target="_blank" rel="noopener" aria-label="Visit ${project.name} homepage">
            ${project.name}
          </a>
        </h3>
      </div>
      
      <p class="project-description">
        ${project.description}
      </p>
      
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

// Replace the original handler with the enhanced version
document.addEventListener('DOMContentLoaded', function() {
  // ... existing initialization code ...
  
  // Replace the filter change handler
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleFilterChangeWithAnnouncement, 300));
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleFilterChangeWithAnnouncement);
  }
  if (licenseFilter) {
    licenseFilter.addEventListener('change', handleFilterChangeWithAnnouncement);
  }
});
