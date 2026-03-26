/**
 * title-animation.js — animated title with swappable variants
 *
 * Usage:
 *   <a class="nav-logo" data-animation="pull-up" data-accent-start="4">zacsblog</a>
 *
 * Options:
 *   data-animation="variant"   — animation variant name (pull-up, neural-resolve, gradient-descent)
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

  /* ====================================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
