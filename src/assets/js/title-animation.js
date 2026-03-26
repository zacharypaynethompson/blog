/**
 * title-animation.js — animated title with swappable variants
 *
 * Usage:
 *   <a class="nav-logo" data-animation="network" data-accent-start="4">zacsblog</a>
 *
 * Options:
 *   data-animation="variant"   — animation variant name (pull-up, neural-resolve, gradient-descent, network)
 *   data-accent-start="4"      — character index where accent color begins
 *
 * Override via URL: ?animation=variant-name
 * Respects prefers-reduced-motion: shows title instantly without animation.
 */

(function () {
  var variants = {};

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

  function resolveVariant(el) {
    var params = new URLSearchParams(window.location.search);
    var override = params.get('animation');
    if (override && variants[override]) return override;
    return el.getAttribute('data-animation') || Object.keys(variants)[0];
  }

  function animate(el) {
    var accentStart = parseInt(el.getAttribute('data-accent-start'), 10) || 4;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var letters = splitLetters(el, accentStart);

    if (reducedMotion) return; // letters already visible in final state

    var variantName = resolveVariant(el);
    var fn = variants[variantName];
    if (fn) fn(letters, el);
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
      elements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      elements.forEach(animate);
    }
  }

  /* ======================================================================
     Variant: pull-up
     Letters rise from behind a clipped surface with staggered overshoot.
     ====================================================================== */
  variants['pull-up'] = function (letters) {
    letters.forEach(function (l) {
      var wrap = document.createElement('span');
      wrap.className = 'title-letter-wrap';
      l.el.parentNode.insertBefore(wrap, l.el);
      wrap.appendChild(l.el);

      l.el.style.opacity = '0';
      l.el.style.transform = 'translateY(110%)';
      l.el.style.animationDelay = (l.index * 80) + 'ms';
      l.el.classList.add('anim-pull-up');
    });
  };

  /* ======================================================================
     Variant: neural-resolve
     Characters scramble through random glyphs then lock in left-to-right.
     ====================================================================== */
  variants['neural-resolve'] = function (letters) {
    var charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

    letters.forEach(function (l) {
      var correct = l.char;
      var interval = setInterval(function () {
        l.el.textContent = charset[Math.floor(Math.random() * charset.length)];
      }, 50);

      setTimeout(function () {
        clearInterval(interval);
        l.el.textContent = correct;
        l.el.classList.add('resolved');
      }, 300 + l.index * 150);
    });
  };

  /* ======================================================================
     Variant: gradient-descent
     Letters converge from scattered positions, fading in with jitter.
     ====================================================================== */
  variants['gradient-descent'] = function (letters) {
    letters.forEach(function (l) {
      var startX = (Math.random() - 0.5) * 80;
      var startY = (Math.random() - 0.5) * 50;
      l.el.style.setProperty('--start-x', startX + 'px');
      l.el.style.setProperty('--start-y', startY + 'px');
      l.el.style.opacity = '0';

      var delay = l.index * 50 + Math.random() * 80;
      l.el.style.animationDelay = delay + 'ms';
      l.el.classList.add('anim-gradient-descent');
    });
  };

  /* ======================================================================
     Variant: network
     Constellation-inspired: letters start scattered (like gradient-descent)
     and converge to their final positions while SVG edges connect nearby
     letters — a living network graph that collapses into the title.
     Same visual DNA as the hero physics banner.
     ====================================================================== */
  variants['network'] = function (letters, container) {
    var accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent').trim() || '#D2691E';

    // Create SVG overlay for connecting lines
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:visible;';
    container.style.position = 'relative';
    container.appendChild(svg);

    // Generate random start offsets for each letter (gradient-descent style)
    var offsets = letters.map(function () {
      return {
        x: (Math.random() - 0.5) * 90,
        y: (Math.random() - 0.5) * 60
      };
    });

    // Position letters at their scattered start points, invisible
    letters.forEach(function (l, i) {
      l.el.style.transform = 'translate(' + offsets[i].x + 'px, ' + offsets[i].y + 'px)';
      l.el.style.opacity = '0';
    });

    // Draw and update edges between letter pairs that are close enough
    var lines = [];
    function createLines() {
      for (var i = 0; i < letters.length; i++) {
        for (var j = i + 1; j < letters.length; j++) {
          // Connect adjacent letters and some non-adjacent pairs for richer graph
          if (j - i <= 2 || Math.random() < 0.15) {
            var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('stroke', accentColor);
            line.setAttribute('stroke-width', '0.8');
            line.setAttribute('stroke-opacity', '0');
            svg.appendChild(line);
            lines.push({ line: line, from: i, to: j });
          }
        }
      }
    }

    function updateLines() {
      var cRect = container.getBoundingClientRect();
      lines.forEach(function (edge) {
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

        // Opacity based on distance and convergence progress — fade faster as letters settle
        var dx = ax - bx, dy = ay - by;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var settledRatio = settled / letters.length;
        var fadeMult = 1 - settledRatio * settledRatio;
        var maxDist = 80;
        var opacity = Math.max(0, 0.2 * (1 - dist / maxDist) * fadeMult);
        edge.line.setAttribute('stroke-opacity', opacity);
      });
    }

    createLines();

    // Animate: fade letters in at scattered positions, then converge
    // Phase 1 (0-200ms): letters fade in at scattered positions, edges appear
    // Phase 2 (200-1200ms): letters converge to final position, edges update live
    // Phase 3 (1200-1600ms): node pulse on arrival, edges fade out

    var animDuration = 1000;
    var staggerPer = 40; // ms between each letter starting its convergence
    var startTime = null;
    var settled = 0;

    // Fade letters in quickly at their scattered positions
    letters.forEach(function (l, i) {
      setTimeout(function () {
        l.el.style.opacity = '0.5';
        l.el.style.transition = 'opacity 0.15s ease';
      }, i * 30);
    });

    // Animate convergence with requestAnimationFrame for live edge updates
    function tick(now) {
      if (!startTime) startTime = now;
      var elapsed = now - startTime;

      var allDone = true;
      letters.forEach(function (l, i) {
        var letterStart = 200 + i * staggerPer;
        var letterEnd = letterStart + animDuration;
        if (elapsed < letterStart) {
          allDone = false;
          return;
        }
        var t = Math.min(1, (elapsed - letterStart) / animDuration);
        // Ease-out with slight overshoot (cubic bezier approximation)
        var ease = 1 - Math.pow(1 - t, 3);

        var cx = offsets[i].x * (1 - ease);
        var cy = offsets[i].y * (1 - ease);
        l.el.style.transform = 'translate(' + cx + 'px, ' + cy + 'px)';
        l.el.style.opacity = String(0.5 + 0.5 * ease);

        if (t >= 1 && !l._settled) {
          l._settled = true;
          l.el.style.transform = '';
          l.el.style.opacity = '1';
          settled++;
        }
        if (t < 1) allDone = false;
      });

      updateLines();

      if (!allDone) {
        requestAnimationFrame(tick);
      } else {
        // All letters settled — fade out edges and clean up
        lines.forEach(function (edge) {
          edge.line.style.transition = 'stroke-opacity 0.4s ease';
          edge.line.setAttribute('stroke-opacity', '0');
        });
        setTimeout(function () {
          if (svg.parentNode) svg.parentNode.removeChild(svg);
          container.style.position = '';
        }, 500);
      }
    }

    requestAnimationFrame(tick);
  };

  /* ====================================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
