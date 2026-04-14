// обрабатывает открытие модального окна и добавление / редактирование растения

import { getLocalDateTime } from "./utils.js";

export function initForm(onSubmit) {
  const modal = document.getElementById("addPlantModal");
  const openBtn = document.querySelector(".btn--add");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("plantForm");
  const submitBtn = form.querySelector("button[type='submit']");

  const plantedInput = form.elements.plantedDate;
  const wateredInput = form.elements.lastWatered;

  // ===== helpers для ошибок =====

  function showError(input, message) {
    clearError(input);

    const error = document.createElement("div");
    error.className = "form-error";
    error.textContent = message;

    input.classList.add("input-error");
    input.after(error);
  }

  function clearError(input) {
    input.classList.remove("input-error");

    const next = input.nextElementSibling;
    if (next && next.classList.contains("form-error")) {
      next.remove();
    }
  }

  function clearAllErrors() {
    form.querySelectorAll(".form-error").forEach((e) => e.remove());
    form
      .querySelectorAll(".input-error")
      .forEach((i) => i.classList.remove("input-error"));
  }

  // открыть модалку

  openBtn.addEventListener("click", () => {
    modal.classList.add("modal--active");
    form.reset();
    clearAllErrors();

    // ✅ обновляем дату каждый раз
    const localDateTime = getLocalDateTime();
    const localDate = localDateTime.split("T")[0];

    if (plantedInput) plantedInput.max = localDate;
    if (wateredInput) wateredInput.max = localDateTime;

    submitBtn.textContent = "Добавить растение";
    window.setEditingId(null);
  });

  // ограничение: полив не раньше посадки
  plantedInput.addEventListener("change", () => {
    if (wateredInput) {
      wateredInput.min = plantedInput.value;
    }
  });

  // закрыть

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("modal--active");
  });

  // submit

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAllErrors();

    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      image: formData.get("image"),
      plantedDate: formData.get("plantedDate"),
      type: formData.get("type"),
      lastWatered: formData.get("lastWatered"),
      wateringFrequency: formData.get("wateringFrequency"),
      description: formData.get("description"),
    };

    const localDateTime = getLocalDateTime();
    const today = localDateTime.split("T")[0];

    let hasError = false;

    // посадка в будущем
    if (data.plantedDate && data.plantedDate > today) {
      showError(plantedInput, "Дата не может быть в будущем");
      hasError = true;
    }

    // полив в будущем
    if (data.lastWatered && data.lastWatered > localDateTime) {
      showError(wateredInput, "Дата не может быть в будущем");
      hasError = true;
    }

    // полив раньше посадки
    if (data.plantedDate && data.lastWatered) {
      if (data.lastWatered < data.plantedDate) {
        showError(wateredInput, "Полив раньше посадки невозможен");
        hasError = true;
      }
    }

    if (hasError) return;

    onSubmit(data);

    form.reset();
    modal.classList.remove("modal--active");

    submitBtn.textContent = "Добавить растение";
  });

  // редактирование

  window.fillFormForEdit = (plant) => {
    modal.classList.add("modal--active");
    clearAllErrors();

    const localDateTime = getLocalDateTime();
    const localDate = localDateTime.split("T")[0];

    if (plantedInput) plantedInput.max = localDate;
    if (wateredInput) wateredInput.max = localDateTime;

    form.elements.name.value = plant.name;
    form.elements.image.value = plant.image;
    form.elements.plantedDate.value = plant.plantedDate;
    form.elements.type.value = plant.type;
    form.elements.lastWatered.value = plant.lastWatered
      ? plant.lastWatered.slice(0, 16)
      : "";
    form.elements.wateringFrequency.value = plant.wateringFrequency;
    form.elements.description.value = plant.description;

    submitBtn.textContent = "Сохранить изменения";
  };
}
