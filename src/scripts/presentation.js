/*
 * LOCKED FOUNDATION + SLIDE 01 INTERACTIONS
 * Future slide logic belongs in src/scripts/slides/slide-XX.js.
 */

const root = document.documentElement;
const slide = document.querySelector('.slide');
const continueButton = document.querySelector('#continue-button');
const status = document.querySelector('#stage-status');
const intro = document.querySelector('#intro');
const introSkip = document.querySelector('#intro-skip');
const coordinateReadout = document.querySelector('.coordinate-readout');

let statusTimer;
let introTimer;
let introCleanupTimer;
let slideReadyTimer;
let pointerFrame;
let pendingPointer;
let wheelLocked = false;
let slideBounds;
let lastReadoutUpdate = 0;

function buildKineticType() {
  document.querySelectorAll('[data-kinetic]').forEach((element) => {
    const characters = Array.from(element.textContent.trim());
    element.textContent = '';

    characters.forEach((character, index) => {
      const glyph = document.createElement('span');
      glyph.className = character === ' ' ? 'glyph glyph--space' : 'glyph';
      glyph.style.setProperty('--i', index);
      glyph.textContent = character === ' ' ? '\u00A0' : character;
      element.appendChild(glyph);
    });
  });
}

function finishIntro() {
  window.clearTimeout(introTimer);
  window.clearTimeout(introCleanupTimer);
  window.clearTimeout(slideReadyTimer);
  intro.classList.add('is-exiting');
  document.body.classList.remove('intro-active');
  slide.classList.remove('is-ready');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  slideReadyTimer = window.setTimeout(() => slide.classList.add('is-ready'), reducedMotion ? 0 : 520);
  introCleanupTimer = window.setTimeout(() => intro.remove(), reducedMotion ? 20 : 800);
}

function startIntro() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  introTimer = window.setTimeout(finishIntro, reducedMotion ? 80 : 1500);
}

function showStatus(message) {
  status.textContent = message;
  status.classList.add('is-visible');
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => status.classList.remove('is-visible'), 2600);
}

function setupMagneticControl() {
  const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
  if (!finePointer) return;

  continueButton.addEventListener('pointermove', (event) => {
    const bounds = continueButton.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * .16;
    const y = (event.clientY - bounds.top - bounds.height / 2) * .2;
    continueButton.style.setProperty('--mag-x', `${x}px`);
    continueButton.style.setProperty('--mag-y', `${y}px`);
  });

  continueButton.addEventListener('pointerleave', () => {
    continueButton.style.setProperty('--mag-x', '0px');
    continueButton.style.setProperty('--mag-y', '0px');
  });
}

function requestNextSlide() {
  // Navigation is handled by the latest implemented slide module.
}

slide.addEventListener('pointermove', (event) => {
  const bounds = slideBounds || slide.getBoundingClientRect();
  pendingPointer = {
    x: (event.clientX - bounds.left) / bounds.width,
    y: (event.clientY - bounds.top) / bounds.height,
  };

  if (pointerFrame) return;
  pointerFrame = window.requestAnimationFrame(() => {
    const { x, y } = pendingPointer;
    root.style.setProperty('--px', (x - 0.5) * 2);
    root.style.setProperty('--py', (y - 0.5) * 2);
    const now = performance.now();
    if (now - lastReadoutUpdate > 90) {
      coordinateReadout.children[0].textContent = `X ${String(Math.round(x * 100)).padStart(3, '0')}`;
      coordinateReadout.children[2].textContent = `Y ${String(Math.round(y * 100)).padStart(3, '0')}`;
      lastReadoutUpdate = now;
    }
    pointerFrame = null;
  });
});

slide.addEventListener('pointerenter', () => {
  slideBounds = slide.getBoundingClientRect();
});

slide.addEventListener('pointerleave', () => {
  root.style.setProperty('--px', 0);
  root.style.setProperty('--py', 0);
});

window.addEventListener('resize', () => { slideBounds = null; }, { passive: true });

continueButton.addEventListener('click', requestNextSlide);

window.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'ArrowDown', 'PageDown', 'Enter', ' '].includes(event.key)) {
    event.preventDefault();
    requestNextSlide();
  }

  if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Home'].includes(event.key)) {
    event.preventDefault();
    showStatus('You are on Slide 1.');
  }
});

window.addEventListener('wheel', (event) => {
  if (event.deltaY > 24 && !wheelLocked) {
    wheelLocked = true;
    requestNextSlide();
    window.setTimeout(() => { wheelLocked = false; }, 900);
  }
}, { passive: true });

introSkip.addEventListener('click', finishIntro);
buildKineticType();
setupMagneticControl();
window.addEventListener('load', startIntro, { once: true });
