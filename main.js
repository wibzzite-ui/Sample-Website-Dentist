// =====================================================
//  KlayBar – Main JavaScript
// =====================================================

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
const handleNavScroll = () => {
  if (window.scrollY > 40) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---- Scroll-triggered animations ----
const animateEls = document.querySelectorAll('[data-animate]');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(
          entry.target.parentElement?.querySelectorAll('[data-animate]') ?? []
        );
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 110);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  animateEls.forEach(el => obs.observe(el));
} else {
  animateEls.forEach(el => el.classList.add('visible'));
}

// ---- FAQ Accordion ----
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    faqItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ---- Contact form (demo submit) ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('#cf-submit-btn');
    if (btn) {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#4a7a45';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 4000);
    }
  });
}

// ---- Reservations form (demo submit) ----
const resForm = document.getElementById('reservationForm');
if (resForm) {
  resForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = resForm.querySelector('#res-submit-btn');
    if (btn) {
      btn.textContent = '✓ Request Sent!';
      btn.style.background = '#4a7a45';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send Reservation Request';
        btn.style.background = '';
        btn.disabled = false;
        resForm.reset();
      }, 4000);
    }
  });
}

// ---- Active nav link highlighting ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#')) return;
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
    // Also mark parent dropdown toggle as active
    const dropdownParent = link.closest('.dropdown');
    if (dropdownParent) {
      dropdownParent.querySelector('.dropdown-toggle')?.classList.add('active');
    }
  }
});

// =====================================================
//  FOLD TEXT – Cycling hero heading animation
//  Inspired by reactbits.dev/text-animations/fold-text
// =====================================================
(function initFoldText() {
  const wrap = document.getElementById('foldTextWrap');
  if (!wrap) return;           // Only runs on index.html

  // Words to cycle through — each replaces "Art & Soul"
  const WORDS = [
    'Art \u0026 Soul',
    'Creativity',
    'Community',
    'Great Food',
    'Connection',
  ];

  let currentIndex = 0;
  let isAnimating  = false;

  function getWordEl() {
    return wrap.querySelector('.fold-text-word');
  }

  function cycleWord() {
    if (isAnimating) return;
    isAnimating = true;

    const currentEl = getWordEl();
    if (!currentEl) { isAnimating = false; return; }

    // Step 1: fold OUT the current word
    currentEl.classList.remove('fold-in');
    currentEl.classList.add('fold-out');

    // Step 2: after fold-out (~400ms), swap text and fold IN
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % WORDS.length;

      // Create fresh element (avoids animation class conflicts)
      const nextEl = document.createElement('em');
      nextEl.className = 'fold-text-word fold-in';
      nextEl.innerHTML = WORDS[currentIndex];

      wrap.innerHTML = '';
      wrap.appendChild(nextEl);

      // Listen for fold-in animation end then unlock
      nextEl.addEventListener('animationend', () => {
        nextEl.classList.remove('fold-in');
        isAnimating = false;
      }, { once: true });

    }, 400); // matches foldOut duration
  }

  // Initial fold-in on page load
  window.addEventListener('load', () => {
    const el = getWordEl();
    if (el) {
      el.classList.add('fold-in');
      el.addEventListener('animationend', () => {
        el.classList.remove('fold-in');
      }, { once: true });
    }
    // Start cycling after first display (2.8s visible + 0.95s animation)
    setInterval(cycleWord, 2800);
  });
})();


