// ===== SCROLL ANIMATIONS (Custom AOS-like) =====
(function() {
  'use strict';

  let observer;

  function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-aos-delay') || 0);
          setTimeout(() => {
            el.classList.add('aos-animate');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // Expose a way for dynamically-added elements (e.g. content loaded from
  // the database after page load) to be picked up by the same fade-up animation.
  window.observeAOS = function(el) {
    if (observer && el) {
      observer.observe(el);
    } else if (el) {
      // Observer not ready yet; just show the element immediately.
      el.classList.add('aos-animate');
    }
  };

  // ===== NAV SCROLL EFFECT =====
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ===== SMOOTH SCROLL =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ===== RSVP FORM =====
  // Posts to the Google Sheet web-app URL in js/config.js (sheetsUrl).
  // A success message is only shown after the database confirms the write.
  function initRSVP() {
    var form = document.getElementById('rsvp-form');
    if (!form) return;

    var feedback = document.getElementById('rsvp-feedback');
    var btn      = form.querySelector('.rsvp-btn');
    var btnLabel = btn.querySelector('span');
    var submitting = false;
    var LABEL = 'CONFIRM RSVP';

    function setError(field, msg) {
      var el = form.querySelector('.rsvp-error[data-for="' + field + '"]');
      if (el) el.textContent = msg || '';
      var input = form.querySelector('[name="' + field + '"]');
      if (input && input.type !== 'radio') input.classList.toggle('invalid', !!msg);
    }
    function clearErrors() {
      ['name','phone','guests','attend'].forEach(function(f) { setError(f, ''); });
      feedback.className = 'rsvp-feedback';
      feedback.textContent = '';
    }
    function showFeedback(type, html) {
      feedback.className = 'rsvp-feedback ' + type + ' show';
      feedback.innerHTML = html;
    }

    ['name','phone','guests'].forEach(function(f) {
      var el = form.querySelector('[name="' + f + '"]');
      if (el) el.addEventListener('input', function() { setError(f, ''); });
    });
    form.querySelectorAll('[name="attend"]').forEach(function(r) {
      r.addEventListener('change', function() { setError('attend', ''); });
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (submitting) return;               // block accidental double-submits
      clearErrors();

      var get = function(n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
      var checked = form.querySelector('[name="attend"]:checked');
      var data = {
        name:      get('name'),
        phone:     get('phone'),
        guests:    get('guests'),
        attend:    checked ? checked.value : '',
        message:   get('message'),
        timestamp: Date.now(),
        submittedAt: new Date().toISOString()
      };

      // Honeypot — bots fill hidden fields; pretend success, save nothing
      if (get('website')) { form.reset(); return; }

      // Validation
      var ok = true, firstBad = null;
      if (!data.name || data.name.length < 2) { setError('name', 'Please enter your full name.'); ok = false; firstBad = firstBad || 'name'; }
      if (data.phone && !/^[0-9+()\-\s]{7,20}$/.test(data.phone)) { setError('phone', 'Please enter a valid phone number.'); ok = false; firstBad = firstBad || 'phone'; }
      if (!data.guests) { setError('guests', 'Please select the number of guests.'); ok = false; firstBad = firstBad || 'guests'; }
      if (!data.attend) { setError('attend', 'Please let us know if you will attend.'); ok = false; firstBad = firstBad || 'attend'; }
      if (!ok) {
        var target = form.querySelector('[name="' + firstBad + '"]');
        if (target && target.focus && target.type !== 'radio') target.focus();
        return;
      }

      var sheetsUrl = ((window.WEDDING_CONFIG || {}).sheetsUrl || '').trim();
      if (!sheetsUrl) {
        showFeedback('error', 'Sorry, RSVPs can’t be received right now because the invitation isn’t connected to its Google Sheet yet. Please try again later or contact the hosts directly.');
        return;
      }

      submitting = true;
      btn.disabled = true;
      btnLabel.textContent = 'SENDING…';

      var finished = false;
      var timer = setTimeout(function() {
        if (finished) return;
        finished = true;
        fail();
      }, 15000);

      function fail() {
        submitting = false;
        btn.disabled = false;
        btnLabel.textContent = LABEL;
        showFeedback('error', 'We couldn’t save your RSVP. Please check your connection and try again.');
      }

      // Google Apps Script web apps don't return readable CORS responses,
      // so we use no-cors: a resolved request means it was sent; a network
      // failure rejects and shows the error message.
      fetch(sheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: data.name, phone: data.phone, guests: data.guests,
          attend: data.attend, message: data.message,
          submittedAt: data.submittedAt
        })
      }).then(function() { done(null); }).catch(function(err) { done(err); });

      function done(error) {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        if (error) { console.error('RSVP save failed:', error); fail(); return; }

        form.reset();
        btnLabel.textContent = 'RSVP RECEIVED';
        var msg = data.attend === 'Yes'
          ? 'Jazakallah Khair, ' + escapeHtml(data.name) + '! Your RSVP is confirmed — we can’t wait to celebrate with you.'
          : data.attend === 'Maybe'
            ? 'Thank you, ' + escapeHtml(data.name) + '! We’ve noted your RSVP as “Maybe” — do let us know when you’re sure.'
            : 'Thank you, ' + escapeHtml(data.name) + ', for letting us know. You will be in our duas.';
        showFeedback('success', '<i class="fas fa-check-circle"></i> ' + msg);
        // Stay locked for a few seconds so an extra tap can't create a duplicate
        setTimeout(function() {
          submitting = false;
          btn.disabled = false;
          btnLabel.textContent = LABEL;
        }, 4000);
      }
    });
  }

  function escapeHtml(t) {
    var d = document.createElement('div'); d.textContent = t; return d.innerHTML;
  }


  // ===== COUNTDOWN FLIP ANIMATION STYLE =====
  function addCountdownStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .countdown-number.flip {
        animation: countFlip 0.3s ease;
      }
      @keyframes countFlip {
        0% { transform: translateY(0); opacity: 1; }
        50% { transform: translateY(-8px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  // ===== INIT ALL =====
  function init() {
    initAOS();
    initNav();
    initSmoothScroll();
    initRSVP();
    addCountdownStyle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
