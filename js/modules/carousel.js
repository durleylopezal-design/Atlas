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

/* ══════════════════════════════════════
   LIGHTBOX
   ══════════════════════════════════════ */
export function createLightbox() {
  if (document.getElementById('lightbox-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.style.cssText = `
    display:none;position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,0.92);
    align-items:center;justify-content:center;cursor:zoom-out;
  `;

  overlay.innerHTML = `
    <button id="lightbox-close"
      style="position:absolute;top:18px;right:22px;background:rgba(255,255,255,0.12);
      border:none;color:white;font-size:26px;line-height:1;width:40px;height:40px;
      border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
    <img id="lightbox-img" src="" alt=""
      style="max-width:92vw;max-height:88vh;object-fit:contain;border-radius:6px;
      box-shadow:0 8px 48px rgba(0,0,0,0.7);cursor:default;" />
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) window.closeLightbox();
  });
  overlay.querySelector('#lightbox-close').addEventListener('click', () => window.closeLightbox());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.style.display === 'flex') window.closeLightbox();
  });
}

window.openLightbox = function(src) {
  const overlay = document.getElementById('lightbox-overlay');
  if (!overlay) return;
  overlay.querySelector('#lightbox-img').src = src;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
  const overlay = document.getElementById('lightbox-overlay');
  if (!overlay) return;
  overlay.style.display = 'none';
  overlay.querySelector('#lightbox-img').src = '';
  document.body.style.overflow = '';
};

/* ── Auto-advance with pause on hover ── */
export function initCarousels() {
  createLightbox();

  document.querySelectorAll('.carousel-track').forEach(track => {
    const id = track.id;
    const slides = track.querySelectorAll('.carousel-slide');
    if (slides.length <= 1) return;

    /* Add lightbox click to static carousel images */
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => window.openLightbox(img.src));
      }
    });

    let timer = setInterval(() => advance(id, 1), 5000);
    const wrapper = track.closest('.carousel-wrapper');

    wrapper.addEventListener('mouseenter', () => clearInterval(timer));
    wrapper.addEventListener('mouseleave', () => {
      clearInterval(timer);
      timer = setInterval(() => advance(id, 1), 5000);
    });
  });
}
