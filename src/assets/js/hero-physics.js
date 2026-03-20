(function() {
  var container = document.getElementById('hero-physics');
  if (!container) return;
  var canvas = container.querySelector('canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var W, H, particles, rafId = null, isVisible = true;
  var mouse = { x: -9999, y: -9999, active: false };
  var resizeTimer;

  function initCanvas() {
    W = container.clientWidth;
    H = container.clientHeight;
    canvas.width = W;
    canvas.height = H;
  }

  function createParticles() {
    var count = Math.max(58, Math.min(144, Math.floor(W / 17)));
    particles = [];
    for (var i = 0; i < count; i++) {
      var rx = Math.random() * W;
      var ry = Math.random() * H;
      var rare = Math.random() > 0.85;
      particles.push({
        x: rx, y: ry,
        vx: 0, vy: 0,
        restX: rx, restY: ry,
        r: rare ? 6 + Math.random() * 2 : 2 + Math.random() * 3,
        opacity: rare ? 0.12 + Math.random() * 0.08 : 0.15 + Math.random() * 0.25,
        excitement: 0
      });
    }
  }

  function drawFrame(time) {
    ctx.clearRect(0, 0, W, H);
    var radius = H * 0.9;
    var i, j, p, dx, dy, dist, f;

    // Physics update
    for (i = 0; i < particles.length; i++) {
      p = particles[i];

      // Gentle ambient drift (rest positions wander very slowly)
      p.restX += Math.sin(i * 1.7 + time * 0.0008) * 0.06;
      p.restY += Math.cos(i * 2.3 + time * 0.0006) * 0.06;

      // Spring toward rest position (slow drift back)
      p.vx += (p.restX - p.x) * 0.003;
      p.vy += (p.restY - p.y) * 0.003;

      if (mouse.active) {
        dx = p.x - mouse.x;
        dy = p.y - mouse.y;
        dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius && dist > 0.1) {
          f = 0.8 * Math.pow(1 - dist / radius, 2);
          p.vx += (dx / dist) * f;
          p.vy += (dy / dist) * f;
          p.excitement = Math.max(p.excitement, 1.0 - dist / radius);
        }
      }

      p.vx *= 0.94;
      p.vy *= 0.94;
      p.x += p.vx;
      p.y += p.vy;
      p.excitement *= 0.96;

      // Boundary clamping
      if (p.x < 0) { p.x = 0; p.vx *= -0.3; }
      else if (p.x > W) { p.x = W; p.vx *= -0.3; }
      if (p.y < 0) { p.y = 0; p.vy *= -0.3; }
      else if (p.y > H) { p.y = H; p.vy *= -0.3; }
    }

    // Draw connecting lines
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (i = 0; i < particles.length; i++) {
      for (j = i + 1; j < particles.length; j++) {
        dx = particles[i].x - particles[j].x;
        dy = particles[i].y - particles[j].y;
        if (dx > 80 || dx < -80 || dy > 80 || dy < -80) continue;
        var distSq = dx * dx + dy * dy;
        if (distSq < 6400) {
          var lineAlpha = 0.08 * (1 - distSq / 6400);
          // Brighten lines near excited particles
          var ex = Math.max(particles[i].excitement, particles[j].excitement);
          lineAlpha += ex * 0.12;
          ctx.strokeStyle = 'rgba(210, 105, 30, ' + lineAlpha + ')';
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      var dr = p.r * (1 + p.excitement * 0.4);
      var da = Math.min(p.opacity + p.excitement * 0.2, 0.6);
      ctx.beginPath();
      ctx.arc(p.x, p.y, dr, 0, 6.2832);
      ctx.fillStyle = 'rgba(210, 105, 30, ' + da + ')';
      ctx.fill();
    }
  }

  function loop(time) {
    if (!isVisible) { rafId = null; return; }
    drawFrame(time || 0);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    isVisible = true;
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  function stop() {
    isVisible = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  // Mouse events
  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  canvas.addEventListener('mouseenter', function() { mouse.active = true; });
  canvas.addEventListener('mouseleave', function() { mouse.active = false; });

  // Touch events
  canvas.addEventListener('touchstart', function(e) {
    var rect = canvas.getBoundingClientRect();
    var t = e.touches[0];
    mouse.x = t.clientX - rect.left;
    mouse.y = t.clientY - rect.top;
    mouse.active = true;
  }, { passive: true });
  canvas.addEventListener('touchmove', function(e) {
    var rect = canvas.getBoundingClientRect();
    var t = e.touches[0];
    mouse.x = t.clientX - rect.left;
    mouse.y = t.clientY - rect.top;
  }, { passive: true });
  canvas.addEventListener('touchend', function() { mouse.active = false; }, { passive: true });

  // Intersection Observer
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) start(); else stop();
    }).observe(container);
  }

  // Resize handler
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      var oldW = W, oldH = H;
      initCanvas();
      var sx = W / oldW, sy = H / oldH;
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.restX *= sx; p.restY *= sy;
        p.x *= sx; p.y *= sy;
        p.vx = 0; p.vy = 0;
        p.excitement = 0;
      }
    }, 150);
  });

  // Reduced motion check
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initCanvas();
    createParticles();
    drawFrame();
    return;
  }

  initCanvas();
  createParticles();
  start();
})();
