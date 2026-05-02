/* =========================================================
   CAP LÉRINS — JS partagé pour toutes les pages
   ========================================================= */

(() => {
  'use strict';

  // 1. Année footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Menu mobile
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Header compact au scroll
  const header = document.getElementById('header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 4. FAQ — une seule ouverte à la fois
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => { if (other !== item) other.open = false; });
      }
    });
  });

  // 5. Apparitions au scroll
  const toReveal = document.querySelectorAll(
    '.section-head, .service-card, .reason, .price-card, .boat-image, .boat-text, .gallery figure, .faq-item, .contact-form-wrap, .contact-info'
  );
  toReveal.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    toReveal.forEach((el) => io.observe(el));
  } else {
    toReveal.forEach((el) => el.classList.add('visible'));
  }

  // 6. Formulaire de contact (uniquement sur contact.html)
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = '';
      note.className = 'form-note';
      form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));

      const data = Object.fromEntries(new FormData(form).entries());
      const errors = [];

      if (!data.name || data.name.trim().length < 2) errors.push('name');
      if (!data.phone || data.phone.replace(/\D/g, '').length < 6) errors.push('phone');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || !emailRegex.test(data.email)) errors.push('email');
      if (data.people && (Number(data.people) < 1 || Number(data.people) > 6)) errors.push('people');

      if (errors.length > 0) {
        errors.forEach((name) => {
          const field = form.querySelector(`[name="${name}"]`);
          if (field) field.classList.add('invalid');
        });
        note.textContent = 'Merci de compléter les champs obligatoires correctement.';
        note.classList.add('error');
        return;
      }

      /* 🔧 BRANCHEMENT FUTUR : Formspree / Web3Forms / endpoint perso
         fetch('https://formspree.io/f/VOTRE_ID', { ... }) */

      const formData = new FormData(form);

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
        .then(() => {
          note.textContent = 'Merci ! Votre demande a bien été envoyée. On vous recontacte rapidement.';
          note.classList.add('success');
          form.reset();
          setTimeout(() => note.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
        })
        .catch(() => {
          note.textContent = "Erreur lors de l'envoi. Réessayez ou contactez-nous par WhatsApp.";
          note.classList.add('error');
        });
    });

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('invalid'));
    });
  }

})();
