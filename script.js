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
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active link (only on index page)
    if (sections.length > 0) {
      let current = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) current = sec.getAttribute('id');
      });
      links.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${current}`);
      });
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ═════════════════════════════════════════════════
  // MOBILE MENU TOGGLE
  // ═════════════════════════════════════════════════
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle) navToggle.classList.remove('open');
      if (navLinks) navLinks.classList.remove('open');
    });
  });

  // ═════════════════════════════════════════════════
  // SCROLL REVEAL (Intersection Observer)
  // ═════════════════════════════════════════════════
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
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
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img src="" alt="" />';
  document.body.appendChild(lightbox);

  const lbImg   = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('.lightbox-close');

  function bindGalleryLightbox() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // ═════════════════════════════════════════════════
  // DYNAMIC PROJECT CARDS (index.html)
  // ═════════════════════════════════════════════════
  const projectsGrid = document.getElementById('projects-grid');

  if (projectsGrid) {
    fetch('projects/projects.json')
      .then(res => res.json())
      .then(projects => {
        projects.forEach((project, index) => {
          const card = document.createElement('article');
          card.className = 'project-card-compact reveal';
          card.style.animationDelay = (index * 0.1) + 's';

          card.innerHTML = `
            <div class="card-thumb">
              <img src="projects/${project.folder}/${project.thumbnail}" alt="${project.title}" loading="lazy" />
              <div class="card-thumb-overlay"></div>
            </div>
            <div class="card-body">
              <span class="card-tag">${project.tag}</span>
              <h3 class="card-title">${project.title}</h3>
              <p class="card-excerpt">${project.shortDescription}</p>
              <a href="project.html?id=${project.id}" class="btn btn-outline btn-sm">
                View Details <span class="btn-arrow">→</span>
              </a>
            </div>
          `;

          projectsGrid.appendChild(card);
        });

        // Trigger reveal for dynamically added cards
        document.querySelectorAll('.project-card-compact.reveal').forEach(el => {
          revealObserver.observe(el);
        });
      })
      .catch(err => {
        console.error('Could not load projects:', err);
        projectsGrid.innerHTML = '<p style="color:var(--text-secondary);text-align:center;">Projects could not be loaded.</p>';
      });
  }

  // ═════════════════════════════════════════════════
  // PROJECT DETAIL PAGE (project.html)
  // ═════════════════════════════════════════════════
  const detailHeader  = document.getElementById('project-detail-header');
  const detailGallery = document.getElementById('project-detail-gallery');

  if (detailHeader && detailGallery) {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
      detailHeader.innerHTML = '<p class="detail-error">No project specified. <a href="index.html#projects">Go back</a></p>';
      return;
    }

    fetch(`projects/${projectId}/details.json`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        // Update page title
        document.title = `${data.title} — Tanisha Garg`;

        // Render header
        detailHeader.innerHTML = `
          <span class="project-tag">${data.tag}</span>
          <h1 class="project-detail-title">${data.title}</h1>
          <p class="project-detail-desc">${data.description}</p>
        `;

        // Render gallery
        data.images.forEach(img => {
          const item = document.createElement('div');
          item.className = 'gallery-item';
          item.innerHTML = `<img src="projects/${projectId}/${img.src}" alt="${img.alt}" loading="lazy" />`;
          detailGallery.appendChild(item);
        });

        // Bind lightbox to new gallery items
        bindGalleryLightbox();
      })
      .catch(() => {
        detailHeader.innerHTML = '<p class="detail-error">Project not found. <a href="index.html#projects">Go back</a></p>';
      });
  }

  // ═════════════════════════════════════════════════
  // CONTACT FORM HANDLING
  // ═════════════════════════════════════════════════
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

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
  }
});
