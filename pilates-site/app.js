const btnTop = document.getElementById("btnTop");
const navLinks = document.querySelectorAll(".nav__link");
const landingPhotos = document.querySelectorAll("[data-enter]");

if (btnTop) {
  btnTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

landingPhotos.forEach((photo) => {
  photo.addEventListener("click", () => {
    document.body.classList.remove("is-landing");
    const target = document.querySelector("#etc");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const hash = link.getAttribute("href");
    if (!hash || !hash.startsWith("#")) return;

    if (document.body.classList.contains("is-landing")) {
      e.preventDefault();
      document.body.classList.remove("is-landing");
      requestAnimationFrame(() => {
        const target = document.querySelector(hash);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    }
  });
});

if (window.location.hash && window.location.hash !== "#top" && window.location.hash !== "#about") {
  document.body.classList.remove("is-landing");
}
