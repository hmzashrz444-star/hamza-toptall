/* One simple ordered navigator for the complete deck. */

(() => {
  const deck = document.querySelector('.deck');
  const slides = [...document.querySelectorAll('.slide')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = Math.max(0, slides.findIndex((item) => item.getAttribute('aria-hidden') !== 'true'));
  let moving = false;
  let wheelLocked = false;

  const setDeckState = (number) => {
    [...deck.classList].filter((name) => name.startsWith('is-on-slide-') || name.includes('-exiting')).forEach((name) => deck.classList.remove(name));
    if (number > 1) deck.classList.add(`is-on-slide-${number}`);
  };

  const activate = (index, instant = false) => {
    if (moving || index < 0 || index >= slides.length || index === current) return;
    moving = true;
    const outgoing = slides[current];
    const incoming = slides[index];
    const delay = instant || reducedMotion ? 0 : 180;

    outgoing.style.scrollBehavior = 'auto';
    outgoing.scrollTop = 0;

    outgoing.classList.remove('is-active', 'is-ready');
    outgoing.setAttribute('aria-hidden', 'true');

    window.setTimeout(() => {
      outgoing.hidden = true;
      incoming.hidden = false;
      incoming.setAttribute('aria-hidden', 'false');
      setDeckState(index + 1);
      incoming.classList.add(index === 0 ? 'is-ready' : 'is-active');
      incoming.style.scrollBehavior = 'auto';
      incoming.scrollTop = 0;
      window.requestAnimationFrame(() => {
        outgoing.style.removeProperty('scroll-behavior');
        incoming.style.removeProperty('scroll-behavior');
      });
      current = index;
      moving = false;
      incoming.focus?.({ preventScroll: true });
    }, delay);
  };

  slides.forEach((item, index) => {
    const active = index === current;
    item.hidden = !active;
    item.setAttribute('aria-hidden', String(!active));
  });
  setDeckState(current + 1);

  document.addEventListener('click', (event) => {
    const control = event.target.closest('button');
    if (!control) return;
    const id = control.id;
    if (id === 'continue-button' || /^slide-\d+-next$/.test(id)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      activate(current + 1);
    } else if (/^slide-\d+-back$/.test(id)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      activate(current - 1);
    }
  }, true);

  window.addEventListener('keydown', (event) => {
    const forward = ['ArrowRight', 'ArrowDown', 'PageDown', 'Enter', ' '];
    const backward = ['ArrowLeft', 'ArrowUp', 'PageUp', 'Home'];
    if (![...forward, ...backward].includes(event.key)) return;

    const active = slides[current];
    const evidenceTarget = active.dataset.evidenceTarget;
    if (evidenceTarget) {
      const scrolled = active.scrollTop > 8;
      if (['ArrowDown', 'PageDown', ' '].includes(event.key) && !scrolled) {
        event.preventDefault();
        event.stopImmediatePropagation();
        document.querySelector(`#${evidenceTarget}`)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      if (['ArrowUp', 'PageUp', 'Home'].includes(event.key) && scrolled) {
        event.preventDefault();
        event.stopImmediatePropagation();
        active.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        return;
      }
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    if (forward.includes(event.key)) activate(current + 1);
    else activate(current - 1);
  }, true);

  window.addEventListener('wheel', (event) => {
    if (moving || wheelLocked || Math.abs(event.deltaY) < 28) return;
    const active = slides[current];
    if (active.scrollHeight > active.clientHeight + 4) {
      const atTop = active.scrollTop <= 4;
      const atBottom = active.scrollTop + active.clientHeight >= active.scrollHeight - 4;
      if ((event.deltaY > 0 && !atBottom) || (event.deltaY < 0 && !atTop)) return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    wheelLocked = true;
    activate(current + (event.deltaY > 0 ? 1 : -1));
    window.setTimeout(() => { wheelLocked = false; }, 520);
  }, { capture: true, passive: false });

  document.querySelector('#slide-4-evidence-cue')?.addEventListener('click', () => {
    document.querySelector('#slide-4-evidence')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
  document.querySelector('#slide-10-evidence-cue')?.addEventListener('click', () => {
    document.querySelector('#slide-10-evidence')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });

  window.PresentationDeck = { goTo: (number, instant = false) => activate(number - 1, instant) };
})();
