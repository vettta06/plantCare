/* imports */
import { getPlants, savePlants } from "./storage.js";
import { createPlant } from "./plants.js";
import { renderPlants } from "./render.js";
import { initForm } from "./form.js";
import { initControls } from "./controls.js";
import { getLocalDateTime } from "./utils.js";
import { renderStats } from "./stats.js";
import { t, tr, lang, translateToEnglish } from "./translate.js";

const staticText = {
  home: { ru: "Главная", en: "Home" },
  stats: { ru: "Статистика", en: "Statistics" },
  about: { ru: "О проекте", en: "About" },

  plantName: { ru: "Название растения...", en: "Plant name..." },
  imageUrl: { ru: "Ссылка на изображение...", en: "Image URL..." },
  frequency: { ru: "Частота полива (часы)...", en: "Watering frequency..." },
  description: { ru: "Описание...", en: "Description..." },

  all: { ru: "Все растения", en: "All plants" },
  watering: { ru: "Требуют полива", en: "Need watering" },
  healthy: { ru: "Здоровы", en: "Healthy" },

  footer: {
    ru: "PlantCare - с заботой о ваших растениях",
    en: "PlantCare - with care for your plants",
  },

  formTitle: {
    ru: "Форма добавления растения",
    en: "Add plant form",
  },

  planted: { ru: "Дата посадки", en: "Planting date" },
  watered: { ru: "Дата последнего полива", en: "Last watered" },
  type: { ru: "Тип...", en: "Type..." },

  statsTitle: {
    ru: "Обзор вашей коллекции",
    en: "Overview of your collection",
  },

  total: { ru: "всего", en: "total" },
  needWater: { ru: "нужно полить", en: "need watering" },

  plantTypes: { ru: "Типы растений", en: "Plant types" },
  waterNeeds: { ru: "Потребность в воде", en: "Water needs" },

  leafy: { ru: "Лиственные", en: "Leafy" },
  flowering: { ru: "Цветущие", en: "Flowering" },
  succulents: { ru: "Суккуленты", en: "Succulents" },

  allGood: { ru: "Все хорошо", en: "All good" },
  attention: { ru: "Внимание", en: "Attention" },
  critical: { ru: "Критично", en: "Critical" },

  aboutTitle: {
    ru: "О приложении PlantCare",
    en: "About PlantCare",
  },

  aboutText: {
    ru: "Веб-приложение для отслеживания расписания ухода за комнатными растениями. Разработано в рамках курсового проекта для автоматизации напоминаний о поливе растений и визуализации статистики.",
    en: "Web application for tracking indoor plant care schedules. Developed as a course project to automate watering reminders and visualize statistics.",
  },

  developer: {
    ru: "Разработчик:",
    en: "Developer:",
  },
};

/* применяем переводы */
document.querySelectorAll("[data-i18n]").forEach((el) => {
  const key = el.dataset.i18n;
  if (staticText[key]) {
    el.textContent = staticText[key][lang];
  }
});

document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
  const key = el.dataset.i18nPlaceholder;
  if (staticText[key]) {
    el.placeholder = staticText[key][lang];
  }
});

/* ================== app ================== */

/* state */
let plants = getPlants();
let editingId = null;

/* page detection */
const isStatsPage = document.querySelector(".stats-charts");
const isMainPage = document.querySelector(".plants-grid");

/* update ui */
function updateUI(data = plants) {
  if (isMainPage) {
    renderPlants(data);
  }
}

/* init */
if (isStatsPage) {
  renderStats(plants);
}

if (isMainPage) {
  updateUI();
}

/* edit mode */
window.setEditingId = function (id) {
  editingId = id;
};

/* add / edit plant */
function handleAddPlant(data) {
  if (editingId !== null) {
    plants = plants.map((p) =>
      p.id === editingId
        ? {
            ...p,
            ...data,
            lastWatered: data.lastWatered ? data.lastWatered : p.lastWatered,
          }
        : p,
    );

    editingId = null;
  } else {
    const plant = createPlant(data);
    plants.push(plant);
  }
  savePlants(plants);
  updateUI();
}

/* card actions */
document.addEventListener("click", (e) => {
  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  const card = actionEl.closest(".plant-card");
  if (!card) return;

  const id = card.dataset.id;

  if (action === "water") {
    plants = plants.map((p) =>
      p.id === id ? { ...p, lastWatered: getLocalDateTime() } : p,
    );
  }

  if (action === "delete") {
    if (!confirm(tr(t.buttons.delete))) return;
    plants = plants.filter((p) => p.id !== id);
  }

  if (action === "edit") {
    const plant = plants.find((p) => p.id === id);
    window.fillFormForEdit(plant);
    editingId = id;
    return;
  }

  if (action === "more") {
    const plant = plants.find((p) => p.id === id);
    window.openDescModal(plant.name, plant.description);
    return;
  }

  savePlants(plants);
  updateUI();
});

/* burger */
const burger = document.querySelector(".burger");
const menu = document.getElementById("mobileMenu");
const overlay = document.querySelector(".mobile-menu__overlay");
const closeBtn = document.querySelector(".mobile-menu__close");

if (burger && menu && overlay) {
  burger.addEventListener("click", () => {
    menu.classList.add("mobile-menu--active");
    overlay.classList.add("mobile-menu__overlay--active");
  });
}

if (closeBtn && menu && overlay) {
  closeBtn.addEventListener("click", () => {
    menu.classList.remove("mobile-menu--active");
    overlay.classList.remove("mobile-menu__overlay--active");
  });
}

if (overlay && menu) {
  overlay.addEventListener("click", () => {
    menu.classList.remove("mobile-menu--active");
    overlay.classList.remove("mobile-menu__overlay--active");
  });
}

/* modal */
const fab = document.getElementById("fabAdd");
const modal = document.getElementById("addPlantModal");
const modalOverlay = document.querySelector(".modal__overlay");

if (fab && modal) {
  fab.addEventListener("click", () => {
    modal.classList.add("modal--active");
  });
}

const openBtn = document.getElementById("openModalBtn");

if (openBtn && modal) {
  openBtn.addEventListener("click", () => {
    modal.classList.add("modal--active");
  });
}

if (modalOverlay && modal) {
  modalOverlay.addEventListener("click", () => {
    modal.classList.remove("modal--active");
  });
}

/* init form */
const formExists = document.querySelector("form");

if (formExists) {
  initForm(handleAddPlant);
  initControls(() => plants, updateUI);
}

const nameInput = document.querySelector('input[name="name"]');
const hint = document.getElementById("translatedHint");

if (nameInput && hint) {
  let timeout;

  nameInput.addEventListener("input", () => {
    clearTimeout(timeout);

    const value = nameInput.value;

    timeout = setTimeout(async () => {
      if (!value.trim()) {
        hint.textContent = "";
        return;
      }

      try {
        const translated = await translateToEnglish(value);

        if (translated.toLowerCase() !== value.toLowerCase()) {
          hint.textContent = `→ ${translated}`;
        } else {
          hint.textContent = "";
        }
      } catch (e) {
        hint.textContent = "";
      }
    }, 400);
  });
}

const themeBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
      // светлая тема
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      if (themeIcon) themeIcon.src = "img/moon.svg";
    } else {
      // тёмная тема
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      if (themeIcon) themeIcon.src = "img/sun.svg";
    }
  });
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  const icon = document.getElementById("themeIcon");
  if (icon) icon.src = "img/sun.svg";
} else {
  const icon = document.getElementById("themeIcon");
  if (icon) icon.src = "img/moon.svg";
}

// модалка для описания карточки
const descModal = document.getElementById("descModal");
const descText = document.getElementById("descText");
const descTitle = document.getElementById("descTitle");
const closeDescBtn = document.getElementById("closeDescModal");

function openDescModal(title, text) {
  descTitle.textContent = title;
  descText.textContent = text;
  descModal.classList.add("modal--active");
}
window.openDescModal = openDescModal;

function closeDescModal() {
  descModal.classList.remove("modal--active");
}

closeDescBtn.addEventListener("click", closeDescModal);

// закрытие по клику вне окна
descModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal__overlay")) {
    closeDescModal();
  }
});
