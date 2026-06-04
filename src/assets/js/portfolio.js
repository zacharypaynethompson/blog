// Portfolio page: description clamping + modal, and per-section carousels.
(function () {
  'use strict';

  // --- Modal ---------------------------------------------------------------
  const modal = document.querySelector('[data-portfolio-modal]');
  const modalTitle = modal && modal.querySelector('[data-modal-title]');
  const modalMeta = modal && modal.querySelector('[data-modal-meta]');
  const modalDescription = modal && modal.querySelector('[data-modal-description]');
  let lastFocused = null;

  function openModal(card) {
    if (!modal) return;
    const article = card.querySelector('article');
    const title = article.querySelector('.portfolio-card-title');
    const meta = article.querySelector('.portfolio-card-meta');
    const description = article.querySelector('[data-card-description]');

    modalTitle.textContent = title ? title.textContent : '';
    modalMeta.textContent = meta ? meta.textContent.replace(/\s+/g, ' ').trim() : '';
    modalMeta.hidden = !modalMeta.textContent;
    modalDescription.textContent = description ? description.textContent : '';

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('portfolio-modal-open');
    const closeBtn = modal.querySelector('.portfolio-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('portfolio-modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  if (modal) {
    modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  // --- Description clamping + read more ------------------------------------
  // Clamp only descriptions that actually overflow, so short ones stay clean.
  document.querySelectorAll('.portfolio-card').forEach(function (card) {
    const description = card.querySelector('[data-card-description]');
    const readMore = card.querySelector('[data-readmore]');
    if (!description || !readMore) return;

    description.classList.add('is-clamped');
    // After clamping, an overflowing element has scrollHeight > clientHeight.
    if (description.scrollHeight - description.clientHeight > 1) {
      readMore.hidden = false;
      readMore.addEventListener('click', function () {
        openModal(card);
      });
    } else {
      description.classList.remove('is-clamped');
    }
  });

  // --- Carousels -----------------------------------------------------------
  document.querySelectorAll('[data-portfolio-carousel]').forEach(function (carousel) {
    const track = carousel.querySelector('[data-carousel-track]');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    if (!track || !prev || !next) return;

    function pageWidth() {
      // Scroll by one card width plus the gap, falling back to the viewport.
      const card = track.querySelector('.portfolio-card');
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.offsetWidth + gap : track.clientWidth;
    }

    function update() {
      const overflowing = track.scrollWidth - track.clientWidth > 1;
      const atStart = track.scrollLeft <= 1;
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
      prev.hidden = !overflowing || atStart;
      next.hidden = !overflowing || atEnd;
    }

    prev.addEventListener('click', function () {
      track.scrollBy({ left: -pageWidth(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: pageWidth(), behavior: 'smooth' });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
