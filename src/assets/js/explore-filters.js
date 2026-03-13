/**
 * Explore page filter integration
 * Connects sidebar tag filters with the network graph
 */

(function() {
  'use strict';

  let selectedTags = new Set();
  let isUpdatingFromNetwork = false;
  let allTags = [];
  let allPosts = [];

  // Initialize filter integration
  function initFilters() {
    // Collect all available tags and posts
    collectData();

    // Wait for network graph to be initialized
    setTimeout(() => {
      setupSearchInterface();
      setupListInteractions();
    }, 1000);
  }

  // Collect all tags and posts from the DOM
  function collectData() {
    const listItems = document.querySelectorAll('#post-list li');
    const tagSet = new Set();

    allPosts = Array.from(listItems).map(item => ({
      element: item,
      id: item.dataset.id,
      tags: item.dataset.tags.split(',').filter(tag => tag.trim() !== ''),
      title: item.querySelector('a').textContent
    }));

    allPosts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });

    allTags = Array.from(tagSet).sort();
  }

  // Setup search interface
  function setupSearchInterface() {
    const searchInput = document.getElementById('tag-search');
    const showAllBtn = document.getElementById('show-all-btn');
    const searchResults = document.getElementById('search-results');

    // Setup search input
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', showSearchResults);
    searchInput.addEventListener('blur', () => {
      // Delay hiding to allow clicking on results
      setTimeout(() => hideSearchResults(), 150);
    });

    // Add keyboard shortcuts
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        clearAllTags();
        searchInput.blur();
      }
    });

    // Setup show all button
    showAllBtn.addEventListener('click', () => {
      if (!isUpdatingFromNetwork) {
        clearAllTags();
      }
    });

    // Handle outside clicks
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.tag-filters')) {
        hideSearchResults();
      }
    });
  }

  // Handle search input
  function handleSearchInput(e) {
    const query = e.target.value.toLowerCase().trim();

    if (query === '') {
      hideSearchResults();
      return;
    }

    const matchedTags = allTags.filter(tag =>
      tag.toLowerCase().includes(query) && !selectedTags.has(tag)
    );

    displaySearchResults(matchedTags);
  }

  // Display search results
  function displaySearchResults(matchedTags) {
    const searchResults = document.getElementById('search-results');

    if (matchedTags.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No tags found</div>';
    } else {
      searchResults.innerHTML = matchedTags.map(tag =>
        `<button type="button" class="search-result-tag" data-tag="${tag}">${tag}</button>`
      ).join('');

      // Add click handlers to result tags
      searchResults.querySelectorAll('.search-result-tag').forEach(btn => {
        btn.addEventListener('click', () => {
          const tag = btn.dataset.tag;
          addTag(tag);
          clearSearchInput();
          hideSearchResults();
        });
      });
    }

    showSearchResults();
  }

  // Show search results
  function showSearchResults() {
    const searchResults = document.getElementById('search-results');
    searchResults.style.display = 'block';
  }

  // Hide search results
  function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    searchResults.style.display = 'none';
  }

  // Add a tag to selection
  function addTag(tag) {
    if (selectedTags.has(tag)) return; // Already selected

    selectedTags.add(tag);
    updateTagChips();
    filterPosts();
    updateShowAllButton();

    // Update network graph if not triggered by network
    if (!isUpdatingFromNetwork) {
      triggerNetworkFilter(Array.from(selectedTags)[0]); // Pass first tag for now
    }
  }

  // Remove a tag from selection
  function removeTag(tag) {
    selectedTags.delete(tag);
    updateTagChips();
    filterPosts();
    updateShowAllButton();

    // Update network graph
    if (!isUpdatingFromNetwork) {
      if (selectedTags.size === 0) {
        triggerNetworkFilter('all');
      } else {
        triggerNetworkFilter(Array.from(selectedTags)[0]);
      }
    }
  }

  // Clear search input only
  function clearSearchInput() {
    const searchInput = document.getElementById('tag-search');
    searchInput.value = '';
  }

  // Clear all selected tags
  function clearAllTags() {
    selectedTags.clear();
    clearSearchInput();
    updateTagChips();
    filterPosts();
    updateShowAllButton();
    hideSearchResults();

    // Update network graph
    if (!isUpdatingFromNetwork) {
      triggerNetworkFilter('all');
    }
  }

  // Update tag chips display
  function updateTagChips() {
    const selectedTagsEl = document.getElementById('selected-tags');

    if (selectedTags.size === 0) {
      selectedTagsEl.style.display = 'none';
      return;
    }

    selectedTagsEl.style.display = 'flex';
    selectedTagsEl.innerHTML = Array.from(selectedTags).map(tag =>
      `<span class="tag-chip">
        ${tag}
        <button type="button" class="tag-chip-remove" data-tag="${tag}" aria-label="Remove ${tag} tag">×</button>
       </span>`
    ).join('');

    // Add click handlers to remove buttons
    selectedTagsEl.querySelectorAll('.tag-chip-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.tag;
        removeTag(tag);
      });
    });
  }

  // Update show all button state
  function updateShowAllButton() {
    const showAllBtn = document.getElementById('show-all-btn');
    showAllBtn.classList.toggle('active', selectedTags.size === 0);
  }

  // Filter posts by selected tags (OR logic)
  function filterPosts() {
    allPosts.forEach(post => {
      if (selectedTags.size === 0) {
        // No tags selected - show all
        post.element.style.display = '';
      } else {
        // Show post if it has ANY of the selected tags
        const hasSelectedTag = post.tags.some(tag => selectedTags.has(tag));
        post.element.style.display = hasSelectedTag ? '' : 'none';
      }
    });
  }

  // Trigger network graph filtering
  function triggerNetworkFilter(tag) {
    // Check if the network graph filterByTag function exists
    if (window.networkGraph && typeof window.networkGraph.filterByTag === 'function') {
      if (tag === 'all' || selectedTags.size === 0) {
        window.networkGraph.resetGraph();
      } else {
        window.networkGraph.filterByTag(tag);
      }
    }
  }

  // Setup list item interactions with graph
  function setupListInteractions() {
    const listItems = document.querySelectorAll('#post-list li');

    listItems.forEach(item => {
      item.addEventListener('pointerenter', () => {
        const id = item.dataset.id;
        highlightNodeInGraph(id, true);
      });

      item.addEventListener('pointerleave', () => {
        const id = item.dataset.id;
        highlightNodeInGraph(id, false);
      });
    });
  }

  // Highlight corresponding node in graph
  function highlightNodeInGraph(id, active) {
    if (window.networkGraph && typeof window.networkGraph.highlightNode === 'function') {
      window.networkGraph.highlightNode(id, active);
    }
  }

  // External API for network graph to update sidebar
  function updateFromNetwork(tag) {
    isUpdatingFromNetwork = true;
    if (tag === 'all') {
      clearAllTags();
    } else {
      // Clear existing tags and add the new one (for network graph clicks)
      selectedTags.clear();
      addTag(tag);
    }
    setTimeout(() => {
      isUpdatingFromNetwork = false;
    }, 100);
  }

  // Expose API for external access
  window.exploreFilters = {
    updateFromNetwork: updateFromNetwork
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilters);
  } else {
    initFilters();
  }

})();