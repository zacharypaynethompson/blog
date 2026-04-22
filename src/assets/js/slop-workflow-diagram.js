(function () {
  var el = document.getElementById('slop-workflow-diagram');
  if (!el) return;

  el.innerHTML = '<div class="wf-stages">' +
    '<div class="wf-stage wf-stage--accent">' +
      '<span class="wf-label">research</span>' +
      '<span class="wf-sub">define intent</span>' +
    '</div>' +
    '<div class="wf-arrow">\u2192</div>' +
    '<div class="wf-stage wf-stage--accent wf-stage--plan">' +
      '<div class="wf-loop">' +
        '<svg viewBox="0 0 100 32" preserveAspectRatio="xMidYMid meet">' +
          '<defs><marker id="wf-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
            '<path d="M0 0L10 5L0 10z" fill="#D2691E"/>' +
          '</marker></defs>' +
          '<path d="M75 30 C75 4, 25 4, 25 30" fill="none" stroke="#D2691E" stroke-width="1.5" marker-end="url(#wf-arr)"/>' +
        '</svg>' +
        '<span class="wf-loop-label">2\u20133 rounds</span>' +
      '</div>' +
      '<span class="wf-label">plan</span>' +
      '<span class="wf-sub">review &amp; refine</span>' +
    '</div>' +
    '<div class="wf-arrow">\u2192</div>' +
    '<div class="wf-stage wf-stage--muted">' +
      '<span class="wf-label">implement</span>' +
      '<span class="wf-sub">agent executes</span>' +
    '</div>' +
  '</div>' +
  '<div class="wf-bar">' +
    '<div class="wf-bar-segment wf-bar-segment--accent"></div>' +
    '<div class="wf-bar-segment wf-bar-segment--muted"></div>' +
  '</div>' +
  '<div class="wf-bar-labels">' +
    '<span class="wf-bar-label wf-bar-label--accent">engineer thinking</span>' +
    '<span class="wf-bar-label wf-bar-label--muted">mechanical translation</span>' +
  '</div>';
})();
