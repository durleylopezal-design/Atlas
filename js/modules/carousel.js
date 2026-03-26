/* ══════════════════════════════════════
   MODULE: Carousel
   ══════════════════════════════════════ */

function getSlides(trackId) {
  return document.getElementById(trackId)?.querySelectorAll('.carousel-slide');
}

function currentIndex(slides) {
  return Array.from(slides).findIndex(s => s.classList.contains('active'));
}

function updateUI(trackId, idx, total) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const wrapper = track.closest('.carousel-wrapper');
  const counter = wrapper.querySelector('.carousel-counter');
  if (counter) counter.textContent = `${idx + 1} / ${total}`;
  wrapper.querySelectorAll('.carousel-dot').forEach((d, i) =>
    d.classList.toggle('active', i === idx)
  );
}

function pauseSlideVideo(slide) {
  const video = slide?.querySelector('video');
  if (video && !video.paused) video.pause();
}

function advance(trackId, dir) {
  const slides = getSlides(trackId);
  if (!slides || slides.length <= 1) return;
  let idx = currentIndex(slides);
  pauseSlideVideo(slides[idx]);
  slides[idx].classList.remove('active');
  idx = (idx + dir + slides.length) % slides.length;
  slides[idx].classList.add('active');
  updateUI(trackId, idx, slides.length);
}

/* ── Exposed to HTML onclick ── */
window.moveCarousel = (trackId, dir) => advance(trackId, dir);

window.goToSlide = (trackId, index) => {
  const slides = getSlides(trackId);
  if (!slides || !slides[index]) return;
  const current = currentIndex(slides);
  pauseSlideVideo(slides[current]);
  slides.forEach(s => s.classList.remove('active'));
  slides[index].classList.add('active');
  updateUI(trackId, index, slides.length);
};

/* ── Auto-advance with pause on hover ── */
export function initCarousels() {
  document.querySelectorAll('.carousel-track').forEach(track => {
    const id = track.id;
    const slides = track.querySelectorAll('.carousel-slide');
    if (slides.length <= 1) return;

    let timer = setInterval(() => advance(id, 1), 5000);
    const wrapper = track.closest('.carousel-wrapper');

    wrapper.addEventListener('mouseenter', () => clearInterval(timer));
    wrapper.addEventListener('mouseleave', () => {
      clearInterval(timer);
      timer = setInterval(() => advance(id, 1), 5000);
    });
  });
}
