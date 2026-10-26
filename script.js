// Keeps the footer year up to date automatically.
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Lightbox: click/tap a thumbnail to see it full size.
(() => {
  const dlg = document.getElementById("lightbox");
  const items = [...document.querySelectorAll(".thumb .open")];
  if (!dlg || !items.length || typeof dlg.showModal !== "function") return;

  const img = dlg.querySelector(".lb-stage img");
  const stage = dlg.querySelector(".lb-stage");
  const count = dlg.querySelector(".lb-count");
  let index = 0;
  let lastFocus = null;

  const show = (n) => {
    index = (n + items.length) % items.length;
    const src = items[index].querySelector("img");
    img.src = src.src;
    img.alt = src.alt;
    count.textContent = (index + 1) + " / " + items.length;
  };

  const open = (n) => {
    lastFocus = document.activeElement;
    show(n);
    if (!dlg.open) dlg.showModal();
    document.body.classList.add("lb-open");
  };

  items.forEach((btn, n) => btn.addEventListener("click", () => open(n)));

  dlg.querySelector(".lb-close").addEventListener("click", () => dlg.close());
  dlg.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  dlg.querySelector(".lb-next").addEventListener("click", () => show(index + 1));

  // Click outside the image (on the dark area) closes the viewer.
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target === stage) dlg.close();
  });

  // Esc is handled natively by <dialog>; arrows added here.
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Swipe left/right on touch devices.
  let startX = null;
  stage.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  });

  dlg.addEventListener("close", () => {
    document.body.classList.remove("lb-open");
    img.src = "";
    if (lastFocus) lastFocus.focus();
  });
})();
