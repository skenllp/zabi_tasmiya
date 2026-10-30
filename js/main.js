// ===== MAIN JS =====
(function() {
  'use strict';

  var CFG = window.WEDDING_CONFIG || {};

  // ===== REAL VIEWPORT HEIGHT FIX (iOS Safari address-bar bug) =====
  // iOS Safari's 100vh/100dvh doesn't reliably match the true visible
  // viewport on some iPhones, leaving a white gap below fixed elements
  // like the gate. We measure the real height with JS and expose it as
  // a CSS variable that the gate/body use instead.
  function setRealViewportHeight() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  setRealViewportHeight();
  window.addEventListener('resize', setRealViewportHeight);
  window.addEventListener('orientationchange', setRealViewportHeight);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setRealViewportHeight);
  }

  // ===== BACKGROUND MUSIC =====
  // Exposed on the outer scope so initGate() can call it directly from
  // the "Open Invitation" tap handler. Android Chrome is strict about
  // audio.play() needing to run inside the actual user-gesture call
  // stack — relying only on a bubbled document-level listener isn't
  // always reliable there, so we call this straight from the button too.
  var startMusicOnInteraction = function(){};

  function initMusic() {
    var audio     = document.getElementById('bg-music');
    var muteBtn   = document.getElementById('mute-btn');
    var iconSound = document.getElementById('icon-sound');
    var iconMuted = document.getElementById('icon-muted');
    if (!audio || !muteBtn) return;

    var musicCfg = CFG.music || {};
    audio.volume = musicCfg.volume != null ? musicCfg.volume : 0.45;
    var started = false;

    function setMutedState(muted) {
      if (muted) {
        audio.pause();
        iconSound.style.display = 'none';
        iconMuted.style.display = '';
        muteBtn.classList.add('muted');
        muteBtn.setAttribute('aria-label', 'Unmute music');
      } else {
        audio.play().catch(function(){});
        iconSound.style.display = '';
        iconMuted.style.display = 'none';
        muteBtn.classList.remove('muted');
        muteBtn.setAttribute('aria-label', 'Mute music');
      }
    }

    // Try immediate autoplay
    window.addEventListener('load', function() {
      audio.play()
        .then(function() { started = true; })
        .catch(function(){});
    });

    function startOnInteraction() {
      if (!started) {
        started = true;
        var playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function() {
            // Autoplay was blocked even on this gesture; allow a later
            // gesture to retry instead of staying stuck as "started".
            started = false;
          });
        }
      }
    }
    startMusicOnInteraction = startOnInteraction;

    document.addEventListener('click',      startOnInteraction, { once: true });
    document.addEventListener('scroll',     startOnInteraction, { once: true });
    document.addEventListener('touchstart', startOnInteraction, { once: true });

    muteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      startOnInteraction();
      setMutedState(!audio.paused);
    });
  }

  // ===== OPENING GATE (click-to-enter) =====
  function initGate() {
    var gate     = document.getElementById('gate');
    var enterBtn = document.getElementById('gate-open-btn');
    if (!gate || !enterBtn) return;

    var opened = false;

    // Prevent scroll and touch events while gate is active
    function preventScroll(e) {
      if (!opened && document.body.classList.contains('gate-active')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Add scroll prevention listeners
    document.addEventListener('scroll', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', preventScroll, { passive: false });

    function openGate() {
      if (opened) return;
      opened = true;

      // Call this synchronously, inside the same tap handler, so Android
      // Chrome counts it as a genuine user gesture for audio.play().
      startMusicOnInteraction();

      gate.classList.add('gate-closing');
      document.body.classList.remove('gate-active');
      document.body.classList.add('page-loaded');
      
      // Restore scroll on body
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';

      // Remove scroll prevention listeners
      document.removeEventListener('scroll', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventScroll);

      window.setTimeout(function() {
        gate.classList.add('gate-hidden');
        gate.setAttribute('aria-hidden', 'true');
      }, 1100);
    }

    enterBtn.addEventListener('click', openGate);
    enterBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGate();
      }
    });
  }

  // ===== MOBILE NAV TOGGLE =====
  function initMobileNav() {
    var burger   = document.querySelector('.nav-burger');
    var navLinks = document.querySelector('.nav-links');
    if (!burger || !navLinks) return;

    burger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      burger.classList.toggle('active');
    });
  }

  // ===== INTERSECTION OBSERVER FOR SECTION TRACKING =====
  function initSectionTracking() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (!navLinks.length) return;

    var sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function(link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function(s) { sectionObserver.observe(s); });
  }

  // ===== LIGHTBOX (gallery) =====
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lbImg    = document.getElementById('lightbox-img');
    var lbClose  = document.getElementById('lightbox-close');
    if (!lightbox || !lbImg) return;

    document.querySelectorAll('.gallery-item img').forEach(function(img) {
      img.addEventListener('click', function() {
        lbImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', function() {
    initMusic();
    initGate();
    initMobileNav();
    initSectionTracking();
    initLightbox();
  });
})();