/**
 * Content search functionality for explore page
 * Searches through post titles and content
 */

(function() {
  'use strict';

  let allPosts = [];
  let searchTimeout;
  let currentSearchTerm = '';

  // Initialize content search
  function initContentSearch() {
    collectPostData();
    setupSearchInterface();
    setupListInteractions();
  }

  // Collect post data from DOM and fetch content
  async function collectPostData() {
    const listItems = document.querySelectorAll('#post-list li');

    allPosts = await Promise.all(Array.from(listItems).map(async (item) => {
      const link = item.querySelector('a');
      const post = {
        element: item,
        id: item.dataset.id,
        tags: item.dataset.tags.split(',').filter(tag => tag.trim() !== ''),
        title: link.textContent.toLowerCase(),
        url: link.href,
        content: '' // Will be populated if needed
      };

      // For now, just search titles. Could fetch full content if needed
      return post;
    }));
  }

  // Setup search interface
  function setupSearchInterface() {
    const searchInput = document.getElementById('content-search');
    const clearBtn = document.getElementById('clear-search-btn');
    const searchStatus = document.getElementById('search-status');

    // Handle search input with debouncing
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();

      if (query === '') {
        clearSearch();
        return;
      }

      clearBtn.style.display = 'inline-block';

      // Debounce search
      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 300);
    });

    // Clear search button
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearch();
    });

    // Keyboard shortcuts
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        clearSearch();
        searchInput.blur();
      }
    });
  }

  // Perform content search
  function performSearch(query) {
    currentSearchTerm = query.toLowerCase();
    let matchCount = 0;

    allPosts.forEach(post => {
      // Search in title and tags
      const titleMatch = post.title.includes(currentSearchTerm);
      const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(currentSearchTerm));

      if (titleMatch || tagMatch) {
        post.element.style.display = '';
        post.element.classList.add('search-match');
        matchCount++;

        // Highlight matching text in title if needed
        highlightSearchTerm(post.element, currentSearchTerm);
      } else {
        post.element.style.display = 'none';
        post.element.classList.remove('search-match');
      }
    });

    // Update search status
    updateSearchStatus(matchCount, query);

    // Update network graph filtering
    updateNetworkGraph(matchCount > 0 ? getMatchingPostIds() : []);
  }

  // Clear search and show all posts
  function clearSearch() {
    currentSearchTerm = '';
    const clearBtn = document.getElementById('clear-search-btn');
    const searchStatus = document.getElementById('search-status');

    clearBtn.style.display = 'none';
    searchStatus.style.display = 'none';

    allPosts.forEach(post => {
      post.element.style.display = '';
      post.element.classList.remove('search-match');
      removeHighlights(post.element);
    });

    // Reset network graph
    if (window.networkGraph && typeof window.networkGraph.resetGraph === 'function') {
      window.networkGraph.resetGraph();
    }
  }

  // Update search status message
  function updateSearchStatus(count, query) {
    const searchStatus = document.getElementById('search-status');

    if (count === 0) {
      searchStatus.textContent = `No posts found for "${query}"`;
      searchStatus.style.display = 'block';
    } else if (count === 1) {
      searchStatus.textContent = `1 post found for "${query}"`;
      searchStatus.style.display = 'block';
    } else {
      searchStatus.textContent = `${count} posts found for "${query}"`;
      searchStatus.style.display = 'block';
    }
  }

  // Highlight search term in post element
  function highlightSearchTerm(element, term) {
    const link = element.querySelector('a');
    const originalText = link.textContent;

    // Simple highlight by wrapping matching text
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    if (originalText.toLowerCase().includes(term)) {
      // Store original text for restoration
      if (!link.dataset.originalText) {
        link.dataset.originalText = originalText;
      }

      link.innerHTML = originalText.replace(regex, '<mark>$1</mark>');
    }
  }

  // Remove highlights from element
  function removeHighlights(element) {
    const link = element.querySelector('a');
    if (link.dataset.originalText) {
      link.textContent = link.dataset.originalText;
      delete link.dataset.originalText;
    }
  }

  // Escape special regex characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Get IDs of matching posts
  function getMatchingPostIds() {
    return allPosts
      .filter(post => post.element.style.display !== 'none')
      .map(post => post.id);
  }

  // Update network graph with filtered posts
  function updateNetworkGraph(matchingIds) {
    if (window.networkGraph && typeof window.networkGraph.filterByPosts === 'function') {
      window.networkGraph.filterByPosts(matchingIds);
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

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContentSearch);
  } else {
    initContentSearch();
  }

})();