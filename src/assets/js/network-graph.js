/**
 * Interactive Obsidian-Style Network Graph
 * Creates a force-directed network visualization of blog posts and tags
 */

(function() {
  'use strict';

  // Configuration based on research findings
  const config = {
    forces: {
      link: { distance: 80, strength: 0.7 },
      charge: { strength: -120, theta: 0.8 },
      center: { strength: 1.5 },
      collision: { radius: 20, strength: 0.7 }
    },
    nodes: {
      post: { radius: 10, color: '#D2691E' },
      tag: { radius: 8, color: '#E8943B', rx: 12, ry: 8 }
    },
    animation: {
      velocityDecay: 0.4,
      alphaMin: 0.001,
      alphaTarget: 0.3
    },
    performance: { targetFPS: 30 }
  };

  // State management
  let simulation;
  let svg, container, width, height;
  let nodes = [], links = [];
  let nodeElements, linkElements, labelElements;
  let hoveredNode = null;
  let filteredTag = null;

  // Initialize the network graph
  async function init() {
    try {
      showStatus('Loading network graph...');

      const data = await loadGraphData();

      if (!data || !data.nodes || !data.links) {
        throw new Error('Invalid data structure');
      }

      setupSVG();
      processData(data);
      createVisualization();
      setupInteractions();

      showStatus('');
    } catch (error) {
      console.error('Failed to initialize network graph:', error);
      showError('Failed to load graph data');
    }
  }

  // Load data from JSON endpoint
  async function loadGraphData() {
    const response = await fetch('/data/network-graph.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // Setup SVG container and dimensions
  function setupSVG() {
    const svgElement = d3.select('#network-graph-svg');
    const rect = svgElement.node().getBoundingClientRect();

    width = rect.width || 800;
    height = rect.height || 500;

    svg = svgElement
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Create main group for zoom/pan
    svg.selectAll('*').remove();
    container = svg.append('g').attr('class', 'graph-container');
  }

  // Process and prepare data for D3.js
  function processData(data) {
    nodes = data.nodes.map(d => ({
      ...d,
      degree: 0, // Will be calculated
      x: width / 2 + (Math.random() - 0.5) * 100, // Initial position near center
      y: height / 2 + (Math.random() - 0.5) * 100
    }));

    links = data.links.map(d => ({
      ...d,
      source: d.source,
      target: d.target
    }));

    // Calculate node degrees for layout optimization
    links.forEach(link => {
      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);
      if (sourceNode) sourceNode.degree++;
      if (targetNode) targetNode.degree++;
    });
  }

  // Create the D3.js force simulation and visualization
  function createVisualization() {
    // Create force simulation with optimized settings
    simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(config.forces.link.distance)
        .strength(link => {
          // Hub dampening for better layout
          const sourceDegree = link.source.degree || 1;
          const targetDegree = link.target.degree || 1;
          return config.forces.link.strength / Math.min(sourceDegree, targetDegree);
        }))
      .force('charge', d3.forceManyBody()
        .strength(config.forces.charge.strength)
        .theta(config.forces.charge.theta))
      .force('center', d3.forceCenter(width / 2, height / 2)
        .strength(config.forces.center.strength))
      .force('collision', d3.forceCollide()
        .radius(d => (d.type === 'post' ? config.nodes.post.radius : config.nodes.tag.radius) + config.forces.collision.radius)
        .strength(config.forces.collision.strength))
      .velocityDecay(config.animation.velocityDecay)
      .alphaMin(config.animation.alphaMin);

    // Create links (must be added first for proper layering)
    linkElements = container
      .selectAll('.graph-edge')
      .data(links)
      .join('line')
      .attr('class', d => `graph-edge ${d.type}`)
      .attr('stroke-width', d => d.type === 'post-post' ? 2 : 1.5);

    // Create nodes (simplified - circles for both, different colors)
    nodeElements = container
      .selectAll('.graph-node')
      .data(nodes)
      .join('circle')
      .attr('class', d => `graph-node ${d.type}`)
      .attr('r', d => d.type === 'post' ? config.nodes.post.radius : config.nodes.tag.radius)
      .attr('role', d => d.type === 'post' ? 'button' : null)
      .attr('aria-label', d =>
        d.type === 'post'
          ? `Navigate to blog post: ${d.title}`
          : `Tag: ${d.name}, ${d.count} connected posts`
      )
      .attr('tabindex', d => d.type === 'post' ? '0' : null)
      .call(d3.drag()
        .on('start', handleDragStart)
        .on('drag', handleDrag)
        .on('end', handleDragEnd));

    // Create labels
    labelElements = container
      .selectAll('.graph-label')
      .data(nodes)
      .join('text')
      .attr('class', d => `graph-label ${d.type}`)
      .attr('data-id', d => d.id)
      .text(d => d.type === 'tag' ? (d.name || d.id) : (d.title || d.id))
      .attr('dy', d => d.type === 'tag' ? 4 : 0);

    // Setup animation loop with performance monitoring
    let animationId;
    simulation.on('tick', () => {
      if (!animationId) {
        animationId = requestAnimationFrame(() => {
          updatePositions();
          animationId = null;
        });
      }
    });
  }

  // Update element positions (optimized for performance)
  function updatePositions() {
    linkElements
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodeElements
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    labelElements
      .attr('x', d => d.x)
      .attr('y', d => d.y + (d.type === 'post' ? -15 : 20)); // Posts above, tags below
  }

  // Setup hover and interaction handlers
  function setupInteractions() {
    nodeElements
      .on('mouseenter', handleNodeHover)
      .on('mouseleave', handleNodeUnhover)
      .on('click', handleNodeClick);

    // Reset button
    d3.select('#reset-graph')
      .on('click', resetGraph);

    // Background click to clear selections
    svg.on('click', (event) => {
      if (event.target === svg.node()) {
        resetGraph();
      }
    });

    // Escape key to reset filtering (T039)
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && filteredTag) {
        resetGraph();
      }
    });

    // Keyboard navigation with roving tabindex (T051)
    setupKeyboardNavigation();
  }

  // Handle node hover effects
  function handleNodeHover(event, d) {
    hoveredNode = d;

    // Highlight the node
    d3.select(event.currentTarget)
      .classed('brand-node-glow', true);

    // Show post title labels on hover
    if (d.type === 'post') {
      labelElements
        .filter(node => node.id === d.id && node.type === 'post')
        .classed('visible', true);
    }

    // Highlight connected edges
    linkElements
      .classed('active', link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return (sourceId === d.id || targetId === d.id);
      });

    // Dim non-connected elements
    nodeElements
      .style('opacity', node => {
        if (node.id === d.id) return 1;
        const isConnected = links.some(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return (sourceId === d.id && targetId === node.id) ||
                 (targetId === d.id && sourceId === node.id);
        });
        return isConnected ? 1 : 0.3;
      });
  }

  // Handle node unhover
  function handleNodeUnhover(event, d) {
    hoveredNode = null;

    // Remove hover effects
    d3.select(event.currentTarget)
      .classed('brand-node-glow', false);

    // Hide post title labels
    if (d.type === 'post') {
      labelElements
        .filter(node => node.id === d.id && node.type === 'post')
        .classed('visible', false);
    }

    // Reset all elements
    linkElements.classed('active', false);
    nodeElements.style('opacity', 1);
  }

  // Handle node click for navigation and filtering (T029, T030, T032, T033, T034)
  function handleNodeClick(event, d) {
    // Prevent event bubbling to background
    event.stopPropagation();

    if (d.type === 'post') {
      // Navigate to post URL
      if (d.url) {
        window.location.href = d.url;
      }
    } else if (d.type === 'tag') {
      // Filter graph by tag
      filterByTag(d.id);

      // Also update sidebar filters (for explore page integration)
      updateSidebarFilter(d.id);
    }
  }

  // Filter graph by tag (T034, T035, T042)
  function filterByTag(tagId) {
    if (filteredTag === tagId) {
      // If clicking the same tag, reset instead
      resetGraph();
      return;
    }

    filteredTag = tagId;

    // Find the tag node to get connected posts
    const tagNode = nodes.find(n => n.id === tagId && n.type === 'tag');
    if (!tagNode) return;

    // Handle empty state
    if (!tagNode.connectedPosts || tagNode.connectedPosts.length === 0) {
      showFilteredState(tagId, 0);
      // Hide all nodes and links
      nodeElements.style('opacity', 0.1);
      linkElements.style('opacity', 0.1);
      // Keep the clicked tag visible
      nodeElements.filter(n => n.id === tagId).style('opacity', 1);
      announceFilterState(`Tag "${tagId}" has no connected posts`);
      return;
    }

    const connectedPostIds = new Set(tagNode.connectedPosts);

    // Show only the filtered tag, connected posts, and their connections
    nodeElements
      .style('opacity', d => {
        if (d.id === tagId) return 1; // The filtered tag
        if (d.type === 'post' && connectedPostIds.has(d.id)) return 1; // Connected posts
        return 0.1; // Everything else
      });

    // Show only links involving the filtered tag or connected posts
    linkElements
      .style('opacity', link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;

        // Show tag-post connections and post-post connections within filtered set
        if (sourceId === tagId || targetId === tagId) return 0.6;
        if (connectedPostIds.has(sourceId) && connectedPostIds.has(targetId)) return 0.4;
        return 0.05;
      });

    // Update visual indicators and announce state
    showFilteredState(tagId, connectedPostIds.size);
    announceFilterState(`Showing ${connectedPostIds.size} posts for tag "${tagId}"`);
  }

  // Show filtered state visual indicators (T040)
  function showFilteredState(tagName, postCount) {
    // Add filtered class to container
    d3.select('#network-graph-container').classed('filtered', true);

    // Update reset button to show it's needed
    d3.select('#reset-graph')
      .classed('active', true)
      .text(`Reset (showing ${postCount} posts for "${tagName}")`);
  }

  // Announce filter state changes for screen readers (T041)
  function announceFilterState(message) {
    const liveRegion = document.querySelector('[aria-live="polite"]');
    if (liveRegion) {
      // Clear and set new message for reliable announcement
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 100);
    }
  }

  // Drag interaction handlers (T043, T044, T045, T046, T048, T049)
  function handleDragStart(event, d) {
    // Prevent click event from firing when dragging
    event.sourceEvent.stopPropagation();

    // Add visual feedback for dragging
    d3.select(event.sourceEvent.target)
      .classed('dragging', true);

    // Restart simulation with higher alpha for responsive physics
    if (simulation) {
      simulation.alphaTarget(0.3).restart();
    }

    // Fix the dragged node position
    d.fx = d.x;
    d.fy = d.y;
  }

  function handleDrag(event, d) {
    // Update fixed position to follow mouse/touch
    d.fx = event.x;
    d.fy = event.y;
  }

  function handleDragEnd(event, d) {
    // Remove visual feedback
    d3.select(event.sourceEvent.target)
      .classed('dragging', false);

    // Let simulation settle back to normal
    if (simulation) {
      simulation.alphaTarget(0);
    }

    // Release fixed position to allow natural physics
    d.fx = null;
    d.fy = null;
  }

  // Keyboard navigation with roving tabindex (T051)
  function setupKeyboardNavigation() {
    let currentFocusIndex = 0;
    const focusableNodes = nodes.filter(n => n.type === 'post' || n.type === 'tag');

    // Update tabindex for all nodes
    function updateTabindex() {
      nodeElements.attr('tabindex', (d, i) => {
        const nodeIndex = focusableNodes.findIndex(n => n.id === d.id);
        return nodeIndex === currentFocusIndex ? '0' : '-1';
      });
    }

    // Initial setup
    updateTabindex();

    // Handle keyboard navigation
    document.addEventListener('keydown', (event) => {
      if (!event.target.classList.contains('graph-node')) return;

      let moved = false;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          currentFocusIndex = (currentFocusIndex + 1) % focusableNodes.length;
          moved = true;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          currentFocusIndex = (currentFocusIndex - 1 + focusableNodes.length) % focusableNodes.length;
          moved = true;
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          const focusedNode = focusableNodes[currentFocusIndex];
          if (focusedNode) {
            handleNodeClick({ stopPropagation: () => {} }, focusedNode);
          }
          break;
      }

      if (moved) {
        event.preventDefault();
        updateTabindex();
        // Focus the new current node
        const targetNode = focusableNodes[currentFocusIndex];
        const nodeElement = nodeElements.filter(d => d.id === targetNode.id);
        nodeElement.node()?.focus();
      }
    });
  }

  // Reset graph to default state
  function resetGraph() {
    hoveredNode = null;
    filteredTag = null;

    // Reset node positions and clear drag state (T050)
    nodes.forEach(node => {
      node.fx = null;
      node.fy = null;
    });

    // Clear all hover and drag effects
    nodeElements
      .classed('brand-node-glow', false)
      .classed('dragging', false)
      .style('opacity', 1);

    linkElements
      .classed('active', false)
      .style('opacity', d => d.type === 'post-post' ? 0.4 : 0.3);

    labelElements
      .filter('.post')
      .classed('visible', false);

    // Clear filtered state visual indicators
    d3.select('#network-graph-container').classed('filtered', false);
    d3.select('#reset-graph')
      .classed('active', false)
      .text('Reset View');

    // Announce reset
    announceFilterState('Showing all posts and tags');

    // Reset sidebar filter to "all" (for explore page integration)
    if (window.exploreFilters && typeof window.exploreFilters.updateFromNetwork === 'function') {
      const allButton = document.querySelector('.tag-filter[data-tag="all"]');
      if (allButton && !allButton.classList.contains('active')) {
        window.exploreFilters.updateFromNetwork('all');
      }
    }

    // Restart simulation briefly to settle layout
    if (simulation) {
      simulation.alpha(0.1).restart();
    }
  }

  // Utility functions
  function showStatus(message) {
    const statusEl = document.querySelector('.loading-message');
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.style.display = message ? 'inline' : 'none';
    }
  }

  function showError(message) {
    const errorEl = document.querySelector('.error-message');
    const loadingEl = document.querySelector('.loading-message');

    if (errorEl && loadingEl) {
      loadingEl.style.display = 'none';
      errorEl.textContent = message;
      errorEl.style.display = 'inline';
    }
  }

  // Handle window resize
  function handleResize() {
    if (!svg) return;

    const rect = svg.node().getBoundingClientRect();
    width = rect.width || 800;
    height = rect.height || 500;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    if (simulation) {
      simulation
        .force('center', d3.forceCenter(width / 2, height / 2))
        .alpha(0.1)
        .restart();
    }
  }

  // Cleanup function
  function cleanup() {
    if (simulation) {
      simulation.stop();
      simulation = null;
    }

    window.removeEventListener('resize', handleResize);
    window.removeEventListener('beforeunload', cleanup);
  }

  // External API for integration with explore page filters
  function highlightNode(nodeId, active) {
    const node = nodes.find(n => n.id === nodeId);
    if (node && nodeElements) {
      const nodeElement = nodeElements.filter(d => d.id === nodeId).node();
      if (nodeElement) {
        // Simulate hover effect for external highlighting
        if (active) {
          handleNodeHover({ currentTarget: nodeElement }, node);
        } else {
          handleNodeUnhover({ currentTarget: nodeElement }, node);
        }
      }
    }
  }

  // Update sidebar filter (for explore page integration)
  function updateSidebarFilter(tagId) {
    // Use explore filters API to prevent circular triggering
    if (window.exploreFilters && typeof window.exploreFilters.updateFromNetwork === 'function') {
      window.exploreFilters.updateFromNetwork(tagId);
    }
  }

  // Expose API for external access
  window.networkGraph = {
    filterByTag: filterByTag,
    resetGraph: resetGraph,
    highlightNode: highlightNode
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Event listeners
  window.addEventListener('resize', handleResize);
  window.addEventListener('beforeunload', cleanup);

})();