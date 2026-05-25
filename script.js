/* ============================================================
   Portfolio — script.js  |  Prince Uche
   ============================================================ */

/* ================================================================
   BLOCKCHAIN CANVAS ANIMATION - Block Grid Pattern with Traffic
   ================================================================ */
const canvas = document.getElementById('blockchainCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Traffic lines state
let trafficLines = [];
let animationTime = 0;

// Initialize traffic lines
function initTrafficLines() {
  trafficLines = [];
  const blockSize = 120;

  // Horizontal traffic lines
  for (let i = 0; i < Math.ceil(canvas.height / blockSize); i++) {
    trafficLines.push({
      type: 'horizontal',
      y: (i + 1) * blockSize,
      offset: Math.random() * canvas.width,
      speed: 2 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.3
    });
  }

  // Vertical traffic lines
  for (let i = 0; i < Math.ceil(canvas.width / blockSize); i++) {
    trafficLines.push({
      type: 'vertical',
      x: (i + 1) * blockSize,
      offset: Math.random() * canvas.height,
      speed: 2 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.3
    });
  }
}

initTrafficLines();
window.addEventListener('resize', () => {
  initTrafficLines();
});

function drawBlockchainBlocks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animationTime += 0.016; // ~60fps

  // Calculate zoom effect (pulsing zoom in/out)
  const zoomCycle = Math.sin(animationTime * 0.5) * 0.15 + 1; // Ranges from 0.85 to 1.15

  // Save canvas state
  ctx.save();

  // Apply zoom transformation from center
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(zoomCycle, zoomCycle);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  // Block grid parameters
  const blockSize = 120;
  const cols = Math.ceil(canvas.width / blockSize) + 1;
  const rows = Math.ceil(canvas.height / blockSize) + 1;

  // Draw grid of blocks
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * blockSize;
      const y = row * blockSize;

      // Alternate pattern for visual interest
      const isAlt = (col + row) % 2 === 0;
      const opacity = isAlt ? 0.15 : 0.08;

      // Draw outer block border
      ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, blockSize, blockSize);

      // Draw inner corners (smaller boxes in corners)
      const cornerSize = 15;
      ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 1.3})`;
      ctx.lineWidth = 1.5;

      // Top-left corner
      ctx.strokeRect(x + 5, y + 5, cornerSize, cornerSize);
      // Top-right corner
      ctx.strokeRect(x + blockSize - cornerSize - 5, y + 5, cornerSize, cornerSize);
      // Bottom-left corner
      ctx.strokeRect(x + 5, y + blockSize - cornerSize - 5, cornerSize, cornerSize);
      // Bottom-right corner
      ctx.strokeRect(x + blockSize - cornerSize - 5, y + blockSize - cornerSize - 5, cornerSize, cornerSize);

      // Draw connecting dots at block intersections
      const dotRadius = 2;
      ctx.fillStyle = `rgba(34, 211, 238, ${opacity * 1.5})`;
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw vertical connecting lines through blocks
  for (let col = 0; col < cols; col++) {
    const x = col * blockSize;
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal connecting lines through blocks
  for (let row = 0; row < rows; row++) {
    const y = row * blockSize;
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw moving traffic lines
  trafficLines.forEach(line => {
    if (line.type === 'horizontal') {
      // Moving horizontal lines (traffic flowing left to right)
      const trailLength = 150;

      for (let i = 0; i < 3; i++) {
        const pos = (line.offset + animationTime * line.speed * 30 + i * 80) % (canvas.width + trailLength) - trailLength;

        // Main bright line
        ctx.strokeStyle = `rgba(34, 211, 238, ${line.opacity})`;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pos, line.y);
        ctx.lineTo(pos + 40, line.y);
        ctx.stroke();

        // Glow effect
        ctx.shadowColor = `rgba(34, 211, 238, 0.6)`;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = `rgba(99, 102, 241, ${line.opacity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pos, line.y);
        ctx.lineTo(pos + 40, line.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    } else {
      // Moving vertical lines (traffic flowing top to bottom)
      const trailLength = 150;

      for (let i = 0; i < 3; i++) {
        const pos = (line.offset + animationTime * line.speed * 30 + i * 80) % (canvas.height + trailLength) - trailLength;

        // Main bright line
        ctx.strokeStyle = `rgba(34, 211, 238, ${line.opacity})`;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(line.x, pos);
        ctx.lineTo(line.x, pos + 40);
        ctx.stroke();

        // Glow effect
        ctx.shadowColor = `rgba(34, 211, 238, 0.6)`;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = `rgba(99, 102, 241, ${line.opacity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(line.x, pos);
        ctx.lineTo(line.x, pos + 40);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
  });

  // Restore canvas state
  ctx.restore();

  requestAnimationFrame(drawBlockchainBlocks);
}

drawBlockchainBlocks();

/* ---------- SVG Ring constants ---------- */
const RING_RADIUS = 50;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ≈ 314.159

/* Initialize all rings: set dasharray and hide (full dashoffset) */
document.querySelectorAll('.ring-fill').forEach(ring => {
  ring.style.strokeDasharray = RING_CIRCUMFERENCE;
  ring.style.strokeDashoffset = RING_CIRCUMFERENCE;
});

/* ================================================================
   NAVBAR — scroll glass effect + hamburger
   ================================================================ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

/* Close mobile nav when any link inside is clicked */
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ================================================================
   SKILLS — toggle + filter tabs + SVG ring animation
   ================================================================ */
const skillsToggle = document.getElementById('skillsToggle');
const skillsContainer = document.getElementById('skillsContainer');
const allSkillCards = Array.from(document.querySelectorAll('.skill-card'));

if (skillsToggle) {
skillsToggle.addEventListener('click', () => {
  const isOpen = skillsContainer.classList.toggle('open');
  skillsToggle.classList.toggle('active', isOpen);
  skillsToggle.setAttribute('aria-expanded', String(isOpen));
  skillsContainer.setAttribute('aria-hidden', String(!isOpen));

  if (isOpen) {
    skillsToggle.innerHTML = '<span class="toggle-icon" aria-hidden="true">&#9660;</span> Hide Skills';
    setActiveSkillFilter('all');
    applySkillFilter('all');
    showCards(allSkillCards);
    animateRings(allSkillCards);
  } else {
    skillsToggle.innerHTML = '<span class="toggle-icon" aria-hidden="true">&#9660;</span> Show My Skills';
    allSkillCards.forEach(c => {
      c.classList.remove('card-visible', 'card-hidden');
      c.style.order = '';
    });
    resetRings();
    setActiveSkillFilter('all');
  }
})
} else (err) => {
  console.error('Skills toggle button not found:', err);
}

/* Skill filter buttons */
document.querySelectorAll('.skill-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;
    const filter = btn.dataset.filter;
    setActiveSkillFilter(filter);
    applySkillFilter(filter);

    const visible = getSkillCards(filter);
    const notYetVisible = visible.filter(c => !c.classList.contains('card-visible'));
    if (notYetVisible.length) {
      showCards(notYetVisible);
      animateRings(notYetVisible);
    }
  });
});

function setActiveSkillFilter(filter) {
  document.querySelectorAll('.skill-filter').forEach(b => {
    const a = b.dataset.filter === filter;
    b.classList.toggle('active', a);
    b.setAttribute('aria-selected', String(a));
  });
}

function getSkillCards(filter) {
  return filter === 'all' ? allSkillCards
    : allSkillCards.filter(c => c.dataset.category === filter);
}

/**
 * Reorder grid: visible cards appear first using CSS `order`,
 * then mark the rest hidden — prevents empty layout gaps.
 */
function applySkillFilter(filter) {
  const visible = getSkillCards(filter);
  const hidden = allSkillCards.filter(c => !visible.includes(c));
  visible.forEach((c, i) => { c.style.order = i; c.classList.remove('card-hidden'); });
  hidden.forEach((c, i) => { c.style.order = visible.length + i; c.classList.add('card-hidden'); });
}

/** Staggered fade-in for a set of skill cards. */
function showCards(cards) {
  cards.forEach((card, i) => {
    setTimeout(() => card.classList.add('card-visible'), i * 80);
  });
}

/** Staggered SVG ring animation, offset-matched to showCards. */
function animateRings(cards) {
  setTimeout(() => {
    cards.forEach((card, i) => {
      const ring = card.querySelector('.ring-fill');
      if (!ring) return;
      const pct = parseInt(ring.dataset.percent, 10) || 0;
      setTimeout(() => {
        ring.style.strokeDashoffset = RING_CIRCUMFERENCE - (pct / 100) * RING_CIRCUMFERENCE;
      }, i * 80);
    });
  }, 200);
}

function resetRings() {
  document.querySelectorAll('.ring-fill').forEach(r => {
    r.style.strokeDashoffset = RING_CIRCUMFERENCE;
  });
}

/* ================================================================
   PROJECTS — category filter tabs
   ================================================================ */
const allProjectCards = Array.from(document.querySelectorAll('.project-card'));

document.querySelectorAll('.project-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;

    /* Update active state */
    document.querySelectorAll('.project-filter').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', String(b === btn));
    });

    const filter = btn.dataset.filter;
    const visible = filter === 'all'
      ? allProjectCards
      : allProjectCards.filter(c => c.dataset.category === filter);
    const hidden = allProjectCards.filter(c => !visible.includes(c));

    /* Reorder and toggle visibility (same CSS-order trick as skills) */
    visible.forEach((c, i) => { c.style.order = i; c.classList.remove('proj-hidden'); });
    hidden.forEach((c, i) => { c.style.order = visible.length + i; c.classList.add('proj-hidden'); });
  });
});

/* ================================================================
   SCROLL REVEAL — IntersectionObserver
   ================================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ================================================================
   CONTACT FORM — FormSubmit AJAX → akansoprince@gmail.com
   ================================================================ */
// DEFENSIVE GUARDRAIL: Only initialize contact form if it exists on the page
const contactForm = document.getElementById('contactForm');

if (contactForm !== null) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const toast = document.getElementById('toast');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all fields.', false);
      return;
    }

    /* Loading state */
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res = await fetch('https://formsubmit.co/ajax/akansoprince@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio contact from ${name}`,
          _template: 'table'
        })
      });

      const data = await res.json();

      if (data.success === 'true' || data.success === true) {
        showToast("Message sent! I'll be in touch soon. ✓", true);
        contactForm.reset();
      } else {
        showToast('Something went wrong. Please try again.', false);
      }
    } catch {
      showToast('Network error. Please check your connection.', false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });

  function showToast(msg, success = true) {
    toast.textContent = msg;
    toast.className = `toast ${success ? 'toast-success' : 'toast-error'}`;
    void toast.offsetWidth; /* force reflow for re-trigger */
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
}

/* ================================================================
   TYPING EFFECT — Terminal Text Animation (On Scroll)
   ================================================================ */
function initTypingEffect() {
  const glassTerminal = document.querySelector('.glass-terminal');
  const typedElements = document.querySelectorAll('.typed-text');
  let hasStarted = false;

  // Create Intersection Observer to trigger typing when scrolled into view
  const typingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasStarted) {
        hasStarted = true;
        startTyping();
        typingObserver.unobserve(glassTerminal);
      }
    });
  }, { threshold: 0.3 });

  function startTyping() {
    typedElements.forEach((element, index) => {
      const fullText = element.getAttribute('data-text') || '';
      const cursor = element.parentElement.querySelector('.typing-cursor');
      let currentIndex = 0;
      let typingSpeed = 30; // Speed of typing in milliseconds

      // Delay for each line so they don't all start at once
      const delay = index * 1800;

      function typeNextCharacter() {
        if (currentIndex < fullText.length) {
          element.textContent += fullText.charAt(currentIndex);
          currentIndex++;
          setTimeout(typeNextCharacter, typingSpeed);
        } else if (currentIndex === fullText.length && cursor) {
          // Completed typing this line, hide cursor
          cursor.style.display = 'none';
        }
      }

      // Start typing after delay
      setTimeout(() => {
        typeNextCharacter();
      }, delay);
    });
  }

  // Start observing when glass-terminal is in view
  if (glassTerminal) {
    typingObserver.observe(glassTerminal);
  }
}

// Initialize typing effect
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTypingEffect);
} else {
  initTypingEffect();
}



