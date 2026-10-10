(function () {
  "use strict";

  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const iconOpen = document.getElementById("icon-open");
  const iconClose = document.getElementById("icon-close");
  const yearEl = document.getElementById("year");
  const NAV_DESKTOP_MQ = window.matchMedia("(min-width: 1022px)");

  const EMALUZ_WHATSAPP = {
    phone: "56942431957",
    message:
      "Hola, me gustaría consultar disponibilidad y coordinar una primera instancia con Emaluz.",
  };

  function getWhatsAppUrl() {
    return (
      "https://wa.me/" +
      EMALUZ_WHATSAPP.phone +
      "?text=" +
      encodeURIComponent(EMALUZ_WHATSAPP.message)
    );
  }

  const whatsappUrl = getWhatsAppUrl();
  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    link.setAttribute("href", whatsappUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Scroll: navbar sólido */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Menú móvil */
  function setMenuOpen(open) {
    if (!navMenu || !navToggle || NAV_DESKTOP_MQ.matches) return;
    navMenu.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    iconOpen?.classList.toggle("hidden", open);
    iconClose?.classList.toggle("hidden", !open);
  }

  navToggle?.addEventListener("click", () => {
    const isOpen = navMenu?.classList.contains("open");
    setMenuOpen(!isOpen);
  });

  function syncNavForViewport() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    iconOpen?.classList.remove("hidden");
    iconClose?.classList.add("hidden");
  }

  NAV_DESKTOP_MQ.addEventListener("change", syncNavForViewport);
  syncNavForViewport();

  navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!NAV_DESKTOP_MQ.matches) {
        setMenuOpen(false);
      }
    });
  });

  /* Hero slideshow fade */
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  let currentSlide = 0;
  let slideTimer = null;
  const SLIDE_INTERVAL = 5500;

  function goToSlide(index) {
    if (!slides.length) return;
    currentSlide = ((index % slides.length) + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentSlide);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  }

  function startSlideshow() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, SLIDE_INTERVAL);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = Number(dot.getAttribute("data-slide"));
      if (!Number.isNaN(idx)) {
        goToSlide(idx);
        startSlideshow();
      }
    });
  });

  if (slides.length > 1) {
    startSlideshow();
  }

  /* FAQ acordeón */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const panel = item.querySelector(".faq-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach((other) => {
        if (other === item) return;
        other.classList.remove("open");
        const otherPanel = other.querySelector(".faq-panel");
        const otherTrigger = other.querySelector(".faq-trigger");
        otherPanel?.classList.add("hidden");
        otherTrigger?.setAttribute("aria-expanded", "false");
      });

      if (isOpen) {
        item.classList.remove("open");
        panel.classList.add("hidden");
        trigger.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("open");
        panel.classList.remove("hidden");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
