document.documentElement.classList.add("js");
if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("lazy-backgrounds");
}

// Инициализация после загрузки структуры страницы.
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Fetch decorative backgrounds shortly before they enter the viewport.
  if ("IntersectionObserver" in window) {
    const backgroundObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("background-ready");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "300px 0px" });
    document.querySelectorAll(".story-visual, .interlude").forEach(element => {
      backgroundObserver.observe(element);
    });
  }

  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const year = document.getElementById("current-year");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const backToTop = document.getElementById("back-to-top");

  // Актуальный год в футере.
  year.textContent = String(new Date().getFullYear());

  // Компактная мобильная навигация.
  function setMenu(open) {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    navLinks.classList.toggle("is-open", open);
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      menuToggle.getAttribute("aria-expanded") === "true" &&
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      setMenu(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) setMenu(false);
  });

  // Верхняя панель и кнопка возврата к началу страницы.
  function updateScrollState() {
    header.classList.toggle("scrolled", window.scrollY > 24);
    backToTop.hidden = window.scrollY <= 300;
  }

  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("pageshow", updateScrollState);

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "instant" : "smooth" });
  });

  // Доступный FAQ-аккордеон: кнопки работают с клавиатуры и касанием.
  const faqButtons = Array.from(document.querySelectorAll(".faq-question"));

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const willOpen = button.getAttribute("aria-expanded") !== "true";

      faqButtons.forEach((otherButton) => {
        const panelId = otherButton.getAttribute("aria-controls");
        const panel = document.getElementById(panelId);
        const isCurrent = otherButton === button;

        otherButton.setAttribute(
          "aria-expanded",
          String(isCurrent ? willOpen : false)
        );

        panel.hidden = !(isCurrent && willOpen);
      });
    });
  });

  // Плавное появление блоков при прокрутке.
  // При отключённом IntersectionObserver или reduced motion
  // контент остаётся видимым и полностью доступным.
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  // Резервное оформление при недоступности внешних изображений.
  // Удаление сломанного img сохраняет градиентный фон родительского блока.
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.remove();
    }, { once: true });
  });
}, { once: true });
