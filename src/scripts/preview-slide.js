/* Add ?slide=5 to open one slide instantly during visual review. */

(() => {
  const number = Number(new URLSearchParams(window.location.search).get('slide'));
  const target = document.querySelector(`#slide-${number}`);
  if (!number || !target) return;

  const intro = document.querySelector('#intro');
  document.body.classList.remove('intro-active');
  intro.hidden = true;
  intro.style.display = 'none';
  window.PresentationDeck?.goTo(number, true);
})();
