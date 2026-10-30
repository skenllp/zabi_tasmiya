// ===== COUNTDOWN TIMER =====
// Target comes from window.WEDDING_CONFIG (js/config.js).
// 14 Nov 2026, 4:30 PM IST — the explicit +05:30 offset makes every
// visitor, in any timezone, count down to the same real moment.
(function() {
  'use strict';

  var cfg    = (window.WEDDING_CONFIG || {}).countdown || {};
  var TARGET = new Date((cfg.nikah && cfg.nikah.target) || '2026-11-14T16:30:00+05:30');

  function pad(num) { return String(num).padStart(2, '0'); }

  function setCountdownValue(id, newVal) {
    var el = document.getElementById(id);
    if (!el) return;
    if (el.textContent !== newVal) {
      el.classList.add('flip');
      setTimeout(function() { el.classList.remove('flip'); }, 300);
      el.textContent = newVal;
    }
  }

  function updateCountdown() {
    var diff = TARGET - new Date();
    if (isNaN(diff) || diff < 0) diff = 0;   // never show negative numbers

    var days    = Math.floor(diff / 86400000);
    var hours   = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000)  / 60000);
    var seconds = Math.floor((diff % 60000)    / 1000);

    setCountdownValue('cd-days',    pad(days));
    setCountdownValue('cd-hours',   pad(hours));
    setCountdownValue('cd-minutes', pad(minutes));
    setCountdownValue('cd-seconds', pad(seconds));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
