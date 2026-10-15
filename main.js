/* ============================================
   ADVANCE DENTAL & AESTHETICS - MAIN JS
   Handles: Scroll animations, navbar, FAQ,
   mobile menu, back-to-top, preloader
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Preloader ----------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 400);
    });
    // Fallback in case load already fired
    setTimeout(() => preloader.classList.add('hidden'), 2500);
  }

  // ---------- Split Text Animation ----------
  const splitTextEl = document.getElementById('hero-split-text');
  if (splitTextEl) {
    // Parse the title content preserving the <span> (accent) wrapper
    const rawHTML = splitTextEl.innerHTML.trim();
    
    // Extract words, detecting which ones were inside a <span>
    // Original: "Your <span>Smile</span> is Our Passion"
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHTML;
    
    const words = [];
    tempDiv.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          text.split(/\s+/).forEach(word => {
            if (word) words.push({ text: word, isAccent: false });
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
        const text = node.textContent.trim();
        if (text) {
          text.split(/\s+/).forEach(word => {
            if (word) words.push({ text: word, isAccent: true });
          });
        }
      }
    });

    // Build the split HTML
    let charIndex = 0;
    const staggerDelay = 0.04; // seconds between each character
    
    const splitHTML = words.map(wordObj => {
      const accentClass = wordObj.isAccent ? ' split-word--accent' : '';
      const chars = wordObj.text.split('').map(char => {
        const delay = charIndex * staggerDelay;
        charIndex++;
        return `<span class="split-char" style="transition-delay: ${delay.toFixed(2)}s">${char}</span>`;
      }).join('');
      // Count the space as a "character" for timing
      charIndex++;
      return `<span class="split-word${accentClass}">${chars}</span>`;
    }).join(' ');

    splitTextEl.innerHTML = splitHTML;
    
    // Trigger animation after a brief delay for the DOM to settle
    requestAnimationFrame(() => {
      setTimeout(() => {
        splitTextEl.classList.add('animate');
      }, 300);
    });
  }

  // ---------- Navbar scroll effect ----------
  const navbar = document.getElementById('navbar');
  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ---------- Active nav link on scroll ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---------- Mobile menu ----------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeMobileMenu = () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ---------- FAQ Accordion ----------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle current
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // ---------- Back to top button ----------
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Scroll reveal animations ----------
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Counter animation for stats ----------
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(start + (target - start) * eased);
          el.textContent = current.toLocaleString() + suffix;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target.toLocaleString() + suffix;
          }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- Ticker duplication for seamless loop ----------
  const tickerTrack = document.querySelector('.ticker__track');
  if (tickerTrack) {
    const content = tickerTrack.innerHTML;
    tickerTrack.innerHTML = content + content;
  }

  // ---------- Form submit feedback ----------
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
      const submitBtn = this.querySelector('.form-submit .btn');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        submitBtn.disabled = true;
      }
    });
  }

});
