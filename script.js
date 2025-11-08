// === ПЛАВНАЯ ПРОКРУТКА ===
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 70, behavior: "smooth" });
    }
  });
});

// === СМЕНА ЯЗЫКА ===
const select = document.getElementById("languageSwitcher");
const userLang = localStorage.getItem("lang") || navigator.language.slice(0, 2) || "ru";

const availableLangs = ["ru", "en", "kk"];
const lang = availableLangs.includes(userLang) ? userLang : "ru";

select.value = lang;
loadLang(lang);

select.addEventListener("change", e => {
  const chosenLang = e.target.value;
  localStorage.setItem("lang", chosenLang);
  loadLang(chosenLang);
});

function loadLang(lang) {
  fetch(`./locales/${lang}.json`)
    .then(res => res.json())
    .then(data => applyLang(data))
    .catch(() => console.error("Ошибка загрузки языка:", lang));
}

function applyLang(data) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const keys = el.getAttribute("data-i18n").split(".");
    let value = data;
    keys.forEach(k => (value = value ? value[k] : null));
    if (value) el.textContent = value;
  });

  // Обновляем списки навыков динамически
  updateSkills(data.skills);
}

function updateSkills(skills) {
  if (!skills) return;
  const main = document.getElementById("mainSkills");
  const tools = document.getElementById("toolsSkills");
  const extra = document.getElementById("extraSkills");

  if (main && skills.main?.items)
    main.innerHTML = skills.main.items.map(item => `<li>${item}</li>`).join("");
  if (tools && skills.tools?.items)
    tools.innerHTML = skills.tools.items.map(item => `<li>${item}</li>`).join("");
  if (extra && skills.extra?.items)
    extra.innerHTML = skills.extra.items.map(item => `<li>${item}</li>`).join("");
}
