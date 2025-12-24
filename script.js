// ---------- ENHANCED COVERFLOW WITH ERROR HANDLING ----------

(function () {
  'use strict';

  // Get elements with null checks
  const cards = document.querySelectorAll('.cf-card');
  const prev = document.querySelector('.cf-btn.left');
  const next = document.querySelector('.cf-btn.right');
  const track = document.querySelector('.coverflow-track');

  // Exit if essential elements don't exist
  if (!cards.length || !prev || !next || !track) {
    console.warn('Coverflow elements not found. Skipping initialization.');
    return;
  }

  let index = Math.floor(cards.length / 2);
  let isDragging = false;
  let startX = 0;
  let startMouseX = 0;

  /* ---------- CORE UPDATE WITH APPLE-STYLE POSITIONING ---------- */
  function updateCoverflow() {
    cards.forEach((card, i) => {
      // Remove all position classes
      card.classList.remove('active', 'left-1', 'left-2', 'left-3', 'right-1', 'right-2', 'right-3', 'hidden');

      // Calculate circular distance
      let diff = i - index;
      const total = cards.length;

      // Adjust diff for shortest path in circle
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      if (diff === 0) {
        card.classList.add('active');
        card.setAttribute('aria-current', 'true');
        card.setAttribute('tabindex', '0');
      } else {
        card.removeAttribute('aria-current');
        card.setAttribute('tabindex', '-1');

        if (diff === -1) card.classList.add('left-1');
        else if (diff === -2) card.classList.add('left-2');
        else if (diff <= -3) card.classList.add('left-3');
        else if (diff === 1) card.classList.add('right-1');
        else if (diff === 2) card.classList.add('right-2');
        else if (diff >= 3) card.classList.add('right-3');
      }
    });
  }

  /* ---------- NAVIGATION FUNCTIONS ---------- */
  function goToPrev() {
    index = (index - 1 + cards.length) % cards.length;
    updateCoverflow();
  }

  function goToNext() {
    index = (index + 1) % cards.length;
    updateCoverflow();
  }

  /* ---------- BUTTON NAVIGATION ---------- */
  prev.addEventListener('click', goToPrev);
  next.addEventListener('click', goToNext);

  /* ---------- CLICK TO FOCUS ---------- */
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      index = i;
      updateCoverflow();
      card.focus();
    });
  });

  /* ---------- KEYBOARD SUPPORT ---------- */
  let keyTimeout;
  document.addEventListener('keydown', (e) => {
    // Debounce rapid key presses
    if (keyTimeout) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
      keyTimeout = setTimeout(() => keyTimeout = null, 100);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
      keyTimeout = setTimeout(() => keyTimeout = null, 100);
    }
  });

  /* ---------- MOUSE DRAG SUPPORT (DESKTOP) ---------- */
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startMouseX = e.clientX;
    track.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;

    const endX = e.clientX;
    const diff = startMouseX - endX;

    // Threshold of 50px for drag
    if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrev();
    }

    isDragging = false;
    track.style.cursor = 'grab';
  });

  // Reset dragging if mouse leaves window
  document.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      track.style.cursor = 'grab';
    }
  });

  /* ---------- TOUCH / SWIPE SUPPORT (MOBILE) ---------- */
  let touchTimeout;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    // Debounce rapid touches
    if (touchTimeout) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) {
      goToNext();
      touchTimeout = setTimeout(() => touchTimeout = null, 300);
    } else if (diff < -50) {
      goToPrev();
      touchTimeout = setTimeout(() => touchTimeout = null, 300);
    }
  }, { passive: true });

  /* ---------- ACCESSIBILITY: FOCUS MANAGEMENT ---------- */
  cards.forEach((card) => {
    card.addEventListener('focus', function () {
      const focusedIndex = Array.from(cards).indexOf(this);
      if (focusedIndex !== index) {
        index = focusedIndex;
        updateCoverflow();
      }
    });
  });

  /* ---------- SET CURSOR STYLE ---------- */
  track.style.cursor = 'grab';

  /* ---------- INITIALIZE ---------- */
  updateCoverflow();

  // Announce to screen readers
  console.log('✓ Coverflow initialized with', cards.length, 'items');

})();


/* ---------- SMOOTH SCROLL ENHANCEMENT ---------- */
(function () {
  'use strict';

  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip empty or just # links
      if (href === '#' || href === '') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Focus target for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  });

})();


/* ---------- PRELOAD IMAGES ---------- */
(function () {
  'use strict';

  // Lazy load images when they come into viewport
  const images = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window && images.length) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

})();


/* ---------- LOADING SCREEN ---------- */
(function () {
  'use strict';

  const loadingScreen = document.querySelector('.loading-screen');

  if (!loadingScreen) return;

  // Hide loading screen after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      // Remove from DOM after transition
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }, 300);
  });

  // Fallback: hide after 2 seconds if load event doesn't fire
  setTimeout(() => {
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => loadingScreen.remove(), 500);
    }
  }, 2000);

})();


/* ---------- FADE IN ON SCROLL ---------- */
(function () {
  'use strict';

  const projectCards = document.querySelectorAll('.project-card');

  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers - show all elements
    projectCards.forEach(card => card.classList.add('visible'));
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  projectCards.forEach(card => observer.observe(card));

  console.log('✓ Scroll animations initialized');

})();