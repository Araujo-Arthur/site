document.addEventListener('DOMContentLoaded', function () {

  const nav = document.querySelector('nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  const animTargets = document.querySelectorAll(
    '.espec-card, .medico-card, .depo-card, .sobre-grid, .hero-content'
  );

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animTargets.forEach(function (el) {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  const stats = [
    { el: document.querySelector('.stat:nth-child(1) strong'), target: 15, suffix: '+ anos' },
    { el: document.querySelector('.stat:nth-child(2) strong'), target: 8000, suffix: '+', prefix: '+' },
    { el: document.querySelector('.stat:nth-child(3) strong'), target: 12, suffix: '' },
  ];

  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    stats.forEach(function (stat) {
      if (!stat.el) return;
      const duration = 1800;
      const start = performance.now();
      const initial = 0;

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = Math.floor(eased * (stat.target - initial) + initial);

        if (stat.target >= 1000) {
          stat.el.textContent = '+' + value.toLocaleString('pt-BR');
        } else {
          stat.el.textContent = '+' + value + (stat.suffix || '');
        }

        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const heroObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) animateCounters();
    }, { threshold: 0.3 });
    heroObserver.observe(heroSection);
  }

  const floatWa = document.querySelector('.float-wa');
  if (floatWa) {
    floatWa.setAttribute('title', 'Agendar consulta pelo WhatsApp');
  }

  const WHATSAPP_NUMBER = '5521983259795';
  const WHATSAPP_MESSAGE = encodeURIComponent('Olá! Gostaria de agendar uma consulta na Clínica Orthon+.');

  document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
    link.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + WHATSAPP_MESSAGE;
  });

});

(function injectAnimationCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .espec-card.fade-in { transition-delay: calc(var(--i, 0) * 80ms); }
    .medico-card.fade-in { transition-delay: calc(var(--i, 0) * 100ms); }
    .depo-card.fade-in   { transition-delay: calc(var(--i, 0) * 90ms); }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.espec-card').forEach(function (el, i) { el.style.setProperty('--i', i); });
  document.querySelectorAll('.medico-card').forEach(function (el, i) { el.style.setProperty('--i', i); });
  document.querySelectorAll('.depo-card').forEach(function (el, i) { el.style.setProperty('--i', i); });
})();
