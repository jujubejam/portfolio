// ─── DARK MODE TOGGLE ─────────────────────────────────
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const saved = localStorage.getItem('theme');
if (saved) html.setAttribute('data-theme', saved);

themeToggle?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ─── MOBILE MENU ──────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── SCROLL REVEAL ────────────────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

// Homepage: cards, category labels, CTA
document.querySelectorAll('.category-label').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 40}ms`;
  io.observe(el);
});
document.querySelectorAll('.card').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 2) * 90}ms`;
  io.observe(el);
});
const ctaEl = document.querySelector('#cta');
if (ctaEl) { ctaEl.classList.add('reveal'); io.observe(ctaEl); }

// Project pages: sections, quotes, images
document.querySelectorAll('.project-section, .project-quote, .project-closing-quote, .project-badge').forEach((el, i) => {
  el.classList.add('reveal');
  io.observe(el);
});
document.querySelectorAll('.project-img, .project-img-sm, .project-img-row, .project-img-row3').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// ─── SMOOTH ANCHOR SCROLL ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('nav')?.offsetHeight ?? 60;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ─── EMAIL COPY BUTTON ────────────────────────────────
const copyBtn = document.getElementById('copyEmailBtn');
const copyIcon = document.getElementById('copyIcon');
const copyLabel = document.getElementById('copyLabel');

if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('seongjukim@gmail.com').then(() => {
      // Fade out
      copyBtn.style.opacity = '0';
      setTimeout(() => {
        // Swap content while invisible
        copyIcon.src = copyIcon.src.replace('icon-copy.svg', 'icon-check.svg');
        copyLabel.textContent = 'Copied!';
        // Fade back in
        copyBtn.style.opacity = '';
      }, 200);

      setTimeout(() => {
        // Fade out again before reset
        copyBtn.style.opacity = '0';
        setTimeout(() => {
          copyIcon.src = copyIcon.src.replace('icon-check.svg', 'icon-copy.svg');
          copyLabel.textContent = 'seongjukim@gmail.com';
          copyBtn.style.opacity = '';
        }, 200);
      }, 2200);
    });
  });
}

// ─── BACK TO TOP ──────────────────────────────────────
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── ABOUT PAGE TOGGLES ───────────────────────────────
document.querySelectorAll('.about-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    const isOpen = target.classList.contains('open');
    target.classList.toggle('open', !isOpen);
    btn.classList.toggle('active', !isOpen);
  });
});

// ─── SCROLL CARD CAROUSEL ─────────────────────────────
const scrollOuter = document.querySelector('.scroll-cards-outer');
if (scrollOuter) {
  const cards = scrollOuter.querySelectorAll('.scroll-card');
  const dots = scrollOuter.querySelectorAll('.scroll-dot');
  let currentCard = -1;

  function showCard(index) {
    if (index === currentCard) return;
    if (currentCard >= 0) {
      const prev = currentCard;
      cards[prev].classList.remove('active');
      cards[prev].classList.add('exit');
      dots[prev].classList.remove('active');
      cards[prev].querySelectorAll('.text-highlight').forEach(el => el.classList.remove('highlighted'));
      setTimeout(() => cards[prev].classList.remove('exit'), 500);
    }
    currentCard = index;
    if (index >= 0) {
      cards[index].classList.add('active');
      dots[index].classList.add('active');
      setTimeout(() => {
        cards[index].querySelectorAll('.text-highlight').forEach(el => el.classList.add('highlighted'));
      }, 250);
    }
  }

  window.addEventListener('scroll', () => {
    const rect = scrollOuter.getBoundingClientRect();
    const scrollable = scrollOuter.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;

    if (scrolled <= 0 || scrolled >= scrollable) {
      showCard(-1);
      return;
    }

    const vh = window.innerHeight;
    const index = scrolled < vh ? 0 : scrolled < 2 * vh ? 1 : 2;
    showCard(index);
  }, { passive: true });
}

// ─── TEXT HIGHLIGHT ON SCROLL ─────────────────────────
const highlightIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('highlighted');
      highlightIO.unobserve(e.target);
    }
  });
}, { threshold: 0, rootMargin: '-28% 0px -28% 0px' });

document.querySelectorAll('.text-highlight').forEach(el => highlightIO.observe(el));

// ─── HIDE NAV AT FOOTER ───────────────────────────────
const navEl = document.getElementById('nav');
const footerEl = document.querySelector('footer');

if (navEl && footerEl) {
  const navVisIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      // Only hide nav if the page is actually scrollable (not short pages like About)
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 80;
      navEl.classList.toggle('nav-hidden', e.isIntersecting && isScrollable);
    });
  }, { threshold: 0.1 });
  navVisIO.observe(footerEl);
}
