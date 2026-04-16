// управляет состоянием приложения

import { getPlants, savePlants } from "./storage.js";
import { createPlant } from "./plants.js";
import { renderPlants } from "./render.js";
import { initForm } from "./form.js";
import { initControls } from "./controls.js";
import { getLocalDateTime } from "./utils.js";

let plants = getPlants();
const overlay = document.querySelector(".mobile-menu__overlay");

// режим редактирования
let editingId = null;

window.setEditingId = function (id) {
  editingId = id;
};

// обновить UI

function updateUI(data = plants) {
  renderPlants(data);
}

// добавление или редактирование растения

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
    // обычное добавление
    const plant = createPlant(data);
    plants.push(plant);
  }

  savePlants(plants);
  updateUI();
}

// обработка кликов по карточкам

document.addEventListener("click", (e) => {
  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) return;

  const action = actionEl.dataset.action;

  const card = actionEl.closest(".plant-card");
  if (!card) return;

  const id = card.dataset.id;

  // полив
  if (action === "water") {
    plants = plants.map((p) =>
      p.id === id ? { ...p, lastWatered: getLocalDateTime() } : p,
    );
  }

  // удаление
  if (action === "delete") {
    const confirmDelete = confirm("Удалить растение?");
    if (!confirmDelete) return;

    plants = plants.filter((p) => p.id !== id);
  }

  // редактирование
  if (action === "edit") {
    const plant = plants.find((p) => p.id === id);

    window.fillFormForEdit(plant);
    editingId = id;

    return;
  }

  savePlants(plants);
  updateUI();
});

const burger = document.querySelector(".burger");
const menu = document.getElementById("mobileMenu");

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

// кнопка +
const fab = document.getElementById("fabAdd");
const modal = document.getElementById("addPlantModal");

if (fab && modal) {
  fab.addEventListener("click", () => {
    modal.classList.add("modal--active");
  });
}

if (overlay && menu) {
  overlay.addEventListener("click", () => {
    menu.classList.remove("mobile-menu--active");
    overlay.classList.remove("mobile-menu__overlay--active");
  });
}

const modalOverlay = document.querySelector(".modal__overlay");

if (modalOverlay && modal) {
  modalOverlay.addEventListener("click", () => {
    modal.classList.remove("modal--active");
  });
}

// форма

initForm(handleAddPlant);

// контролы

initControls(() => plants, updateUI);

// старт

updateUI();
