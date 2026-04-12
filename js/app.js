// управляет состоянием приложения

import { getPlants, savePlants } from "./storage.js";
import { createPlant } from "./plants.js";
import { renderPlants } from "./render.js";
import { initForm } from "./form.js";

let plants = getPlants();

// обновить интерфейс

function updateUI() {
  renderPlants(plants);
}

// добавление растения

function handleAddPlant(data) {
  const plant = createPlant(data);

  plants.push(plant);
  savePlants(plants);

  updateUI();
}

// инициализация формы

initForm(handleAddPlant);

// старт

updateUI();
