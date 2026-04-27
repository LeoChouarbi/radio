/* ============================================================
   RadioÉcole — main.js
   Vanilla, no React. Lazy + offscreen-aware.
   ============================================================ */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ─── Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── Preloader hide
  const preloader = document.getElementById('preloader');
  const hidePre = () => preloader && preloader.classList.add('is-hidden');
  if (document.readyState === 'complete') hidePre();
  else window.addEventListener('load', hidePre);
  setTimeout(hidePre, 2500); // safety

  // ─── Header scrolled state
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Burger menu
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');
  if (burger && nav) {
    const toggle = (open) => {
      const isOpen = open ?? !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle());
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  }

  // ─── Active nav link via IntersectionObserver
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (sections.length) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.toggle(
            'is-active',
            l.getAttribute('href') === '#' + e.target.id
          ));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => navObs.observe(s));
  }

  // ─── Reveal on scroll
  const revealEls = document.querySelectorAll('.section-head, .bento__card, .method__card, .format__card, .contact__info, .contact__form, .testimonial__quote, .stat-card, .audience__card, .ai__feature, .ai__visual, .manifest__line, .ba');
  revealEls.forEach(el => el.setAttribute('data-reveal', ''));
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revObs.observe(el));

  // ─── Custom cursor (desktop only)
  if (finePointer && !reduceMotion) {
    const cursor = document.getElementById('cursor');
    let x = 0, y = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
    const tick = () => {
      cx += (x - cx) * 0.25;
      cy += (y - cy) * 0.25;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();
    document.querySelectorAll('a, button, input, textarea, [data-magnetic], .band, .bento__card, .method__card, .format__card')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
      });
  }

  // ─── Magnetic buttons
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = 0.25;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // ─── Bento mouse light
  if (finePointer) {
    document.querySelectorAll('.bento__card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  // ─── Spectrum interaction
  const detailEl = document.getElementById('spectrumDetail');
  const bands = document.querySelectorAll('.band');
  if (detailEl && bands.length) {
    const updateDetail = (btn) => {
      bands.forEach(b => b.classList.toggle('is-active', b === btn));
      detailEl.querySelector('.spectrum__detail-name').textContent = btn.textContent.trim();
      detailEl.querySelector('.spectrum__detail-freq').textContent = btn.dataset.freq;
      detailEl.querySelector('p').textContent = btn.dataset.use;
      detailEl.style.borderColor = btn.style.getPropertyValue('--c');
    };
    bands.forEach(b => {
      b.addEventListener('mouseenter', () => updateDetail(b));
      b.addEventListener('focus',      () => updateDetail(b));
      b.addEventListener('click',      () => updateDetail(b));
    });
    updateDetail(bands[0]);
  }

  // ─── Hero oscilloscope (Canvas 2D, pause when offscreen)
  const canvas = document.getElementById('oscilloscope');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, raf, running = false, t = 0;
    let mx = 0.5, my = 0.5;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      const gridStep = 60;
      for (let x = 0; x < w; x += gridStep) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gridStep) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // 3 waveforms
      const waves = [
        { freq: 0.012, amp: 0.18, phase: 0,    color: 'rgba(0,240,255,0.85)',  width: 1.6 },
        { freq: 0.018, amp: 0.10, phase: 1.5,  color: 'rgba(91,140,255,0.55)', width: 1.2 },
        { freq: 0.006, amp: 0.25, phase: 3.0,  color: 'rgba(255,46,136,0.30)', width: 1.0 },
      ];

      waves.forEach((wv, i) => {
        ctx.strokeStyle = wv.color;
        ctx.lineWidth = wv.width;
        ctx.beginPath();
        const cy = h * (0.5 + (my - 0.5) * 0.15);
        for (let x = 0; x <= w; x += 2) {
          const distFromMouse = Math.abs(x - mx * w) / w;
          const localAmp = wv.amp * h * (1 + (1 - Math.min(distFromMouse * 2, 1)) * 0.4);
          const y = cy + Math.sin(x * wv.freq + t * (1 + i * 0.3) + wv.phase) * localAmp
                       + Math.cos(x * wv.freq * 0.5 + t * 0.6) * (localAmp * 0.2);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    };

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(draw); } };
    const stop  = () => { if (running)  { running = false; cancelAnimationFrame(raf); } };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top)  / r.height;
    });

    // Pause when offscreen
    new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? start() : stop();
    }, { threshold: 0 }).observe(canvas);

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : (canvas.getBoundingClientRect().bottom > 0 && start());
    });
  }

  // ─── Hero title split-letter reveal
  const heroTitle = document.querySelector('[data-split]');
  if (heroTitle && !reduceMotion) {
    const html = heroTitle.innerHTML;
    // Wrap each visible character in a span (preserve tags)
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const walk = (node) => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...node.textContent].forEach((c, i) => {
          if (c === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span');
          s.textContent = c;
          s.style.cssText = 'display:inline-block;opacity:0;transform:translateY(40%) rotate(4deg);transition:opacity .8s, transform .8s;transition-delay:' + (i * 0.018) + 's';
          frag.appendChild(s);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') {
        [...node.childNodes].forEach(walk);
      }
    };
    [...wrapper.childNodes].forEach(walk);
    heroTitle.innerHTML = '';
    [...wrapper.childNodes].forEach(n => heroTitle.appendChild(n));

    requestAnimationFrame(() => {
      heroTitle.querySelectorAll('span').forEach(s => {
        s.style.opacity = '1';
        s.style.transform = 'none';
      });
    });
  }

  // ─── Lenis smooth scroll
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    const lenisRaf = (time) => { lenis.raf(time); requestAnimationFrame(lenisRaf); };
    requestAnimationFrame(lenisRaf);
  }

  // ─── Smooth scroll with header offset (Lenis-aware)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 60;
      if (lenis) lenis.scrollTo(top, { duration: 1.2 });
      else window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  // ─── Animated counters
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const fmt = (n) => n.toLocaleString('fr-FR');
    const animate = (el) => {
      const target = +el.dataset.count;
      const duration = 1600;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = fmt(Math.round(target * ease(p)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  }

  // ─── Manifest progressive reveal (line by line on scroll)
  const manifestLines = document.querySelectorAll('.manifest__line');
  if (manifestLines.length) {
    const mObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const i = +e.target.dataset.line || 0;
          setTimeout(() => e.target.classList.add('is-in'), i * 220);
          mObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    manifestLines.forEach(l => mObs.observe(l));
  }

  // ─── Theme toggle (persisted)
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    themeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', cur);
      localStorage.setItem('theme', cur);
      uiBeep(880, 0.04);
    });
  }

  // ─── UI sounds (opt-in, Web Audio)
  let audioCtx = null;
  let soundOn = localStorage.getItem('uiSound') === '1';
  const ensureAudio = () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  };
  const uiBeep = (freq = 440, vol = 0.12, dur = 0.09, type = 'sine') => {
    if (!soundOn) return;
    try {
      const ctx = ensureAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = type;
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur);
    } catch {}
  };
  // Petit "blip" double-fréquence pour effet plus radio/SDR
  const uiChirp = (f1, f2, dur = 0.12, vol = 0.1) => {
    if (!soundOn) return;
    try {
      const ctx = ensureAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(f1, now);
      osc.frequency.exponentialRampToValueAtTime(f2, now + dur);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur);
    } catch {}
  };
  const soundBtn = document.getElementById('soundToggle');
  // Expose globalement pour que les autres handlers puissent en tirer
  window.__uiBeep = uiBeep;
  window.__uiChirp = uiChirp;
  if (soundBtn) {
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    soundBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      localStorage.setItem('uiSound', soundOn ? '1' : '0');
      soundBtn.setAttribute('aria-pressed', String(soundOn));
      if (soundOn) { ensureAudio(); uiChirp(440, 880, 0.18, 0.14); }
    });
    // Sons différenciés par type d'élément
    document.addEventListener('click', (e) => {
      if (!soundOn) return;
      const t = e.target;
      if (t.closest('.btn--primary, .nav__cta')) uiChirp(520, 880, 0.14, 0.13);
      else if (t.closest('.band')) {
        // Pitch selon la position de la bande dans le spectre
        const bands = [...document.querySelectorAll('.band')];
        const i = bands.indexOf(t.closest('.band'));
        uiBeep(440 + i * 110, 0.1, 0.1, 'sine');
      }
      else if (t.closest('button, summary')) uiBeep(660, 0.09, 0.07, 'sine');
      else if (t.closest('a')) uiBeep(880, 0.07, 0.06, 'sine');
    });
    // Survol des éléments interactifs : très bref tick
    document.addEventListener('pointerenter', (e) => {
      if (!soundOn || !finePointer) return;
      const t = e.target;
      if (t.matches && t.matches('.bento__card, .audience__card, .method__card, .format__card')) {
        uiBeep(1200, 0.04, 0.03, 'sine');
      }
    }, true);
  }

  // ─── Spectrum cursor tag
  if (finePointer) {
    const tag = document.createElement('div');
    tag.className = 'spectrum-tag';
    document.body.appendChild(tag);
    document.querySelectorAll('.band').forEach(b => {
      const c = b.style.getPropertyValue('--c').trim();
      b.addEventListener('mouseenter', () => {
        tag.style.setProperty('--c', c);
        tag.innerHTML = `<span>${b.textContent.trim()} · ${b.dataset.freq}</span>`;
        tag.classList.add('is-show');
      });
      b.addEventListener('mousemove', (e) => {
        tag.style.left = e.clientX + 'px';
        tag.style.top  = e.clientY + 'px';
      });
      b.addEventListener('mouseleave', () => tag.classList.remove('is-show'));
    });
  }

  // ─── Avant/Après slider IA
  const baViewer = document.getElementById('baViewer');
  const baRange  = document.getElementById('baRange');
  const baBefore = document.getElementById('baBefore');
  const baHandle = document.getElementById('baHandle');
  const baBeforePath = document.getElementById('baBeforePath');
  const baAfter = document.getElementById('baAfter');
  if (baViewer && baRange) {
    // Generate noisy + clean signal SVG paths
    const W = 800, H = 200, mid = H/2;
    let cleanD = `M0 ${mid}`;
    let noisyD = `M0 ${mid}`;
    for (let x = 2; x <= W; x += 2) {
      const clean = mid + Math.sin(x * 0.04) * 60 + Math.sin(x * 0.018) * 20;
      const noise = (Math.random() - 0.5) * 70;
      cleanD += ` L${x} ${clean.toFixed(1)}`;
      noisyD += ` L${x} ${(clean + noise).toFixed(1)}`;
    }
    baAfter.setAttribute('d', cleanD);
    baBeforePath.setAttribute('d', noisyD);

    const update = (val) => {
      baViewer.style.setProperty('--pos', val + '%');
      baBefore.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
      baHandle.style.left = val + '%';
    };
    let baLastSound = 0;
    baRange.addEventListener('input', (e) => {
      update(e.target.value);
      // Sweep réglable : pitch lié à la position du curseur, throttlé à 30ms
      const now = performance.now();
      if (window.__uiBeep && now - baLastSound > 35) {
        baLastSound = now;
        const v = +e.target.value;
        window.__uiBeep(200 + v * 10, 0.05, 0.025, 'sine');
      }
    });
    update(50);
  }

  // ─── Sounds : focus champs, ouverture FAQ, etc.
  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('focus', () => window.__uiBeep && window.__uiBeep(700, 0.06, 0.06, 'sine'));
  });
  document.querySelectorAll('details.faq__item').forEach(d => {
    d.addEventListener('toggle', () => {
      if (!window.__uiChirp) return;
      d.open ? window.__uiChirp(440, 720, 0.12, 0.1) : window.__uiChirp(720, 440, 0.1, 0.08);
    });
  });
  // Theme toggle : son grave/aigu selon clair/sombre
  const _themeToggleEl = document.getElementById('themeToggle');
  if (_themeToggleEl) {
    _themeToggleEl.addEventListener('click', () => {
      if (!window.__uiChirp) return;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      isLight ? window.__uiChirp(880, 440, 0.18, 0.12) : window.__uiChirp(440, 880, 0.18, 0.12);
    });
  }
  // Burger menu open/close
  const _burgerEl = document.getElementById('burger');
  if (_burgerEl) {
    _burgerEl.addEventListener('click', () => {
      if (!window.__uiChirp) return;
      const open = _burgerEl.getAttribute('aria-expanded') === 'true';
      open ? window.__uiChirp(660, 330, 0.16, 0.1) : window.__uiChirp(330, 660, 0.16, 0.1);
    });
  }

  // ─── Morse easter egg "..." ".._.."
  const morseBuf = [];
  let morseTimer = null;
  document.addEventListener('keydown', (e) => {
    if (e.key === '.' || e.key === '-') {
      morseBuf.push(e.key);
      clearTimeout(morseTimer);
      morseTimer = setTimeout(() => morseBuf.length = 0, 2500);
      const seq = morseBuf.join('');
      if (seq.endsWith('...---...')) {
        morseBuf.length = 0;
        sosFlash();
      }
    }
  });
  const sosFlash = () => {
    const fl = document.createElement('div');
    fl.className = 'morse-flash';
    document.body.appendChild(fl);
    const seq = [200, 200, 200, 200, 200, 200, 600, 200, 600, 200, 600, 200, 200, 200, 200, 200, 200];
    let total = 0;
    seq.forEach((d, i) => {
      total += d;
      setTimeout(() => {
        fl.classList.add('is-on');
        uiBeep(700, 0.08, 0.1);
        setTimeout(() => fl.classList.remove('is-on'), Math.min(d - 50, 300));
      }, total);
    });
    setTimeout(() => fl.remove(), total + 1000);
  };

  // ─── EmailJS contact form
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && window.emailjs) {
    emailjs.init('cX2lb1pbwVUFYNmJ2');

    const setStatus = (kind, msg) => {
      status.className = 'form-status is-show is-' + kind;
      status.textContent = msg;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Envoi en cours…';
      status.className = 'form-status';

      emailjs.sendForm('service_f5zle8u', 'template_afpdm48', form)
        .then(() => {
          setStatus('success', '✓ Demande envoyée. Vous aurez une réponse sous 48h ouvrées.');
          form.reset();
        })
        .catch((err) => {
          setStatus('error', '✗ Erreur d\'envoi : ' + (err?.text || 'réessayez plus tard.'));
        })
        .finally(() => {
          btn.disabled = false;
          btn.innerHTML = original;
        });
    });
  }
})();
