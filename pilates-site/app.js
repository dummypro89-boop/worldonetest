const btnTop = document.getElementById("btnTop");
const navLinks = document.querySelectorAll(".nav__link");

if (btnTop) {
  btnTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const hash = link.getAttribute("href");
    if (!hash || !hash.startsWith("#")) return;
    e.preventDefault();

    if (hash === "#about") {
      document.body.classList.add("is-landing");
      const target = document.querySelector("#about");
      if (target) target.scrollIntoView({ behavior: "smooth" });
      return;
    }

    document.body.classList.remove("is-landing");
    requestAnimationFrame(() => {
      const target = document.querySelector(hash);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
});

if (window.location.hash && window.location.hash !== "#top" && window.location.hash !== "#about") {
  document.body.classList.remove("is-landing");
}
