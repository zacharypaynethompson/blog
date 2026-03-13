/**
 * Explore page network visualization
 * Uses d3.js force-directed graph to show post relationships
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    nodeRadius: 8,
    linkDistance: 80,
    chargeStrength: -100,
    colors: {
      node: '#B7410E',
      nodeHover: '#8A3009',
      link: '#E8E4DF',
      linkActive: '#B7410E',
      text: '#2D2D2D'
    }
  };

  // State
  let simulation;
  let nodes = [];
  let links = [];
  let activeTag = 'all';

  // Check for reduced motion preference (T048)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize the visualization
  async function init() {
    try {
      const response = await fetch('/data/graph.json');
      const data = await response.json();

      nodes = data.nodes;
      links = data.links;

      createGraph();
      setupFilters();
    } catch (error) {
      console.error('Failed to load graph data:', error);
    }
  }

  // Create the force-directed graph (T039-T041)
  function createGraph() {
    const container = document.getElementById('graph');
    const svg = d3.select('#graph svg');
    const width = container.clientWidth;
    const height = Math.min(400, window.innerHeight * 0.5);

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Create link elements (T041)
    const linkGroup = svg.append('g').attr('class', 'links');
    const link = linkGroup.selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', config.colors.link)
      .attr('stroke-width', d => Math.sqrt(d.weight))
      .attr('stroke-opacity', 0.6);

    // Create node group (T040)
    const nodeGroup = svg.append('g').attr('class', 'nodes');
    const node = nodeGroup.selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('tabindex', '0')
      .attr('role', 'button')
      .attr('aria-label', d => `Post: ${d.title}`);

    // Add circles to nodes
    node.append('circle')
      .attr('r', config.nodeRadius)
      .attr('fill', config.colors.node)
      .style('cursor', 'pointer');

    // Add labels to nodes
    node.append('text')
      .text(d => d.title)
      .attr('x', config.nodeRadius + 4)
      .attr('y', 4)
      .attr('font-size', '12px')
      .attr('fill', config.colors.text)
      .style('pointer-events', 'none');

    // Create force simulation (T039)
    simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(config.linkDistance))
      .force('charge', d3.forceManyBody().strength(config.chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(config.nodeRadius * 2));

    // Set velocity decay for restrained animation
    if (prefersReducedMotion) {
      simulation.velocityDecay(0.9);
      simulation.alpha(0.1);
    } else {
      simulation.velocityDecay(0.6);
    }

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Add interactivity (T042, T043, T047)
    setupNodeInteractions(node, link);

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
      const newWidth = container.clientWidth;
      svg.attr('width', newWidth).attr('viewBox', `0 0 ${newWidth} ${height}`);
      simulation.force('center', d3.forceCenter(newWidth / 2, height / 2));
      simulation.alpha(0.3).restart();
    }, 250));
  }

  // Setup node interactions (T042, T043, T047)
  function setupNodeInteractions(node, link) {
    // Hover highlighting (T042)
    node.on('pointerenter', function(event, d) {
      highlightConnections(d, true);
      highlightListItem(d.id, true);
    });

    node.on('pointerleave', function(event, d) {
      highlightConnections(d, false);
      highlightListItem(d.id, false);
    });

    // Click to navigate (T043)
    node.on('click', function(event, d) {
      window.location.href = d.url;
    });

    // Keyboard navigation (T047)
    node.on('keydown', function(event, d) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = d.url;
      }
    });
  }

  // Highlight connected nodes and links (T042)
  function highlightConnections(node, active) {
    const connectedIds = new Set([node.id]);

    links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;

      if (sourceId === node.id) connectedIds.add(targetId);
      if (targetId === node.id) connectedIds.add(sourceId);
    });

    // Update node opacity
    d3.selectAll('.node').style('opacity', d => {
      if (!active) return 1;
      return connectedIds.has(d.id) ? 1 : 0.3;
    });

    // Update link styling
    d3.selectAll('.links line').each(function(d) {
      const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
      const targetId = typeof d.target === 'object' ? d.target.id : d.target;
      const isConnected = sourceId === node.id || targetId === node.id;

      d3.select(this)
        .attr('stroke', active && isConnected ? config.colors.linkActive : config.colors.link)
        .attr('stroke-opacity', active ? (isConnected ? 1 : 0.2) : 0.6);
    });
  }

  // Highlight corresponding list item
  function highlightListItem(id, active) {
    const item = document.querySelector(`#post-list li[data-id="${id}"]`);
    if (item) {
      item.classList.toggle('highlighted', active);
    }
  }

  // Setup tag filters (T044, T045)
  function setupFilters() {
    const filterButtons = document.querySelectorAll('.tag-filter');
    const listItems = document.querySelectorAll('#post-list li');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tag = button.dataset.tag;
        activeTag = tag;

        // Update button states
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter list view
        listItems.forEach(item => {
          const tags = item.dataset.tags.split(',');
          const show = tag === 'all' || tags.includes(tag);
          item.style.display = show ? '' : 'none';
        });

        // Filter graph nodes
        filterGraph(tag);
      });
    });

    // Cross-filter: clicking list items highlights graph nodes
    listItems.forEach(item => {
      item.addEventListener('pointerenter', () => {
        const id = item.dataset.id;
        const node = nodes.find(n => n.id === id);
        if (node) highlightConnections(node, true);
      });

      item.addEventListener('pointerleave', () => {
        const id = item.dataset.id;
        const node = nodes.find(n => n.id === id);
        if (node) highlightConnections(node, false);
      });
    });
  }

  // Filter graph by tag (T045)
  function filterGraph(tag) {
    const visibleIds = new Set();

    if (tag === 'all') {
      nodes.forEach(n => visibleIds.add(n.id));
    } else {
      nodes.forEach(n => {
        if (n.tags.includes(tag)) visibleIds.add(n.id);
      });
    }

    // Update node visibility
    d3.selectAll('.node').style('opacity', d => visibleIds.has(d.id) ? 1 : 0.2);

    // Update link visibility
    d3.selectAll('.links line').style('opacity', d => {
      const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
      const targetId = typeof d.target === 'object' ? d.target.id : d.target;
      return visibleIds.has(sourceId) && visibleIds.has(targetId) ? 0.6 : 0.1;
    });
  }

  // Utility: debounce function
  function debounce(fn, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
