const btnTop = document.getElementById("btnTop");

if (btnTop) {
  btnTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
