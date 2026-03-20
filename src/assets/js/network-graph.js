/**
 * Interactive Obsidian-Style Network Graph
 * Creates a force-directed network visualization of blog posts and tags
 */

(function() {
  'use strict';

  const config = {
    forces: {
      link: { distance: 80, strength: 0.7 },
      charge: { strength: -120, theta: 0.8 },
      center: { strength: 1.5 },
      collision: { radius: 20, strength: 0.7 }
    },
    nodes: {
      post: { radius: 10, color: '#D2691E' },
      tag: { radius: 7, color: '#8b949e' }
    },
    animation: {
      velocityDecay: 0.4,
      alphaMin: 0.01
    }
  };

  // State management
  let simulation;
  let svg, container, zoomBehavior, width, height;
  let nodes = [], links = [];
  let nodeElements, linkElements, labelElements;
  let hoveredNode = null;
  let selectedNode = null;
  let filteredTag = null;

  // Pre-computed lookup structures
  let nodeMap = new Map();
  let adjacencyMap = new Map();

  function init() {
    loadGraphData().then(data => {
      if (!data || !data.nodes || !data.links) return;

      setupSVG();
      processData(data);
      createVisualization();
      setupInteractions();
      showStatus('');
    }).catch(error => {
      console.error('Failed to initialize network graph:', error);
      showError('Failed to load graph data');
    });
  }

  async function loadGraphData() {
    const prefix = document.body.dataset.pathPrefix || '/';
    const response = await fetch(prefix + 'data/network-graph.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  function setupSVG() {
    const svgElement = d3.select('#network-graph-svg');
    const parentRect = svgElement.node().parentElement.getBoundingClientRect();

    width = parentRect.width || 800;
    height = parentRect.height || 500;

    svg = svgElement
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll('*').remove();
    container = svg.append('g').attr('class', 'graph-container');

    // Zoom and pan
    zoomBehavior = d3.zoom()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        // If user manually zoomed (not programmatic), stop auto-fitting
        if (event.sourceEvent) {
          userHasZoomed = true;
        }
      });

    svg.call(zoomBehavior);

  }

  function processData(data) {
    nodes = data.nodes.map(d => ({
      ...d,
      degree: 0,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100
    }));

    links = data.links.map(d => ({
      ...d,
      source: d.source,
      target: d.target
    }));

    // Build node lookup map
    nodeMap.clear();
    nodes.forEach(n => nodeMap.set(n.id, n));

    // Calculate degrees and build adjacency map
    adjacencyMap.clear();
    nodes.forEach(n => adjacencyMap.set(n.id, new Set()));

    links.forEach(link => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      if (sourceNode) sourceNode.degree++;
      if (targetNode) targetNode.degree++;
      if (adjacencyMap.has(link.source)) adjacencyMap.get(link.source).add(link.target);
      if (adjacencyMap.has(link.target)) adjacencyMap.get(link.target).add(link.source);
    });
  }

  function createVisualization() {
    simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(config.forces.link.distance)
        .strength(link => {
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

    // Links first for proper layering
    linkElements = container
      .selectAll('.graph-edge')
      .data(links)
      .join('line')
      .attr('class', d => `graph-edge ${d.type}`)
      .attr('stroke-width', d => d.type === 'post-post' ? 1.5 : 1);

    // Nodes
    nodeElements = container
      .selectAll('.graph-node')
      .data(nodes)
      .join('circle')
      .attr('class', d => `graph-node ${d.type}`)
      .attr('r', d => d.type === 'post' ? config.nodes.post.radius : config.nodes.tag.radius)
      .attr('aria-label', d =>
        d.type === 'post'
          ? `Blog post: ${d.title}`
          : `Tag: ${d.name}, ${d.count} connected posts`
      )
      .call(d3.drag()
        .on('start', handleDragStart)
        .on('drag', handleDrag)
        .on('end', handleDragEnd));

    // Labels
    labelElements = container
      .selectAll('.graph-label')
      .data(nodes)
      .join('text')
      .attr('class', d => `graph-label ${d.type}`)
      .attr('data-id', d => d.id)
      .text(d => d.type === 'tag' ? (d.name || d.id) : (d.title || d.id))
      .attr('dy', d => d.type === 'tag' ? 4 : 0);

    // Direct tick updates - no rAF throttle for responsive dragging
    simulation.on('tick', updatePositions);
  }

  // Auto-fit: track whether user has manually zoomed/selected
  let userHasZoomed = false;

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
      .attr('y', d => d.y + (d.type === 'post' ? -15 : 20));

    // Auto-fit viewport to contain all nodes (only while simulation is settling, not during user interaction)
    if (!userHasZoomed && !selectedNode && simulation && simulation.alpha() > config.animation.alphaMin) {
      fitToNodes();
    }
  }

  function fitToNodes() {
    if (nodes.length === 0) return;

    const padding = 40;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    nodes.forEach(n => {
      if (n.x < minX) minX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.x > maxX) maxX = n.x;
      if (n.y > maxY) maxY = n.y;
    });

    const graphWidth = maxX - minX + padding * 2;
    const graphHeight = maxY - minY + padding * 2;

    if (graphWidth <= 0 || graphHeight <= 0) return;

    const scale = Math.min(
      width / graphWidth,
      height / graphHeight,
      1.5 // Don't zoom in too much
    );

    // Only adjust if nodes are actually outside the viewport
    if (scale >= 1) return;

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const transform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(scale)
      .translate(-centerX, -centerY);

    // Apply directly (no transition during simulation to avoid fighting)
    svg.call(zoomBehavior.transform, transform);
  }

  function setupInteractions() {
    nodeElements
      .on('mouseenter', handleNodeHover)
      .on('mouseleave', handleNodeUnhover)
      .on('click', handleNodeClick);

    d3.select('#reset-graph').on('click', resetGraph);

    // Background click to deselect
    svg.on('click', (event) => {
      if (event.target === svg.node()) {
        resetGraph();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        resetGraph();
      }
    });

    setupKeyboardNavigation();
  }

  function handleNodeHover(event, d) {
    hoveredNode = d;

    d3.select(event.currentTarget).classed('brand-node-glow', true);

    // Show label on hover for posts
    if (d.type === 'post') {
      labelElements
        .filter(node => node.id === d.id && node.type === 'post')
        .classed('visible', true);
    }

    const neighbors = adjacencyMap.get(d.id) || new Set();

    // Highlight connected edges
    linkElements.classed('active', link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return (sourceId === d.id || targetId === d.id);
    });

    // Dim non-connected nodes
    nodeElements.style('opacity', node => {
      if (node.id === d.id) return 1;
      return neighbors.has(node.id) ? 1 : 0.3;
    });
  }

  function handleNodeUnhover(event, d) {
    hoveredNode = null;

    d3.select(event.currentTarget).classed('brand-node-glow', false);

    if (d.type === 'post') {
      labelElements
        .filter(node => node.id === d.id && node.type === 'post')
        .classed('visible', false);
    }

    linkElements.classed('active', false);

    // Restore opacity (respect filter state)
    if (filteredTag) {
      applyFilterOpacity();
    } else {
      nodeElements.style('opacity', 1);
    }
  }

  function handleNodeClick(event, d) {
    event.stopPropagation();

    if (d.type === 'post') {
      selectPost(d);
    } else if (d.type === 'tag') {
      filterByTag(d.id);
      updateSidebarFilter(d.id);
    }
  }

  // Select a post node: highlight, zoom, notify sidebar
  function selectPost(d) {
    if (selectedNode && selectedNode.id === d.id) {
      deselectPost();
      return;
    }

    selectedNode = d;

    // Highlight selected node
    nodeElements.classed('selected', node => node.id === d.id);

    // Show label
    labelElements
      .filter(node => node.id === d.id && node.type === 'post')
      .classed('visible', true);

    // Smooth zoom to center on the selected node
    const scale = 1.5;
    const transform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(scale)
      .translate(-d.x, -d.y);

    svg.transition()
      .duration(500)
      .call(zoomBehavior.transform, transform);

    // Highlight connected nodes
    const neighbors = adjacencyMap.get(d.id) || new Set();
    nodeElements.style('opacity', node => {
      if (node.id === d.id) return 1;
      return neighbors.has(node.id) ? 0.8 : 0.2;
    });

    linkElements.style('opacity', link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return (sourceId === d.id || targetId === d.id) ? 0.6 : 0.05;
    });

    // Notify sidebar to highlight and scroll to this post
    notifySidebar(d.id);
  }

  function deselectPost() {
    const hadSelection = selectedNode !== null;
    selectedNode = null;
    nodeElements.classed('selected', false);
    labelElements.filter('.post').classed('visible', false);
    nodeElements.style('opacity', 1);
    linkElements.style('opacity', d => d.type === 'post-post' ? 0.3 : 0.15);

    if (hadSelection) {
      svg.transition()
        .duration(400)
        .call(zoomBehavior.transform, d3.zoomIdentity);
      notifySidebar(null);
    }
  }

  function notifySidebar(postId) {
    const event = new CustomEvent('graph:postSelected', { detail: { postId } });
    document.dispatchEvent(event);
  }

  function filterByTag(tagId) {
    if (filteredTag === tagId) {
      resetGraph();
      return;
    }

    deselectPost();
    filteredTag = tagId;

    const tagNode = nodes.find(n => n.id === tagId && n.type === 'tag');
    if (!tagNode) return;

    if (!tagNode.connectedPosts || tagNode.connectedPosts.length === 0) {
      nodeElements.style('opacity', 0.1);
      linkElements.style('opacity', 0.05);
      nodeElements.filter(n => n.id === tagId).style('opacity', 1);
      showFilteredState(tagId, 0);
      return;
    }

    const connectedPostIds = new Set(tagNode.connectedPosts);
    applyFilterOpacity();

    showFilteredState(tagId, connectedPostIds.size);
  }

  function applyFilterOpacity() {
    if (!filteredTag) return;

    const tagNode = nodes.find(n => n.id === filteredTag && n.type === 'tag');
    if (!tagNode) return;
    const connectedPostIds = new Set(tagNode.connectedPosts || []);

    nodeElements.style('opacity', d => {
      if (d.id === filteredTag) return 1;
      if (d.type === 'post' && connectedPostIds.has(d.id)) return 1;
      return 0.1;
    });

    linkElements.style('opacity', link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      if (sourceId === filteredTag || targetId === filteredTag) return 0.4;
      if (connectedPostIds.has(sourceId) && connectedPostIds.has(targetId)) return 0.3;
      return 0.05;
    });
  }

  function filterByPosts(postIds) {
    if (!postIds || postIds.length === 0) {
      resetGraph();
      return;
    }

    deselectPost();
    filteredTag = null;
    const postIdSet = new Set(postIds);

    const connectedTags = new Set();
    nodes.forEach(node => {
      if (node.type === 'tag' && node.connectedPosts) {
        if (node.connectedPosts.some(postId => postIdSet.has(postId))) {
          connectedTags.add(node.id);
        }
      }
    });

    nodeElements.style('opacity', d => {
      if (d.type === 'post' && postIdSet.has(d.id)) return 1;
      if (d.type === 'tag' && connectedTags.has(d.id)) return 0.8;
      return 0.1;
    });

    linkElements.style('opacity', link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      if (postIdSet.has(sourceId) && postIdSet.has(targetId)) return 0.6;
      if (postIdSet.has(sourceId) || postIdSet.has(targetId)) return 0.4;
      return 0.05;
    });

    d3.select('#network-graph-container').classed('filtered', true);
  }

  function showFilteredState(tagName, postCount) {
    d3.select('#network-graph-container').classed('filtered', true);
    d3.select('#reset-graph')
      .classed('active', true)
      .text(`Reset (${postCount} posts for "${tagName}")`);
  }

  function handleDragStart(event, d) {
    event.sourceEvent.stopPropagation();
    if (simulation) {
      simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  function handleDrag(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function handleDragEnd(event, d) {
    if (simulation) {
      simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }

  function setupKeyboardNavigation() {
    let currentFocusIndex = 0;
    const focusableNodes = nodes.filter(n => n.type === 'post' || n.type === 'tag');

    function updateTabindex() {
      nodeElements.attr('tabindex', (d) => {
        const nodeIndex = focusableNodes.findIndex(n => n.id === d.id);
        return nodeIndex === currentFocusIndex ? '0' : '-1';
      });
    }

    updateTabindex();

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
        const targetNode = focusableNodes[currentFocusIndex];
        const nodeElement = nodeElements.filter(d => d.id === targetNode.id);
        nodeElement.node()?.focus();
      }
    });
  }

  function resetGraph() {
    hoveredNode = null;
    filteredTag = null;
    userHasZoomed = false;
    deselectPost();

    nodes.forEach(node => {
      node.fx = null;
      node.fy = null;
    });

    nodeElements
      .classed('brand-node-glow', false)
      .classed('selected', false)
      .style('opacity', 1);

    linkElements
      .classed('active', false)
      .style('opacity', d => d.type === 'post-post' ? 0.3 : 0.15);

    labelElements.filter('.post').classed('visible', false);

    d3.select('#network-graph-container').classed('filtered', false);
    d3.select('#reset-graph')
      .classed('active', false)
      .text('Reset View');

    // Reset zoom
    svg.transition()
      .duration(400)
      .call(zoomBehavior.transform, d3.zoomIdentity);

    if (window.exploreFilters && typeof window.exploreFilters.updateFromNetwork === 'function') {
      const allButton = document.querySelector('.tag-filter[data-tag="all"]');
      if (allButton && !allButton.classList.contains('active')) {
        window.exploreFilters.updateFromNetwork('all');
      }
    }

    if (simulation) {
      simulation.alpha(0.1).restart();
    }
  }

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

  function handleResize() {
    if (!svg) return;

    const parentRect = svg.node().parentElement.getBoundingClientRect();
    width = parentRect.width || 800;
    height = parentRect.height || 500;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    if (simulation) {
      simulation
        .force('center', d3.forceCenter(width / 2, height / 2))
        .alpha(0.1)
        .restart();
    }
  }

  function cleanup() {
    if (simulation) {
      simulation.stop();
      simulation = null;
    }
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('beforeunload', cleanup);
  }

  function highlightNode(nodeId, active) {
    const node = nodeMap.get(nodeId);
    if (node && nodeElements) {
      const nodeElement = nodeElements.filter(d => d.id === nodeId).node();
      if (nodeElement) {
        if (active) {
          handleNodeHover({ currentTarget: nodeElement }, node);
        } else {
          handleNodeUnhover({ currentTarget: nodeElement }, node);
        }
      }
    }
  }

  function updateSidebarFilter(tagId) {
    if (window.exploreFilters && typeof window.exploreFilters.updateFromNetwork === 'function') {
      window.exploreFilters.updateFromNetwork(tagId);
    }
  }

  // Expose API
  window.networkGraph = {
    filterByTag: filterByTag,
    filterByPosts: filterByPosts,
    resetGraph: resetGraph,
    highlightNode: highlightNode,
    selectPost: function(postId) {
      const node = nodeMap.get(postId);
      if (node && node.type === 'post') selectPost(node);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('beforeunload', cleanup);

})();
