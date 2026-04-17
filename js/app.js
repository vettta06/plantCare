/* imports */
import { getPlants, savePlants } from "./storage.js";
import { createPlant } from "./plants.js";
import { renderPlants } from "./render.js";
import { initForm } from "./form.js";
import { initControls } from "./controls.js";
import { getLocalDateTime } from "./utils.js";
import { renderStats } from "./stats.js";

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
    if (!confirm("Удалить растение?")) return;
    plants = plants.filter((p) => p.id !== id);
  }

  if (action === "edit") {
    const plant = plants.find((p) => p.id === id);
    window.fillFormForEdit(plant);
    editingId = id;
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
