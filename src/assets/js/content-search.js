/**
 * Content search for explore page
 * Searches through post titles, tags, and full content
 */

(function() {
  'use strict';

  let allPosts = [];
  let searchIndex = [];
  let searchTimeout;
  let currentSearchTerm = '';

  async function initContentSearch() {
    collectPostData();
    await loadSearchIndex();
    setupSearchInterface();
    setupListInteractions();
  }

  // Collect post data from DOM
  function collectPostData() {
    const listItems = document.querySelectorAll('#post-list li');

    allPosts = Array.from(listItems).map(item => {
      const titleEl = item.querySelector('.post-title');
      const pillLink = item.querySelector('.go-to-post-link');
      return {
        element: item,
        id: item.dataset.id,
        tags: item.dataset.tags.split(',').filter(tag => tag.trim() !== ''),
        title: (titleEl ? titleEl.textContent : '').toLowerCase(),
        url: pillLink ? pillLink.href : ''
      };
    });
  }

  // Load full-text search index
  async function loadSearchIndex() {
    try {
      const prefix = document.body.dataset.pathPrefix || '/';
      const response = await fetch(prefix + 'data/search-index.json');
      if (response.ok) {
        searchIndex = await response.json();
      }
    } catch (e) {
      // Fall back to title-only search
      console.warn('Search index not available, using title-only search');
    }
  }

  function setupSearchInterface() {
    const searchInput = document.getElementById('content-search');

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();

      if (query === '') {
        clearSearch();
        return;
      }

      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 300);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        clearSearch();
        searchInput.blur();
      }
    });
  }

  function performSearch(query) {
    currentSearchTerm = query.toLowerCase();
    let matchCount = 0;

    allPosts.forEach(post => {
      const titleMatch = post.title.includes(currentSearchTerm);
      const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(currentSearchTerm));

      // Full-text content search from index
      let contentMatch = false;
      const indexEntry = searchIndex.find(entry => entry.id === post.id);
      if (indexEntry && indexEntry.content) {
        contentMatch = indexEntry.content.toLowerCase().includes(currentSearchTerm);
      }

      if (titleMatch || tagMatch || contentMatch) {
        post.element.style.display = '';
        post.element.classList.add('search-match');
        matchCount++;
        highlightSearchTerm(post.element, currentSearchTerm);
      } else {
        post.element.style.display = 'none';
        post.element.classList.remove('search-match');
      }
    });

    updateSearchStatus(matchCount, query);
    updateNetworkGraph(matchCount > 0 ? getMatchingPostIds() : []);
  }

  function clearSearch() {
    currentSearchTerm = '';
    const searchStatus = document.getElementById('search-status');
    searchStatus.style.display = 'none';

    allPosts.forEach(post => {
      post.element.style.display = '';
      post.element.classList.remove('search-match');
      removeHighlights(post.element);
    });

    if (window.networkGraph && typeof window.networkGraph.resetGraph === 'function') {
      window.networkGraph.resetGraph();
    }
  }

  function updateSearchStatus(count, query) {
    const searchStatus = document.getElementById('search-status');
    if (count === 0) {
      searchStatus.textContent = `No posts found for "${query}"`;
    } else {
      searchStatus.textContent = `${count} post${count === 1 ? '' : 's'} found`;
    }
    searchStatus.style.display = 'block';
  }

  function highlightSearchTerm(element, term) {
    const titleEl = element.querySelector('.post-title');
    if (!titleEl) return;
    const originalText = titleEl.textContent;
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');

    if (originalText.toLowerCase().includes(term)) {
      if (!titleEl.dataset.originalText) {
        titleEl.dataset.originalText = originalText;
      }
      titleEl.innerHTML = originalText.replace(regex, '<mark>$1</mark>');
    }
  }

  function removeHighlights(element) {
    const titleEl = element.querySelector('.post-title');
    if (titleEl && titleEl.dataset.originalText) {
      titleEl.textContent = titleEl.dataset.originalText;
      delete titleEl.dataset.originalText;
    }
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function getMatchingPostIds() {
    return allPosts
      .filter(post => post.element.style.display !== 'none')
      .map(post => post.id);
  }

  function updateNetworkGraph(matchingIds) {
    if (window.networkGraph && typeof window.networkGraph.filterByPosts === 'function') {
      window.networkGraph.filterByPosts(matchingIds);
    }
  }

  function setupListInteractions() {
    const listItems = document.querySelectorAll('#post-list li');

    listItems.forEach(item => {
      // Hover highlights graph node
      item.addEventListener('pointerenter', () => {
        highlightNodeInGraph(item.dataset.id, true);
      });

      item.addEventListener('pointerleave', () => {
        highlightNodeInGraph(item.dataset.id, false);
      });

      // Click on list item (not the pill link) selects in graph
      item.addEventListener('click', (e) => {
        if (e.target.closest('.go-to-post-link')) return;
        if (window.networkGraph && typeof window.networkGraph.selectPost === 'function') {
          window.networkGraph.selectPost(item.dataset.id);
        }
      });
    });

    // Listen for graph post selection events
    document.addEventListener('graph:postSelected', (e) => {
      const postId = e.detail.postId;
      highlightSidebarPost(postId);
    });
  }

  // Highlight and scroll to a post in the sidebar
  function highlightSidebarPost(postId) {
    const listItems = document.querySelectorAll('#post-list li');

    listItems.forEach(item => {
      item.classList.remove('selected');
    });

    if (!postId) return;

    const targetItem = document.querySelector(`#post-list li[data-id="${postId}"]`);
    if (targetItem) {
      targetItem.classList.add('selected');
      targetItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function highlightNodeInGraph(id, active) {
    if (window.networkGraph && typeof window.networkGraph.highlightNode === 'function') {
      window.networkGraph.highlightNode(id, active);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContentSearch);
  } else {
    initContentSearch();
  }

})();
