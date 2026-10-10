(function () {
  "use strict";

  const GALLERY_IMAGES = [
    "img/galeria/1000370043.jpg",
    "img/galeria/1000372104.jpg",
    "img/galeria/1000383267.jpg",
    "img/galeria/1000383268.jpg",
    "img/galeria/1000384188.jpg",
    "img/galeria/1000391764.jpg",
    "img/galeria/1000391765.jpg",
    "img/galeria/1000391766.jpg",
    "img/galeria/1000391767.jpg",
    "img/galeria/1000391768.jpg",
    "img/galeria/1000391769.jpg",
    "img/galeria/1000391770.jpg",
    "img/galeria/1000391771.jpg",
    "img/galeria/1000391772.jpg",
    "img/galeria/1000391773.jpg",
    "img/galeria/1000391775.jpg",
    "img/galeria/8c977d5b-45e2-4ffd-850b-da048a43b31d-1_all_52965.jpg",
    "img/galeria/8c977d5b-45e2-4ffd-850b-da048a43b31d-1_all_53015.jpg",
  ];

  const grid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("gallery-lightbox-img");
  const lightboxCounter = document.getElementById("gallery-lightbox-counter");
  const btnPrev = document.getElementById("gallery-prev");
  const btnNext = document.getElementById("gallery-next");
  const btnClose = document.getElementById("gallery-close");

  if (!grid || !lightbox || !lightboxImg) return;

  let currentIndex = 0;

  function buildGrid() {
    const fragment = document.createDocumentFragment();

    GALLERY_IMAGES.forEach((src, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "gallery-item";
      item.style.transitionDelay = `${Math.min(index * 45, 400)}ms`;
      item.setAttribute("aria-label", `Ver imagen ${index + 1} de ${GALLERY_IMAGES.length}`);

      const img = document.createElement("img");
      img.src = src;
      img.alt = `Momento Emaluz ${index + 1}`;
      img.loading = "lazy";
      img.decoding = "async";

      const overlay = document.createElement("span");
      overlay.className = "gallery-item-overlay";
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML =
        '<svg class="gallery-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>';

      item.appendChild(img);
      item.appendChild(overlay);

      item.addEventListener("click", () => openLightbox(index));
      fragment.appendChild(item);
    });

    grid.appendChild(fragment);
    observeItems();
  }

  function observeItems() {
    const items = grid.querySelectorAll(".gallery-item");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((item) => observer.observe(item));
  }

  function updateLightboxImage() {
    lightboxImg.src = GALLERY_IMAGES[currentIndex];
    lightboxImg.alt = `Momento Emaluz ${currentIndex + 1}`;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${GALLERY_IMAGES.length}`;
    }
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-open");
    lightboxImg.classList.remove("is-changing");
    lightboxImg.classList.add("is-zoom-in");
    window.setTimeout(() => lightboxImg.classList.remove("is-zoom-in"), 450);
    btnClose?.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-open");
    lightboxImg.removeAttribute("src");
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    lightboxImg.classList.add("is-changing");
    updateLightboxImage();
    window.setTimeout(() => lightboxImg.classList.remove("is-changing"), 280);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % GALLERY_IMAGES.length;
    lightboxImg.classList.add("is-changing");
    updateLightboxImage();
    window.setTimeout(() => lightboxImg.classList.remove("is-changing"), 280);
  }

  btnPrev?.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });

  btnNext?.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });

  btnClose?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("gallery-lightbox-backdrop")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });

  let touchStartX = 0;
  lightbox.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0]?.screenX ?? 0;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0]?.screenX ?? 0;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) < 50) return;
      if (diff > 0) showPrev();
      else showNext();
    },
    { passive: true }
  );

  buildGrid();
})();
