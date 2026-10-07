document.addEventListener('DOMContentLoaded', () => {
  const dataEl = document.getElementById('filter-data');
  if (!dataEl) return;

  const data = JSON.parse(dataEl.textContent);
  
  const buttons = {
    topics: document.getElementById('btn-topics'),
    companies: document.getElementById('btn-companies'),
    otherTags: document.getElementById('btn-tags'),
    sort: document.getElementById('btn-sort')
  };

  const popovers = {
    topics: document.getElementById('popover-topics'),
    companies: document.getElementById('popover-companies'),
    otherTags: document.getElementById('popover-tags'),
    sort: document.getElementById('popover-sort')
  };

  let currentOpenPopover = null;
  let activeFilters = {
    topics: new Set(),
    companies: new Set(),
    otherTags: new Set()
  };
  let currentSort = 'default';

  // State management
  function togglePopover(type, buttonEl) {
    if (currentOpenPopover === type) {
      popovers[type].style.display = 'none';
      buttonEl.classList.remove('active');
      currentOpenPopover = null;
    } else {
      // Close existing
      if (currentOpenPopover) {
        popovers[currentOpenPopover].style.display = 'none';
        buttons[currentOpenPopover].classList.remove('active');
      }
      
      // Position popover under button
      const rect = buttonEl.getBoundingClientRect();
      const barRect = document.getElementById('filter-bar').getBoundingClientRect();
      
      popovers[type].style.left = `${rect.left - barRect.left}px`;
      popovers[type].style.top = `${rect.bottom - barRect.top + 8}px`;
      popovers[type].style.display = 'flex';
      
      buttonEl.classList.add('active');
      currentOpenPopover = type;

      // Focus search if exists
      const searchInput = popovers[type].querySelector('input[type="text"]');
      if (searchInput) searchInput.focus();
    }
  }

  // Event Listeners for Buttons
  Object.keys(buttons).forEach(type => {
    if (buttons[type]) {
      buttons[type].addEventListener('click', (e) => {
        e.stopPropagation();
        togglePopover(type, buttons[type]);
      });
    }
  });

  // Close popover when clicking outside
  document.addEventListener('click', (e) => {
    if (currentOpenPopover && !e.target.closest('.popover-container') && !e.target.closest('.filter-btn')) {
      popovers[currentOpenPopover].style.display = 'none';
      buttons[currentOpenPopover].classList.remove('active');
      currentOpenPopover = null;
    }
  });

  // Search inside popovers
  document.querySelectorAll('.popover-search input').forEach(input => {
    input.addEventListener('input', (e) => {
      const type = e.target.dataset.filterType;
      const term = e.target.value.toLowerCase();
      const labels = popovers[type].querySelectorAll('.facet-label');
      
      labels.forEach(label => {
        const text = label.querySelector('span').textContent.toLowerCase();
        label.style.display = text.includes(term) ? 'flex' : 'none';
      });
    });
  });

  // Handle Checkbox changes
  document.querySelectorAll('.facet-label input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const type = e.target.dataset.type;
      const value = e.target.value;
      
      if (e.target.checked) {
        activeFilters[type].add(value);
      } else {
        activeFilters[type].delete(value);
      }
      
      updateUI();
      applyFiltersAndSort();
    });
  });

  // Handle Sort changes
  document.querySelectorAll('.sort-label input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        currentSort = e.target.value;
        applyFiltersAndSort();
        // auto-close sort popover
        popovers.sort.style.display = 'none';
        buttons.sort.classList.remove('active');
        currentOpenPopover = null;
      }
    });
  });

  // Clear all button
  const clearAllBtn = document.getElementById('clear-all-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      activeFilters.topics.clear();
      activeFilters.companies.clear();
      activeFilters.otherTags.clear();
      
      // Uncheck all checkboxes
      document.querySelectorAll('.facet-label input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
      
      updateUI();
      applyFiltersAndSort();
    });
  }

  // Update active chips UI
  function updateUI() {
    const container = document.getElementById('active-filters');
    
    // Remove dynamic chips
    container.querySelectorAll('.dynamic-chip').forEach(el => el.remove());
    
    let hasFilters = false;
    
    Object.keys(activeFilters).forEach(type => {
      activeFilters[type].forEach(value => {
        hasFilters = true;
        const chip = document.createElement('span');
        chip.className = 'active-chip dynamic-chip';
        chip.innerHTML = `${value} <button data-type="${type}" data-value="${value}">✕</button>`;
        
        chip.querySelector('button').addEventListener('click', (e) => {
          const t = e.target.dataset.type;
          const v = e.target.dataset.value;
          activeFilters[t].delete(v);
          
          // uncheck corresponding checkbox
          const cb = document.querySelector(`input[type="checkbox"][data-type="${t}"][value="${v}"]`);
          if (cb) cb.checked = false;
          
          updateUI();
          applyFiltersAndSort();
        });
        
        container.insertBefore(chip, clearAllBtn);
      });
    });

    if (clearAllBtn) {
      clearAllBtn.style.display = hasFilters ? 'inline-block' : 'none';
    }
  }

  // Filter and Sort Logic
  function applyFiltersAndSort() {
    // 1. Filter
    const matchedSlugs = new Set();
    
    data.problems.forEach(p => {
      let matches = true;
      
      // AND across categories. OR within category (handled by checking if intersection > 0)
      if (activeFilters.topics.size > 0) {
        const intersection = p.topics.filter(x => activeFilters.topics.has(x));
        if (intersection.length === 0) matches = false;
      }
      
      if (matches && activeFilters.companies.size > 0) {
        const intersection = p.companies.filter(x => activeFilters.companies.has(x));
        if (intersection.length === 0) matches = false;
      }
      
      if (matches && activeFilters.otherTags.size > 0) {
        const intersection = p.otherTags.filter(x => activeFilters.otherTags.has(x));
        if (intersection.length === 0) matches = false;
      }
      
      if (matches) matchedSlugs.add(p.slug);
    });

    // Update count
    const countEl = document.getElementById('filter-count');
    if (countEl) {
      countEl.textContent = `Showing ${matchedSlugs.size} of ${data.problems.length}`;
    }

    // 2. Sort & DOM Update
    const sections = Array.from(document.querySelectorAll('.difficulty-section'));
    let sortedProblems = [...data.problems].filter(p => matchedSlugs.has(p.slug));
    
    // Default order is what's already in the DOM (grouped by difficulty).
    // If not default sort, we might need to break difficulty groupings. 
    // Actually, sorting inside difficulty groups is easier, but user might expect global sort.
    // Given the DOM structure (grouped in details), we can just sort the elements WITHIN each details grid.
    
    sections.forEach(section => {
      const grid = section.querySelector('.card-grid');
      if (!grid) return;
      
      const cards = Array.from(grid.querySelectorAll('.problem-wrapper'));
      let visibleCount = 0;
      
      // Sort logic
      cards.sort((a, b) => {
        const slugA = a.dataset.slug;
        const slugB = b.dataset.slug;
        const probA = data.problems.find(p => p.slug === slugA);
        const probB = data.problems.find(p => p.slug === slugB);
        
        if (currentSort === 'title-asc') return probA.title.localeCompare(probB.title);
        if (currentSort === 'title-desc') return probB.title.localeCompare(probA.title);
        
        // Difficulty sorts usually apply globally, but since we are bounded by sections, 
        // diff sorting within a single diff section is a no-op. 
        // A true global sort requires flattening the DOM, which breaks the details/summary.
        // For simplicity, we just sort by title within sections if requested.
        return 0;
      });

      // Apply visibility and order
      cards.forEach(card => {
        if (matchedSlugs.has(card.dataset.slug)) {
          card.style.display = 'contents'; // restore original display
          grid.appendChild(card); // re-append in sorted order
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Hide section if empty
      section.style.display = visibleCount > 0 ? 'block' : 'none';

      // Update count in heading
      const titleSpan = section.querySelector('.difficulty-title span:first-child');
      if (titleSpan) {
        const baseName = titleSpan.textContent.split(' (')[0];
        titleSpan.textContent = `${baseName} (${visibleCount})`;
      }
    });
  }
});
