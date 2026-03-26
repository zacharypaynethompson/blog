/**
 * title-animation.js — constellation network animation for the nav title
 *
 * Usage:
 *   <a class="nav-logo" data-animation data-accent-start="4">zacsblog</a>
 *
 * Options:
 *   data-accent-start="4" — character index where accent color begins
 *
 * Respects prefers-reduced-motion: shows title instantly without animation.
 */

(function () {
  function splitLetters(el, accentStart) {
    var text = el.textContent.trim();
    el.textContent = '';
    el.setAttribute('aria-label', text);

    var letters = [];
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'title-letter ' + (i >= accentStart ? 'title-char-accent' : 'title-char-normal');
      span.textContent = text[i];
      el.appendChild(span);
      letters.push({ el: span, char: text[i], index: i });
    }
    return letters;
  }

  function animate(el) {
    var accentStart = parseInt(el.getAttribute('data-accent-start'), 10) || 4;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var letters = splitLetters(el, accentStart);

    if (reducedMotion) return;

    var accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent').trim() || '#D2691E';

    // Create SVG overlay for connecting lines
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:visible;';
    el.style.position = 'relative';
    el.appendChild(svg);

    // Spring physics state per letter (matches hero-physics damped spring model)
    var spring = 0.015;
    var damping = 0.90;
    var settleThreshold = 0.3;
    var arrivalThreshold = 3;

    var physics = letters.map(function () {
      var sx = (Math.random() - 0.5) * 90;
      var sy = (Math.random() - 0.5) * 60;
      return { x: sx, y: sy, vx: 0, vy: 0, settled: false, arrived: false };
    });

    // Position letters at their scattered start points, invisible
    letters.forEach(function (l, i) {
      l.el.style.transform = 'translate(' + physics[i].x + 'px, ' + physics[i].y + 'px)';
      l.el.style.opacity = '0';
    });

    // Draw edges between letter pairs
    var lines = [];
    for (var i = 0; i < letters.length; i++) {
      for (var j = i + 1; j < letters.length; j++) {
        if (j - i <= 2 || Math.random() < 0.15) {
          var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('stroke', accentColor);
          line.setAttribute('stroke-width', '1.2');
          line.setAttribute('stroke-opacity', '0');
          svg.appendChild(line);
          lines.push({ line: line, from: i, to: j });
        }
      }
    }

    function updateLines() {
      var cRect = el.getBoundingClientRect();
      lines.forEach(function (edge) {
        // If both endpoints settled, snap line away fast
        if (edge.dead) return;
        if (physics[edge.from].arrived && physics[edge.to].arrived) {
          edge.line.style.transition = 'stroke-opacity 0.1s ease';
          edge.line.setAttribute('stroke-opacity', '0');
          edge.dead = true;
          return;
        }

        var a = letters[edge.from].el.getBoundingClientRect();
        var b = letters[edge.to].el.getBoundingClientRect();
        var ax = a.left + a.width / 2 - cRect.left;
        var ay = a.top + a.height / 2 - cRect.top;
        var bx = b.left + b.width / 2 - cRect.left;
        var by = b.top + b.height / 2 - cRect.top;
        edge.line.setAttribute('x1', ax);
        edge.line.setAttribute('y1', ay);
        edge.line.setAttribute('x2', bx);
        edge.line.setAttribute('y2', by);

        var dx = ax - bx, dy = ay - by;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var opacity = Math.max(0, 0.35 * (1 - dist / 80));
        edge.line.setAttribute('stroke-opacity', opacity);
      });
    }

    var staggerPer = 40;
    var startTime = null;
    var settledCount = 0;

    // Fade letters in at scattered positions
    letters.forEach(function (l, i) {
      setTimeout(function () {
        l.el.style.opacity = '0.5';
        l.el.style.transition = 'opacity 0.15s ease';
      }, i * 30);
    });

    // Animate with damped spring physics (like hero-physics.js)
    function tick(now) {
      if (!startTime) startTime = now;
      var elapsed = now - startTime;

      var allDone = true;
      letters.forEach(function (l, i) {
        var p = physics[i];
        if (p.settled) return;

        var letterStart = 200 + i * staggerPer;
        if (elapsed < letterStart) { allDone = false; return; }

        // Spring force toward origin (0,0)
        p.vx += (0 - p.x) * spring;
        p.vy += (0 - p.y) * spring;
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx;
        p.y += p.vy;

        // Opacity ramps up as letter approaches origin
        var dist = Math.sqrt(p.x * p.x + p.y * p.y);
        var opacity = Math.min(1, 0.5 + 0.5 * (1 - dist / 60));
        l.el.style.transform = 'translate(' + p.x + 'px, ' + p.y + 'px)';
        l.el.style.opacity = String(opacity);

        // Mark first arrival at destination (lines fade on this)
        if (!p.arrived && dist < arrivalThreshold) {
          p.arrived = true;
        }

        // Settle when close enough and barely moving
        if (dist < settleThreshold && Math.abs(p.vx) < 0.1 && Math.abs(p.vy) < 0.1) {
          p.settled = true;
          l.el.style.transform = '';
          l.el.style.opacity = '1';
          settledCount++;
        } else {
          allDone = false;
        }
      });

      updateLines();

      if (!allDone) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(function () {
          if (svg.parentNode) svg.parentNode.removeChild(svg);
          el.style.position = '';
        }, 200);
      }
    }

    requestAnimationFrame(tick);
  }

  function init() {
    var elements = document.querySelectorAll('[data-animation]');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animate(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      elements.forEach(function (el) { observer.observe(el); });
    } else {
      elements.forEach(animate);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
