/* =============================================
   ZDANO — Main JavaScript
   ============================================= */

'use strict';

// =============================================
// CUSTOM CURSOR
// =============================================

const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let ringX = 0, ringY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
  dotX = e.clientX;
  dotY = e.clientY;
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top = dotY + 'px';
});

function animateRing() {
  ringX += (dotX - ringX) * 0.12;
  ringY += (dotY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity = '1';
  cursorRing.style.opacity = '1';
});

// Cursor grow on interactive elements
const interactiveEls = document.querySelectorAll('a, button, input, select, textarea, .toggle-btn, .service-card, .why-item');
interactiveEls.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.8)';
    cursorRing.style.width = '52px';
    cursorRing.style.height = '52px';
    cursorRing.style.borderColor = 'rgba(0, 229, 255, 0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorRing.style.width = '36px';
    cursorRing.style.height = '36px';
    cursorRing.style.borderColor = 'rgba(0, 229, 255, 0.5)';
  });
});

// =============================================
// NAVBAR — scroll glassmorphism
// =============================================

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// =============================================
// BURGER MENU
// =============================================

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// =============================================
// SCROLL REVEAL — IntersectionObserver
// =============================================

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
      revealObserver.unobserve(el);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// =============================================
// COUNT-UP ANIMATION (hero stats)
// =============================================

function countUp(el, target, duration = 1800) {
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        countUp(el, target);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// =============================================
// CALCULATOR
// =============================================

const calcType = document.getElementById('calcType');
const calcPages = document.getElementById('calcPages');
const rangeVal = document.getElementById('rangeVal');
const calcResult = document.getElementById('calcResult');
const resultNumEl = calcResult ? calcResult.querySelector('.result-num') : null;

let difficulty = 1;
let urgency = 1;

function updateCalc() {
  if (!calcType || !resultNumEl) return;
  const base = parseFloat(calcType.value);
  const pages = parseInt(calcPages.value);
  const pageMultiplier = 1 + (pages - 1) * 0.04;
  const price = Math.round(base * difficulty * urgency * pageMultiplier);
  animateResultNum(price);
}

let currentPrice = 150;
function animateResultNum(target) {
  const start = currentPrice;
  const duration = 350;
  const startTime = performance.now();
  const animate = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 2);
    const val = Math.round(start + (target - start) * eased);
    resultNumEl.textContent = val.toLocaleString('uk-UA');
    if (progress < 1) requestAnimationFrame(animate);
    else {
      resultNumEl.textContent = target.toLocaleString('uk-UA');
      currentPrice = target;
    }
  };
  requestAnimationFrame(animate);
}

// Toggle buttons setup
function setupToggleGroup(groupId, callback) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      callback(parseFloat(btn.dataset.val));
    });
  });
}

setupToggleGroup('calcDifficulty', (val) => {
  difficulty = val;
  updateCalc();
});

setupToggleGroup('calcUrgency', (val) => {
  urgency = val;
  updateCalc();
});

if (calcType) {
  calcType.addEventListener('change', updateCalc);
}

if (calcPages) {
  calcPages.addEventListener('input', () => {
    const val = calcPages.value;
    rangeVal.textContent = val + (val == 1 ? ' сторінка' : val < 5 ? ' сторінки' : ' сторінок');
    updateCalc();
  });
}

// =============================================
// CONTACT FORM VALIDATION
// =============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nameInput = document.getElementById('formName');
    const contactInput = document.getElementById('formContact');
    const messageInput = document.getElementById('formMessage');

    const nameError = document.getElementById('nameError');
    const contactError = document.getElementById('contactError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');

    // Reset
    [nameInput, contactInput, messageInput].forEach(el => el.classList.remove('error'));
    [nameError, contactError, messageError].forEach(el => el.textContent = '');

    // Validate name
    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      nameError.textContent = 'Введіть ваше ім\'я';
      valid = false;
    }

    // Validate contact
    const contactVal = contactInput.value.trim();
    if (!contactVal) {
      contactInput.classList.add('error');
      contactError.textContent = 'Введіть спосіб зв\'язку';
      valid = false;
    } else if (!contactVal.includes('@') && !contactVal.startsWith('+') && !contactVal.startsWith('0') && contactVal.length < 4) {
      contactInput.classList.add('error');
      contactError.textContent = 'Схоже, контакт введено неправильно';
      valid = false;
    }

    // Validate message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      messageInput.classList.add('error');
      messageError.textContent = 'Опишіть завдання детальніше (мін. 10 символів)';
      valid = false;
    }

    if (valid) {
      // Simulate form submit
      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.textContent = 'Надсилаю...';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.reset();
        formSuccess.classList.add('show');
        submitBtn.textContent = 'Надіслати заявку';
        submitBtn.disabled = false;
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 900);
    }
  });

  // Live clear errors
  contactForm.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });
}

// =============================================
// SMOOTH ACTIVE NAV HIGHLIGHT
// =============================================

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + id ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
