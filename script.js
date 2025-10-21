// === Warte bis DOM fertig ist, dann existieren alle Elemente ===
document.addEventListener("DOMContentLoaded", () => {
  // ===== Elemente sammeln =====
  const items    = document.querySelectorAll("li");
  const mixBtn   = document.getElementById("mixBtn");
  const resetBtn = document.getElementById("resetBtn");
  const statusEl = document.getElementById("status");
  const themeBtn = document.getElementById("themeToggle");

  // ===== Hilfsfunktionen =====
  function randomHex() {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  }
  function setStatus(text) {
    if (!statusEl) return;
    statusEl.textContent = text;
    clearTimeout(setStatus._t);
    setStatus._t = setTimeout(() => (statusEl.textContent = ""), 1400);
  }
  function isClean() {
    // "clean" = kein li hat eine gesetzte Hintergrundfarbe
    return Array.from(items).every(li => !li.style.backgroundColor);
  }
  function updateButtons() {
    if (resetBtn) resetBtn.disabled = isClean();
  }

  // ===== Hover-Effekte (optional) =====
  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const c = randomHex();
      item.style.backgroundColor = c;
      item.style.color = "white";
    });
    item.addEventListener("mouseleave", () => {
      item.style.backgroundColor = "";
      item.style.color = "";
    });
  });

  // ===== Zustand/Zähler =====
  let mixCount = 0;

  // ===== Aktionen (Buttons) =====
  function mixColors() {
    items.forEach(li => {
      li.style.backgroundColor = randomHex();
      li.style.color = "white";
    });
    mixCount++;
    setStatus(`Farben gemischt (${mixCount}×) ✨`);
    updateButtons();
  }

  function resetColors() {
    items.forEach(li => {
      li.style.backgroundColor = "";
      li.style.color = "";
    });
    // Zähler auf 0 setzen
    mixCount = 0;
    setStatus("Zurückgesetzt und Zähler auf 0 gesetzt ↩️");
    updateButtons();
  }

  // Buttons verdrahten (falls vorhanden)
  if (mixBtn) {
    mixBtn.addEventListener("click", () => {
      mixBtn.disabled = true;   // kurz gegen Doppelklicks
      mixColors();
      setTimeout(() => (mixBtn.disabled = false), 350);
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", resetColors);
  }

  // Initial
  updateButtons();

  // ===== THEME / DARK MODE =====
  // bevorzugtes Theme aus localStorage oder System übernehmen
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  const savedTheme  = localStorage.getItem("theme"); // 'dark' | 'light' | null

  function applyTheme(mode) {
    document.documentElement.classList.toggle("dark", mode === "dark"); // toggelt Klasse auf <html>
    localStorage.setItem("theme", mode);
    if (themeBtn) {
      themeBtn.textContent = mode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
  }

  // initial setzen
  applyTheme(savedTheme ?? (prefersDark ? "dark" : "light"));

  // Button oben rechts verdrahten
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("dark");
      applyTheme(isDark ? "light" : "dark");
    });
  }
});
