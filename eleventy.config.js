module.exports = function(eleventyConfig) {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Watch CSS and JS for changes
  eleventyConfig.addWatchTarget("src/assets/");

  // Posts collection (T013)
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return b.date - a.date; // Sort by date descending (newest first)
    });
  });

  // Tags collection (T014)
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tagSet = new Set();
    const excludedTags = ["posts", "all", "tagList", "graphData"];
    collectionApi.getAll().forEach(item => {
      if (item.data.tags) {
        item.data.tags.forEach(tag => {
          if (!excludedTags.includes(tag)) {
            tagSet.add(tag);
          }
        });
      }
    });
    return [...tagSet].sort();
  });

  // Graph data for explore page (T036-T037)
  eleventyConfig.addCollection("graphData", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/posts/*.md");

    // Build nodes
    const nodes = posts.map(post => ({
      id: post.fileSlug,
      title: post.data.title,
      url: post.url,
      tags: (post.data.tags || []).filter(t => t !== "posts"),
      date: post.date.toISOString().split("T")[0]
    }));

    // Build links between posts sharing tags
    const links = [];
    for (let i = 0; i < posts.length; i++) {
      for (let j = i + 1; j < posts.length; j++) {
        const tags1 = (posts[i].data.tags || []).filter(t => t !== "posts");
        const tags2 = (posts[j].data.tags || []).filter(t => t !== "posts");
        const sharedTags = tags1.filter(t => tags2.includes(t));

        if (sharedTags.length > 0) {
          links.push({
            source: posts[i].fileSlug,
            target: posts[j].fileSlug,
            sharedTags: sharedTags,
            weight: sharedTags.length
          });
        }
      }
    }

    return { nodes, links };
  });

  // Network Graph data for new network visualization
  eleventyConfig.addCollection("networkGraphData", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/posts/*.md");

    // Build post nodes
    const postNodes = posts.map(post => ({
      id: post.fileSlug,
      type: 'post',
      title: post.data.title,
      url: post.url,
      date: post.date.toISOString().split('T')[0],
      tags: (post.data.tags || []).filter(t => t !== 'posts')
    }));

    // Collect all unique tags
    const allTags = new Set();
    posts.forEach(post => {
      const tags = (post.data.tags || []).filter(t => t !== 'posts');
      tags.forEach(tag => allTags.add(tag));
    });

    // Build tag nodes
    const tagNodes = Array.from(allTags).map(tag => {
      const connectedPosts = posts
        .filter(post => (post.data.tags || []).includes(tag))
        .map(post => post.fileSlug);

      return {
        id: tag,
        type: 'tag',
        name: tag,
        count: connectedPosts.length,
        connectedPosts: connectedPosts
      };
    });

    // Build post-to-tag edges
    const postTagEdges = [];
    posts.forEach(post => {
      const tags = (post.data.tags || []).filter(t => t !== 'posts');
      tags.forEach(tag => {
        postTagEdges.push({
          source: post.fileSlug,
          target: tag,
          type: 'post-tag',
          strength: 1.0
        });
      });
    });

    // Build post-to-post edges (from frontmatter references)
    const postPostEdges = [];
    posts.forEach(post => {
      if (post.data.references && Array.isArray(post.data.references)) {
        post.data.references.forEach(ref => {
          postPostEdges.push({
            source: post.fileSlug,
            target: ref,
            type: 'post-post',
            strength: 1.5
          });
        });
      }
    });

    const allNodes = [...postNodes, ...tagNodes];
    const allLinks = [...postTagEdges, ...postPostEdges];

    return {
      nodes: allNodes,
      links: allLinks,
      metadata: {
        generatedAt: new Date().toISOString(),
        nodeCount: allNodes.length,
        linkCount: allLinks.length,
        postCount: postNodes.length,
        tagCount: tagNodes.length
      }
    };
  });

  // Date filter for templates
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  // ISO date filter
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
