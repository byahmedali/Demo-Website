document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  const setMenu = open => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.card, .timeline li, .form, .contact-info');
  revealEls.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Stat counters
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / 1200, 1);
      el.textContent = Math.round(target * p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  // Form validation
  const form = document.getElementById('contact-form');
  const status = form.querySelector('.form-status');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = input => {
    let msg = '';
    const v = input.value.trim();
    if (!v) msg = 'This field is required.';
    else if (input.type === 'email' && !emailRe.test(v)) msg = 'Enter a valid email address.';
    else if (input.minLength > 0 && v.length < input.minLength) msg = `Please enter at least ${input.minLength} characters.`;
    const field = input.closest('.field');
    field.classList.toggle('invalid', !!msg);
    field.querySelector('.error').textContent = msg;
    return !msg;
  };

  const required = [...form.querySelectorAll('[required]')];
  required.forEach(i => i.addEventListener('blur', () => validate(i)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    status.textContent = '';
    if (!required.map(validate).every(Boolean)) return;
    // Demo only: replace with a real fetch() to your backend.
    status.textContent = `Thanks, ${form.name.value.trim()}! We'll be in touch soon.`;
    form.reset();
  });
});
