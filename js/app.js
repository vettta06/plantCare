// управляет состоянием приложения

import { getPlants, savePlants } from "./storage.js";
import { createPlant } from "./plants.js";
import { renderPlants } from "./render.js";
import { initForm } from "./form.js";
import { initControls } from "./controls.js";

let plants = getPlants();

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
    plants = plants.map((p) => (p.id === editingId ? { ...p, ...data } : p));

    editingId = null;
  } else {
    // ➕ обычное добавление
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
      p.id === id
        ? { ...p, lastWatered: new Date().toISOString().slice(0, 10) }
        : p,
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

// форма

initForm(handleAddPlant);

// контролы

initControls(() => plants, updateUI);

// старт

updateUI();
