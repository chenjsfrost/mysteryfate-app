/*
 * MysteryFate app shell: offline support (service worker), "Install app", and the update notice.
 * Exposes window.MFApp = { installState(), install(), onChange(fn) } for the engine's buttons.
 */
(function () {
  'use strict';

  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const listeners = new Set();
  const notify = () => listeners.forEach((fn) => { try { fn(); } catch (e) { /* ignore */ } });
  let deferred = null; // the browser's saved install prompt (Chrome, Edge, Android)

  addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; notify(); });
  addEventListener('appinstalled', () => { deferred = null; notify(); toast('Installed! Find MysteryFate with your other apps.'); });

  /** 'installed' | 'available' (one-tap install) | 'ios' (Share → Add to Home Screen) | 'unavailable' */
  function installState() {
    if (isStandalone()) return 'installed';
    if (deferred) return 'available';
    if (isIOS) return 'ios';
    return 'unavailable';
  }

  async function install() {
    if (!deferred) return false;
    const p = deferred; deferred = null;
    p.prompt();
    const choice = await p.userChoice.catch(() => ({ outcome: 'dismissed' }));
    notify();
    return choice.outcome === 'accepted';
  }

  // ---- small toast at the bottom of the screen
  function toast(msg, action, onAction) {
    let el = document.getElementById('app-toast');
    if (!el) { el = document.createElement('div'); el.id = 'app-toast'; el.className = 'app-toast'; el.setAttribute('role', 'status'); document.body.append(el); }
    el.textContent = '';
    const span = document.createElement('span'); span.textContent = msg; el.append(span);
    if (action) {
      const b = document.createElement('button'); b.className = 'btn btn-primary btn-small'; b.textContent = action;
      b.addEventListener('click', () => { el.classList.remove('show'); onAction(); });
      el.append(b);
    }
    const x = document.createElement('button'); x.className = 'app-toast-x'; x.setAttribute('aria-label', 'Dismiss'); x.textContent = '✕';
    x.addEventListener('click', () => el.classList.remove('show'));
    el.append(x);
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(el._t);
    if (!action) el._t = setTimeout(() => el.classList.remove('show'), 5000);
  }

  // ---- service worker (offline play + updates)
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    const hadController = !!navigator.serviceWorker.controller;
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloading) return; // first install: nothing to reload
      reloading = true; location.reload();
    });
    const offerUpdate = (sw) => toast('✨ A new version of MysteryFate is ready.', 'Refresh', () => sw.postMessage('skipWaiting'));
    addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then((reg) => {
        if (reg.waiting && hadController) offerUpdate(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.addEventListener('statechange', () => {
            if (sw.state !== 'installed') return;
            if (navigator.serviceWorker.controller) offerUpdate(sw);
            else {
              let told = false;
              try { told = localStorage.getItem('mf.offline') === '1'; localStorage.setItem('mf.offline', '1'); } catch (e) { /* ignore */ }
              if (!told) toast('✓ Saved for offline play. MysteryFate now works without internet.');
            }
          });
        });
        // Long sessions: look for new stories every 30 minutes.
        setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
      }).catch(() => { /* e.g. inside a sandboxed iframe: the game still works online */ });
    });
  }

  window.MFApp = { installState, install, isIOS, onChange: (fn) => listeners.add(fn), toast };
})();
