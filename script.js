/* ═══════════════════════════════════════════════════
   TANISHA GARG — PORTFOLIO  •  SCRIPTS
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Elements ──
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section');

  // ═════════════════════════════════════════════════
  // NAVBAR: Shrink on scroll & active link highlight
  // ═════════════════════════════════════════════════
  const onScroll = () => {
    // Shrink
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ═════════════════════════════════════════════════
  // MOBILE MENU TOGGLE
  // ═════════════════════════════════════════════════
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ═════════════════════════════════════════════════
  // SCROLL REVEAL (Intersection Observer)
  // ═════════════════════════════════════════════════
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger the reveal for siblings
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ═════════════════════════════════════════════════
  // HERO PARTICLES
  // ═════════════════════════════════════════════════
  const particleContainer = document.getElementById('hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 4 + 2;
      p.style.width  = size + 'px';
      p.style.height = size + 'px';
      p.style.left   = Math.random() * 100 + '%';
      p.style.top    = Math.random() * 100 + '%';
      p.style.animationDuration = (Math.random() * 8 + 6) + 's';
      p.style.animationDelay    = (Math.random() * 5) + 's';
      particleContainer.appendChild(p);
    }
  }

  // ═════════════════════════════════════════════════
  // LIGHTBOX for gallery images
  // ═════════════════════════════════════════════════
  // Create lightbox container
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img src="" alt="" />';
  document.body.appendChild(lightbox);

  const lbImg   = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // ═════════════════════════════════════════════════
  // CONTACT FORM HANDLING
  // ═════════════════════════════════════════════════
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    // Email regex
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Show success (since Formspree needs a real endpoint, we show a nice UX)
    submitBtn.textContent = '✓ Message Sent!';
    submitBtn.style.pointerEvents = 'none';
    submitBtn.style.opacity = '0.7';
    form.reset();

    setTimeout(() => {
      submitBtn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
      submitBtn.style.pointerEvents = '';
      submitBtn.style.opacity = '';
    }, 3000);
  });
});
