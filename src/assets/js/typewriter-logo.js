/**
 * typewriter.js — variable-speed typewriter for Eleventy
 *
 * Usage:
 *   <h1 class="typewriter-title" data-typewriter>Your Post Title Here</h1>
 *
 * Options via data attributes:
 *   data-tw-min="40"       — minimum delay between characters (ms)
 *   data-tw-max="120"      — maximum delay between characters (ms)
 *   data-tw-cursor="done"  — cursor behaviour after typing: "done" (fade out), "persist" (keep blinking), "hide" (remove)
 *
 * The element's text content is read, cleared, then typed back in.
 * Runs once when the element enters the viewport (IntersectionObserver).
 */

(function () {
  function typewriter(el) {
    const text = el.textContent.trim();
    const minDelay = parseInt(el.dataset.twMin, 10) || 40;
    const maxDelay = parseInt(el.dataset.twMax, 10) || 120;
    const cursorEnd = el.dataset.twCursor || 'done';

    el.textContent = '';
    el.setAttribute('aria-label', text);

    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    el.appendChild(cursor);

    let i = 0;

    function step() {
      if (i < text.length) {
        const char = text[i];
        const charSpan = document.createElement('span');

        // Special handling for "zacsblog" - make "blog" orange
        if (text === 'zacsblog') {
          if (i >= 4) { // "blog" part (starting from index 4)
            charSpan.className = 'tw-char-accent';
          } else { // "zacs" part
            charSpan.className = 'tw-char-normal';
          }
        }

        charSpan.textContent = char;
        el.insertBefore(charSpan, cursor);
        i++;
        var delay = minDelay + Math.random() * (maxDelay - minDelay);
        // Pause slightly longer after punctuation
        if (i > 0 && /[,.:;!?]/.test(text[i - 1])) {
          delay += 200;
        }
        setTimeout(step, delay);
      } else {
        // Typing complete
        if (cursorEnd === 'hide') {
          cursor.classList.add('tw-cursor--hidden');
        } else if (cursorEnd === 'done') {
          cursor.classList.add('tw-cursor--done');
        }
        // "persist" leaves cursor blinking indefinitely
      }
    }

    step();
  }

  function init() {
    var elements = document.querySelectorAll('[data-typewriter]');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              typewriter(entry.target);
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
      // Fallback: type immediately
      elements.forEach(typewriter);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
