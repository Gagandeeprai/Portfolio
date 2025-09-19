/* Fixed script.js - Portfolio JavaScript */
document.addEventListener('DOMContentLoaded', () => {
  // Basic DOM references
  const sections = Array.from(document.querySelectorAll('section'));
  const navItems = Array.from(document.querySelectorAll('.dock-item'));
  const form = document.getElementById('contactForm');
  const dock = document.querySelector('.dock-navbar');

  console.log('Sections found:', sections.length);
  console.log('Nav items found:', navItems.length);
  console.log('Form found:', !!form);
  console.log('Dock found:', !!dock);

  /* -------------------- Utilities -------------------- */
  function getDockOffset() {
    if (!dock) return 0;
    const dockHeight = dock.offsetHeight || 0;
    const dockBottom = parseInt(getComputedStyle(dock).bottom, 10) || 0;
    return dockHeight + dockBottom + 20;
  }

  function smoothScrollTo(y) {
    window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: 'smooth' });
  }

  function scrollToSectionElement(targetSection) {
    if (!targetSection) return;
    const dockOffset = getDockOffset();
    const sectionTop = targetSection.offsetTop;
    const sectionHeight = targetSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    let scrollY;

    if (sectionHeight < viewportHeight - dockOffset) {
      const padding = (viewportHeight - dockOffset - sectionHeight) / 2;
      scrollY = sectionTop - padding;
    } else {
      scrollY = sectionTop - dockOffset - 8;
    }

    scrollY = Math.max(0, Math.min(scrollY, document.documentElement.scrollHeight - viewportHeight));
    smoothScrollTo(scrollY);
  }

  function createRippleEffect(element) {
    if (!element) return;
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      position:absolute;
      border-radius:50%;
      background:rgba(0,255,255,0.18);
      pointer-events:none;
      transform:scale(0);
      animation:ripple 0.6s linear;
      width:100px;height:100px;
      left:50%;top:50%;
      margin-left:-50px;margin-top:-50px;
    `;
    element.style.position = element.style.position || 'relative';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }

  /* -------------------- Navigation (dock) -------------------- */
  function updateActiveNavigation() {
    const dockOffset = getDockOffset();
    const viewportHeight = window.innerHeight;
    let maxVisible = 0;
    let activeSection = null;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, viewportHeight - dockOffset);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      if (visibleHeight > maxVisible) {
        maxVisible = visibleHeight;
        activeSection = section;
      }
    });

    navItems.forEach((i) => i.classList.remove('active'));
    if (activeSection) {
      const selector = `.dock-item[href="#${activeSection.id}"]`;
      const activeItem = document.querySelector(selector);
      if (activeItem) {
        activeItem.classList.add('active');
      }
    }
  }

  // Navigation click handlers
  navItems.forEach((item) => {
    if (!item) return;
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const href = item.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.getElementById(href.substring(1));
      if (!target) return;
      
      navItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      createRippleEffect(item);
      scrollToSectionElement(target);
      if (navigator.vibrate) navigator.vibrate(20);
    });
  });

  /* -------------------- Coverflow Carousel -------------------- */
  class CoverflowCarousel {
    constructor(container) {
      this.container = container;
      this.carousel = container.querySelector('.coverflow-carousel');
      this.cards = Array.from(container.querySelectorAll('.skill-card'));
      this.indicators = Array.from(container.querySelectorAll('.indicator'));
      this.prevBtn = container.querySelector('.prev-btn') || container.querySelector('#prevBtn');
      this.nextBtn = container.querySelector('.next-btn') || container.querySelector('#nextBtn');
      this.currentIndex = 0;
      this.totalCards = this.cards.length;
      this.isAnimating = false;
      this.isDragging = false;
      this.startX = 0;
      this.currentX = 0;
      this.threshold = 80;
      this.autoplayInterval = null;
      this.isHovered = false;

      if (!this.carousel || this.cards.length === 0) {
        console.warn('CoverflowCarousel: missing elements or zero cards');
        return;
      }

      this.init();
    }

    init() {
      this.updateCarousel();
      this.bindEvents();
      this.setupAutoplay();
    }

    bindEvents() {
      if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
      if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

      this.indicators.forEach((ind, idx) => {
        ind.addEventListener('click', () => this.goTo(idx));
      });

      this.cards.forEach((card, idx) => {
        card.addEventListener('click', () => {
          if (idx !== this.currentIndex) this.goTo(idx);
        });
      });

      this.setupTouchEvents();
      this.setupKeyboardEvents();

      this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
    }

    setupKeyboardEvents() {
      document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        const skillsSection = document.getElementById('skills');
        
        if (skillsSection && (skillsSection.contains(active) || active === document.body)) {
          if (e.key === 'ArrowLeft') { 
            e.preventDefault(); 
            this.prev(); 
          }
          if (e.key === 'ArrowRight') { 
            e.preventDefault(); 
            this.next(); 
          }
        }
      });
    }

    setupTouchEvents() {
      if (!this.carousel) return;

      this.carousel.addEventListener('pointerdown', (e) => this.handleStart(e));
      window.addEventListener('pointermove', (e) => this.handleMove(e));
      window.addEventListener('pointerup', (e) => this.handleEnd(e));

      // Fallback for older browsers
      this.carousel.addEventListener('mousedown', (e) => this.handleStart(e));
      this.carousel.addEventListener('touchstart', (e) => this.handleStart(e), { passive: true });
      
      window.addEventListener('mousemove', (e) => this.handleMove(e));
      window.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
      
      window.addEventListener('mouseup', (e) => this.handleEnd(e));
      window.addEventListener('touchend', (e) => this.handleEnd(e), { passive: true });

      this.carousel.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    handleStart(e) {
      if (this.isAnimating) return;
      this.isDragging = true;
      this.startX = this.getEventX(e);
      this.currentX = this.startX;
      this.carousel.classList.add('dragging');
      
      this.carousel.style.transition = 'none';
      this.cards.forEach((c) => (c.style.transition = 'none'));
      this.pauseAutoplay();
    }

    handleMove(e) {
      if (!this.isDragging) return;
      if (e.cancelable) e.preventDefault();
      
      this.currentX = this.getEventX(e);
      const deltaX = this.currentX - this.startX;
      const progress = Math.max(-1, Math.min(1, deltaX / this.threshold));
      this.updateCarouselWithProgress(progress);
    }

    handleEnd(e) {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.carousel.classList.remove('dragging');
      
      const deltaX = this.currentX - this.startX;
      const absDelta = Math.abs(deltaX);
      
      if (absDelta > this.threshold) {
        if (deltaX > 0) this.prev(); 
        else this.next();
      } else {
        this.updateCarousel();
      }
      
      this.resumeAutoplay();
    }

    getEventX(e) {
      if (e.touches && e.touches[0]) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].clientX;
      if (typeof e.clientX === 'number') return e.clientX;
      return window.innerWidth / 2;
    }

    updateCarouselWithProgress(progress) {
      this.cards.forEach((card, index) => {
        const position = this.getCardPosition(index, this.currentIndex + progress);
        this.applyCardTransform(card, position);
      });
    }

    prev() {
      if (this.isAnimating) return;
      this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
      this.updateCarousel();
    }

    next() {
      if (this.isAnimating) return;
      this.currentIndex = (this.currentIndex + 1) % this.totalCards;
      this.updateCarousel();
    }

    goTo(index) {
      if (this.isAnimating || index === this.currentIndex) return;
      this.currentIndex = index;
      this.updateCarousel();
    }

    updateCarousel() {
      this.isAnimating = true;
      
      this.carousel.style.transition = '';
      this.cards.forEach((c) => (c.style.transition = ''));

      this.cards.forEach((card, index) => {
        const position = this.getCardPosition(index, this.currentIndex);
        const isActive = index === this.currentIndex;
        card.classList.toggle('active', isActive);
        this.applyCardTransform(card, position, isActive);
      });

      this.indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === this.currentIndex);
      });

      setTimeout(() => (this.isAnimating = false), 600);
      if (navigator.vibrate) navigator.vibrate(20);
    }

    getCardPosition(cardIndex, centerIndex) {
      let position = cardIndex - centerIndex;
      if (position > this.totalCards / 2) position -= this.totalCards;
      if (position < -this.totalCards / 2) position += this.totalCards;
      return position;
    }

    applyCardTransform(card, position, isActive = false) {
      const isMobile = window.innerWidth <= 768;
      const baseDistance = isMobile ? 140 : 220;
      const translateX = position * baseDistance;
      let rotateY = 0, scale = 1, opacity = 1, zIndex = 10;

      if (position === 0) {
        rotateY = 0; 
        scale = isActive ? 1.05 : 1; 
        opacity = 1; 
        zIndex = 10;
      } else if (Math.abs(position) === 1) {
        rotateY = position > 0 ? -25 : 25; 
        scale = 0.92; 
        opacity = 0.85; 
        zIndex = 6;
      } else if (Math.abs(position) === 2) {
        rotateY = position > 0 ? -45 : 45; 
        scale = 0.75; 
        opacity = 0.6; 
        zIndex = 3;
      } else {
        rotateY = position > 0 ? -70 : 70; 
        scale = 0.5; 
        opacity = 0.3; 
        zIndex = 1;
      }

      card.style.transform = `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
    }

    setupAutoplay() {
      if (this.autoplayInterval) return;
      this.autoplayInterval = setInterval(() => {
        if (!this.isDragging && !this.isHovered) this.next();
      }, 4200);
    }

    pauseAutoplay() {
      this.isHovered = true;
      if (this.autoplayInterval) { 
        clearInterval(this.autoplayInterval); 
        this.autoplayInterval = null; 
      }
    }

    resumeAutoplay() {
      this.isHovered = false;
      if (!this.autoplayInterval) this.setupAutoplay();
    }

    destroy() {
      this.pauseAutoplay();
    }
  }

  /* -------------------- Visual Enhancements -------------------- */
  function enhanceTypingEffect() {
    const el = document.querySelector('.typing-text');
    if (!el) return;
    
    const text = el.dataset.text || el.textContent.trim() || 'Gagandeep Rai';
    el.textContent = '';
    el.style.borderRight = '3px solid #00ffff';
    
    let i = 0;
    function step() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(step, 120);
      } else {
        setInterval(() => {
          el.style.borderRightColor = el.style.borderRightColor === 'transparent' ? '#00ffff' : 'transparent';
        }, 700);
      }
    }
    setTimeout(step, 600);
  }

  function createDynamicParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    const existing = container.querySelectorAll('.particle').length;
    const toAdd = Math.max(0, 18 - existing);
    
    for (let i = 0; i < toAdd; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * -24}s`;
      p.style.animationDuration = `${14 + Math.random() * 14}s`;
      container.appendChild(p);
    }
  }

  function initParallaxEffect() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    const floatingElements = Array.from(document.querySelectorAll('.float-element, .shape, .code-snippet'));
    if (floatingElements.length === 0) return;

    let parallaxRAF = null;
    
    function onMove(e) {
      const clientX = e.clientX || (e.touches?.[0]?.clientX) || (window.innerWidth / 2);
      const clientY = e.clientY || (e.touches?.[0]?.clientY) || (window.innerHeight / 2);
      
      if (parallaxRAF) cancelAnimationFrame(parallaxRAF);
      
      parallaxRAF = requestAnimationFrame(() => {
        const xAxis = (clientX / window.innerWidth - 0.5) * 2;
        const yAxis = (clientY / window.innerHeight - 0.5) * 2;
        
        floatingElements.forEach((el, idx) => {
          const speed = (idx + 1) * 3;
          const tx = xAxis * speed;
          const ty = yAxis * speed;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
        });
      });
    }

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('touchmove', onMove, { passive: true });
    hero.addEventListener('mouseleave', () => {
      floatingElements.forEach((el) => (el.style.transform = 'translate(0,0)'));
    });
  }

  /* -------------------- Form Handling -------------------- */
  function validateField(field) {
    if (!field) return true;
    if (field.required) {
      const ok = field.value && field.value.trim().length > 0;
      field.classList.toggle('field-error', !ok);
      return ok;
    }
    return true;
  }

  async function submitFormWithAnimation() {
    if (!form) return;
    
    const btn = form.querySelector('.submit-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = `<div class="loading-spinner"></div><span>Sending...</span>`;
    btn.disabled = true;
    
    await new Promise((resolve) => setTimeout(resolve, 1400));
    
    btn.innerHTML = `<i class="fas fa-check"></i><span>Message Sent!</span>`;
    btn.style.background = 'linear-gradient(135deg,#00ff88,#00cc66)';
    
    setTimeout(() => {
      form.reset();
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = '';
      form.querySelectorAll('.field-error').forEach((el) => el.classList.remove('field-error'));
    }, 1600);
  }

  function initFormEnhancements() {
    if (!form) return;
    
    const inputs = Array.from(form.querySelectorAll('input, textarea'));
    
    inputs.forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => input.classList.remove('field-error'));
    });
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;
      
      inputs.forEach((field) => {
        if (!validateField(field)) isValid = false;
      });
      
      if (!isValid) return;
      await submitFormWithAnimation();
    });
  }

  /* -------------------- Stats Counter (Added) -------------------- */
  function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target')) || 0;
          const duration = 2000; // 2 seconds
          const step = target / (duration / 16); // 60fps
          let current = 0;

          const updateCounter = () => {
            current += step;
            if (current < target) {
              counter.textContent = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };

          updateCounter();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  /* -------------------- Matrix Rain Effect (Added) -------------------- */
  function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.1;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ffff';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    setInterval(drawMatrix, 35);

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  /* -------------------- Other Enhancement Functions -------------------- */
  function initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      observer.observe(el);
    });
  }

  function createScrollProgress() {
    if (document.querySelector('.scroll-progress')) return;
    
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    function update() {
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight - windowH;
      const pos = (window.scrollY / Math.max(1, docH)) * 100;
      bar.style.width = `${Math.min(100, Math.max(0, pos))}%`;
    }
    
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function createPreloader() {
    if (document.querySelector('.preloader')) return;
    
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
      <div class="preloader-content">
        <div class="preloader-logo"><span class="logo-text">GR</span></div>
        <div class="preloader-progress"><div class="progress-bar"></div></div>
        <div class="preloader-text">Loading Portfolio...</div>
      </div>
    `;
    document.body.appendChild(preloader);
    
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => preloader.remove(), 600);
    }, 1000);
  }

  function initAccessibilityFeatures() {
    // Skip link
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#hero';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      skipLink.style.cssText = `
        position:absolute;top:-40px;left:6px;background:#000;color:#fff;
        padding:8px;border-radius:4px;z-index:10001;transition:top 0.25s;
      `;
      skipLink.addEventListener('focus', () => skipLink.style.top = '6px');
      skipLink.addEventListener('blur', () => skipLink.style.top = '-40px');
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    navItems.forEach((item) => {
      item.setAttribute('role', 'button');
      const text = (item.textContent || '').trim();
      if (text) item.setAttribute('aria-label', `Navigate to ${text}`);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') document.body.classList.add('keyboard-navigation');
    });
  }

  function initLazyLoading() {
    const lazyImages = Array.from(document.querySelectorAll('img[data-src]'));
    if (lazyImages.length === 0) return;
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });
      
      lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      lazyImages.forEach((img) => (img.src = img.dataset.src));
    }
  }

  function respectMotionPreferences() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after { 
          animation-duration: 0.001ms !important; 
          animation-iteration-count: 1 !important; 
          transition-duration: 0.001ms !important; 
          scroll-behavior: auto !important; 
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* -------------------- Scroll & Header Management -------------------- */
  function updateStickyHeader() {
    const stickyHeader = document.querySelector('.sticky-header');
    const aboutSection = document.getElementById('about');
    
    if (!stickyHeader || !aboutSection) return;
    
    if (window.scrollY > (aboutSection.offsetHeight || 300)) {
      stickyHeader.classList.add('show');
    } else {
      stickyHeader.classList.remove('show');
    }
  }

  let scrollTicking = false;
  function handleScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    
    requestAnimationFrame(() => {
      try {
        updateActiveNavigation();
        updateStickyHeader();
      } catch (err) {
        console.error('handleScroll error', err);
      } finally {
        scrollTicking = false;
      }
    });
  }

  /* -------------------- Keyboard Navigation -------------------- */
  function initKeyboardNavigation() {
    function getCurrentSection() {
      const dockOffset = getDockOffset();
      const scrollPosition = window.scrollY + dockOffset + 1;
      let currentSectionId = sections[0]?.id || '';
      
      sections.forEach((section) => {
        if (scrollPosition >= section.offsetTop && 
            scrollPosition < section.offsetTop + section.offsetHeight) {
          currentSectionId = section.id;
        }
      });
      
      return currentSectionId;
    }

    function scrollToDirection(direction) {
      const currentId = getCurrentSection();
      const currentIndex = sections.findIndex((s) => s.id === currentId);
      let targetIndex = currentIndex;
      
      if (direction === 'next' && currentIndex < sections.length - 1) {
        targetIndex = currentIndex + 1;
      }
      if (direction === 'prev' && currentIndex > 0) {
        targetIndex = currentIndex - 1;
      }
      
      if (targetIndex !== currentIndex) {
        scrollToSectionElement(sections[targetIndex]);
        const targetNav = document.querySelector(`.dock-item[href="#${sections[targetIndex].id}"]`);
        if (targetNav) createRippleEffect(targetNav);
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'ArrowDown') { 
          e.preventDefault(); 
          scrollToDirection('next'); 
        }
        if (e.key === 'ArrowUp') { 
          e.preventDefault(); 
          scrollToDirection('prev'); 
        }
      }
    });
  }

  /* -------------------- Carousel Initialization -------------------- */
  function initCarousel() {
    try {
      const container = document.querySelector('.coverflow-container');
      if (!container) {
        console.log('No coverflow container found');
        return;
      }
      
      window.skillsCarousel = new CoverflowCarousel(container);
      console.log('Carousel initialized successfully');
    } catch (err) {
      console.error('Carousel initialization failed:', err);
    }
  }

  /* -------------------- Main Initialization -------------------- */
  function safeInit() {
    const initFunctions = [
      { name: 'Carousel', fn: initCarousel },
      { name: 'Form Enhancements', fn: initFormEnhancements },
      { name: 'Stats Counters', fn: initStatCounters },
      { name: 'Dynamic Particles', fn: createDynamicParticles },
      { name: 'Parallax Effect', fn: initParallaxEffect },
      { name: 'Matrix Rain', fn: createMatrixRain },
      { name: 'Typing Effect', fn: enhanceTypingEffect },
      { name: 'Keyboard Navigation', fn: initKeyboardNavigation },
      { name: 'Intersection Observer', fn: initIntersectionObserver },
      { name: 'Scroll Progress', fn: createScrollProgress },
      { name: 'Preloader', fn: createPreloader },
      { name: 'Accessibility Features', fn: initAccessibilityFeatures },
      { name: 'Lazy Loading', fn: initLazyLoading },
      { name: 'Motion Preferences', fn: respectMotionPreferences }
    ];

    initFunctions.forEach(({ name, fn }) => {
      try {
        fn();
        console.log(`✓ ${name} initialized`);
      } catch (err) {
        console.error(`✗ ${name} initialization failed:`, err);
      }
    });

    // Initial state updates
    updateActiveNavigation();
    updateStickyHeader();

    // Smooth page reveal
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.45s ease';
    setTimeout(() => { 
      document.body.style.opacity = '1'; 
    }, 80);
  }

  /* -------------------- Event Listeners -------------------- */
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', () => {
    updateActiveNavigation();
    if (window.skillsCarousel && typeof window.skillsCarousel.updateCarousel === 'function') {
      window.skillsCarousel.updateCarousel();
    }
  });

  // Global error handlers
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error || e.message, e.filename, e.lineno, e.colno);
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });

  // Debug helper
  window.debugPortfolio = function() {
    console.log({
      sections: sections.length,
      navItems: navItems.length,
      form: !!form,
      dock: !!dock,
      carousel: !!document.querySelector('.coverflow-container'),
      skillsCarousel: !!window.skillsCarousel
    });
  };

  // Initialize everything
  safeInit();
  // Make scrollToSection available globally
    window.scrollToSection = (sectionId) => {
      const target = document.getElementById(sectionId);
      if (target) scrollToSectionElement(target);
    };


});