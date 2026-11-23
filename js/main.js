const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');

if (navbarToggle) {
  navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
  });

  
  document.querySelectorAll('.navbar-links a').forEach(link => {
    link.addEventListener('click', () => {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
    });
  });
}

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-links a');

function setActiveLink() {
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', setActiveLink);

const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));

function handleSearch() {
  const keyword = document.getElementById('searchKeyword').value.trim().toLowerCase();
  const location = document.getElementById('searchLocation').value;
  const price = document.getElementById('searchPrice').value;

  const cards = document.querySelectorAll('.bimbel-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const name = card.querySelector('.bimbel-card-name').textContent.toLowerCase();
    const loc = card.querySelector('.bimbel-card-location').textContent.toLowerCase();
    const tags = card.querySelector('.bimbel-card-tags').textContent.toLowerCase();
    const priceText = card.querySelector('.bimbel-price').textContent;

    let show = true;

    
    if (keyword && !name.includes(keyword) && !tags.includes(keyword)) {
      show = false;
    }

    
    if (location && !loc.includes(location)) {
      show = false;
    }

    
    if (price) {
      const priceNum = parseInt(priceText.replace(/[^\d]/g, '')) * 1000;
      const [min, max] = price.includes('+')
        ? [parseInt(price), Infinity]
        : price.split('-').map(Number);

      if (priceNum < min || priceNum > max) {
        show = false;
      }
    }

    card.style.display = show ? '' : 'none';
    if (show) visibleCount++;
  });

  
  const bimbelSection = document.getElementById('bimbel');
  if (bimbelSection) {
    bimbelSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  
  const grid = document.getElementById('bimbelGrid');
  let noResult = grid.querySelector('.no-results');

  if (visibleCount === 0) {
    if (!noResult) {
      noResult = document.createElement('div');
      noResult.className = 'no-results';
      noResult.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--gray-500);';
      noResult.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
        <h3 style="color: var(--gray-700); margin-bottom: 8px;">Tidak ditemukan</h3>
        <p>Coba ubah kata kunci atau filter pencarian Anda.</p>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="resetSearch()">Reset Pencarian</button>
      `;
      grid.appendChild(noResult);
    }
  } else if (noResult) {
    noResult.remove();
  }
}

function resetSearch() {
  document.getElementById('searchKeyword').value = '';
  document.getElementById('searchLocation').value = '';
  document.getElementById('searchPrice').value = '';

  const cards = document.querySelectorAll('.bimbel-card');
  cards.forEach(card => card.style.display = '');

  const noResult = document.querySelector('.no-results');
  if (noResult) noResult.remove();
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.offsetTop - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

function animateCounters() {
  const counters = document.querySelectorAll('.hero-stat-number');

  counters.forEach(counter => {
    const text = counter.textContent;
    const hasPlus = text.includes('+');
    const hasK = text.includes('K');
    let target = parseInt(text.replace(/[^\d]/g, ''));

    if (hasK) {
      
      const suffix = hasPlus ? 'K+' : 'K';
      animateNumber(counter, target, suffix);
    } else if (hasPlus) {
      animateNumber(counter, target, '+');
    } else {
      animateNumber(counter, target, '');
    }
  });
}

function animateNumber(element, target, suffix) {
  let current = 0;
  const increment = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = current + suffix;
  }, 25);
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroObserver.observe(heroSection);
}

console.log('PILAR - Landing Page loaded successfully');
