(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const welcome = $('#welcome');
  const content = $('#site-content');
  const mainTitle = $('#hero-title');
  let welcomeClosing = false;
  let hasVisited = false;
  try { hasVisited = sessionStorage.getItem('kovaci-welcome') === 'seen'; } catch { /* Private browsing may disable storage. */ }

  const closeWelcome = () => {
    if (welcomeClosing || welcome.hidden) return;
    welcomeClosing = true;
    try { sessionStorage.setItem('kovaci-welcome', 'seen'); } catch { /* The entrance still works without storage. */ }
    welcome.classList.add('exiting');
    content.inert = false;
    document.body.classList.remove('welcome-open');
    window.setTimeout(() => {
      welcome.hidden = true;
      mainTitle.focus({ preventScroll: true });
    }, reducedMotion.matches ? 0 : 750);
  };

  if (!hasVisited && !window.location.hash) {
    welcome.hidden = false;
    content.inert = true;
    document.body.classList.add('welcome-open');
    $('#enter-site').focus({ preventScroll: true });
  }
  $('#enter-site').addEventListener('click', closeWelcome);
  $('#skip-welcome').addEventListener('click', closeWelcome);
  welcome.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeWelcome();
    if (event.key !== 'Tab') return;
    const first = $('#skip-welcome');
    const last = $('#enter-site');
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    $$('.reveal').forEach((element) => observer.observe(element));
  }

  const header = $('#header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 15), { passive: true });
  const menuButton = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  const closeMenu = () => {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    mobileNav.hidden = expanded;
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  });
  $$('a', mobileNav).forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
  });
  document.addEventListener('click', (event) => { if (!header.contains(event.target)) closeMenu(); });
  window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

  // Dates use the visitor's local calendar, avoiding UTC's previous-day edge case.
  const dateISO = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const addDays = (value, days) => {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12);
    date.setDate(date.getDate() + days);
    return dateISO(date);
  };
  const today = dateISO(new Date());
  const pickup = $('#pickup-date');
  const dropoff = $('#return-date');
  const enquiryPickup = $('#enquiry-pickup');
  const enquiryReturn = $('#enquiry-return');
  const initializeDates = (start, end) => {
    start.min = today;
    start.value = addDays(today, 1);
    end.min = addDays(start.value, 1);
    end.value = addDays(start.value, 5);
    start.addEventListener('input', () => {
      if (!start.value) return;
      end.min = addDays(start.value, 1);
      end.setCustomValidity('');
      if (!end.value || end.value <= start.value) end.value = addDays(start.value, 1);
    });
    end.addEventListener('input', () => end.setCustomValidity(''));
  };
  initializeDates(pickup, dropoff);
  initializeDates(enquiryPickup, enquiryReturn);

  const validDates = (start, end) => {
    end.setCustomValidity('');
    if (!start.value || !end.value) return false;
    if (start.value < today || end.value <= start.value) {
      end.setCustomValidity('Choose a return date after your pick-up date. Pick-up cannot be in the past.');
      end.reportValidity();
      return false;
    }
    return true;
  };

  const enquiry = $('#enquiry-dialog');
  const privacy = $('#privacy-dialog');
  const openEnquiry = (vehicle) => {
    closeMenu();
    $('#form-error').hidden = true;
    $('#enquiry-result').hidden = true;
    enquiryPickup.min = dateISO(new Date());
    enquiryPickup.value = pickup.value;
    enquiryReturn.min = addDays(pickup.value || today, 1);
    enquiryReturn.value = dropoff.value;
    $('#enquiry-location').value = $('#pickup-location').value;
    $('#enquiry-vehicle').value = vehicle || 'Help me choose';
    enquiry.showModal();
    document.body.classList.add('dialog-open');
  };

  $$('[data-book]').forEach((button) => button.addEventListener('click', () => openEnquiry(button.dataset.vehicle)));
  $('#trip-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (validDates(pickup, dropoff)) openEnquiry();
  });
  [enquiry, privacy].forEach((dialog) => {
    $('[data-close-dialog]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  });

  $('#enquiry-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validDates(enquiryPickup, enquiryReturn)) return;
    const name = $('#enquiry-name').value.trim();
    const niceDate = (value) => {
      const [year, month, day] = value.split('-').map(Number);
      return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day, 12));
    };
    const message = [
      `Hello Auto Rental Kovaci!${name ? ` My name is ${name}.` : ''}`,
      'I would like to enquire about a car rental.',
      '',
      `Pick-up: ${niceDate(enquiryPickup.value)}`,
      `Return: ${niceDate(enquiryReturn.value)}`,
      `Pick-up area: ${$('#enquiry-location').value}`,
      `Vehicle preference: ${$('#enquiry-vehicle').value}`,
      '',
      'Please confirm available models, the total price, rental terms and collection arrangements. Thank you!'
    ].join('\n');
    const url = `https://wa.me/355689000860?text=${encodeURIComponent(message)}`;
    $('#whatsapp-fallback').href = url;
    $('#enquiry-result').hidden = false;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  $$('.filter').forEach((filter) => filter.addEventListener('click', () => {
    $$('.filter').forEach((button) => {
      const active = filter === button;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    let visibleCount = 0;
    $$('.vehicle-card').forEach((card) => {
      const matches = filter.dataset.filter === 'all' || card.dataset.category === filter.dataset.filter;
      card.hidden = !matches;
      if (matches) {
        visibleCount += 1;
        card.classList.add('is-visible');
      }
    });
    $('#fleet-count').textContent = visibleCount === 3 ? 'THREE WAYS TO MAKE IT YOURS' : 'YOUR SELECTED VEHICLE STYLE';
  }));

  $('#privacy-open').addEventListener('click', () => { privacy.showModal(); document.body.classList.add('dialog-open'); });
  $('#back-to-top').addEventListener('click', () => { window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' }); mainTitle.focus({ preventScroll: true }); });
  $('#year').textContent = new Date().getFullYear();
})();
