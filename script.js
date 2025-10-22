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
  // ===== KONTAKT-FORMULAR (Formspree) =====
const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const formStatus = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Client-Validation
    if (!form.checkValidity()) {
      formStatus.textContent = "Bitte prüfe deine Eingaben.";
      return;
    }

    sendBtn.disabled = true;
    formStatus.textContent = "Sende …";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });

      if (res.ok) {
        form.reset();
        formStatus.textContent = "Danke! Deine Nachricht ist angekommen. ✨";
      } else {
        formStatus.textContent = "Ups – senden fehlgeschlagen. Versuch’s später nochmal.";
      }
    } catch (err) {
      formStatus.textContent = "Netzwerkfehler – bitte später erneut probieren.";
    } finally {
      sendBtn.disabled = false;
    }
  });
}
// ===== Simple Carousel =====
const carousels = document.querySelectorAll(".carousel");
carousels.forEach((c) => {
  const slides = c.querySelector(".slides");
  const imgs = [...c.querySelectorAll("img")];
  const prev = c.querySelector(".prev");
  const next = c.querySelector(".next");
  const dotsWrap = c.querySelector(".dots");
  let i = 0, auto;

  imgs.forEach((_, idx) => {
    const b = document.createElement("button");
    b.addEventListener("click", () => go(idx));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];

  function render() {
    slides.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  }
  function go(n) { i = (n + imgs.length) % imgs.length; render(); }
  function nextImg() { go(i + 1); }
  function prevImg() { go(i - 1); }

  next.addEventListener("click", nextImg);
  prev.addEventListener("click", prevImg);

  // Auto-Play (Pause bei Hover)
  function start() { auto = setInterval(nextImg, 3500); }
  function stop()  { clearInterval(auto); }
  c.addEventListener("mouseenter", stop);
  c.addEventListener("mouseleave", start);

  render(); start();
});
/* ===== Typing Intro ===== */
const intro = document.getElementById("intro");
if (intro) {
  const l1 = intro.dataset.line1 || "";
  const l2 = intro.dataset.line2 || "";

  // Platz für zwei Zeilen anlegen
  const s1 = document.createElement("span");
  const br = document.createElement("br");
  const s2 = document.createElement("span");
  intro.append(s1, br, s2);

  intro.classList.add("typing");

  // Tippen
  const speed = 28; // ms pro Zeichen (langsamer/schneller: Wert anpassen)

  function type(node, text) {
    return new Promise((resolve) => {
      let i = 0;
      const t = setInterval(() => {
        node.textContent += text[i++];
        if (i >= text.length) { clearInterval(t); resolve(); }
      }, speed);
    });
  }

  (async () => {
    await type(s1, l1);           // Zeile 1 tippen
    await new Promise(r => setTimeout(r, 250)); 
    await type(s2, " " + l2);     // Zeile 2 tippen
    intro.classList.remove("typing");
    intro.classList.add("done");
  })();
}

});
