// обрабатывает открытие модального окна и добавление

import { getLocalDateTime } from "./utils.js";
import { t, tr, translateToEnglish, lang, translateToRussian } from "./translate.js";

export function initForm(onSubmit) {
  const modal = document.getElementById("addPlantModal");
  const overlay = modal.querySelector(".modal__overlay");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("plantForm");
  const nameInput = form.elements.name;
  const imageInput = form.elements.image;
  const fetchBtn = document.getElementById("fetchPlantBtn");

  fetchBtn.addEventListener("click", async () => {
    let name = nameInput.value.trim();
    if (!name) return;
    const translated = await translateToEnglish(name);
    const searchName = translated || name;
    const plant = await fetchPlantData(searchName);

    if (!plant) {
      alert("Растение не найдено (пиши на английском)");
      return;
    }

    // описание
    let description = plant.description || "No description";

    if (lang === "ru") {
      try {
        const translated = await translateToRussian(description);
        description = translated || description;
      } catch (e) {
        console.error("Ошибка перевода", e);
      }
    }

    form.elements.description.value = description;

    // частота полива
    const wf = plant.wateringBenchmark;
    const wfInput = form.querySelector('[name="wateringFrequency"]');

    if (wf?.value) {
      const match = wf.value.match(/\d+/);
      if (match) {
        const days = Number(match[0]);
        const hours = days * 24;
        wfInput.value = hours;
      } else {
        wfInput.value = "";
      }
    } else if (plant.watering) {
      const map = {
        frequent: 48,
        average: 120,
        minimum: 240,
      };
      const key = plant.watering.toLowerCase();
      wfInput.value = map[key] || "";
    } else {
      wfInput.value = "";
    }
  });

  function closeModal() {
    modal.classList.remove("modal--active");
    form.reset();
    clearAllErrors();
    currentImage = null;
  }

  closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  let currentImage = null;
  const submitBtn = form.querySelector("button[type='submit']");

  const plantedInput = form.elements.plantedDate;
  const wateredInput = form.elements.lastWatered;

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

  // ограничение: полив не раньше посадки
  plantedInput.addEventListener("change", () => {
    if (wateredInput) {
      wateredInput.min = plantedInput.value;
    }
  });

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      currentImage = reader.result;
    };
    reader.readAsDataURL(file);
  });

  // закрыть
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("modal--active");
    form.reset();
    clearAllErrors();
  });

  // submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAllErrors();

    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      image: currentImage,
      plantedDate: formData.get("plantedDate"),
      type: formData.get("type"),
      lastWatered: formData.get("lastWatered"),
      wateringFrequency: formData.get("wateringFrequency"),
      description: formData.get("description"),
    };

    const localDateTime = getLocalDateTime();
    const today = localDateTime.split("T")[0];
    let hasError = false;

    if (data.plantedDate && data.plantedDate > today) {
      showError(plantedInput, "Дата не может быть в будущем");
      hasError = true;
    }

    if (data.lastWatered && data.lastWatered > localDateTime) {
      showError(wateredInput, "Дата не может быть в будущем");
      hasError = true;
    }

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
    submitBtn.textContent = tr(t.buttons.add);
  });

  // редактирование
  window.fillFormForEdit = (plant) => {
    document.getElementById("formTitle").textContent =
      "Редактирование растения";
    modal.classList.add("modal--active");
    clearAllErrors();
    const localDateTime = getLocalDateTime();
    const localDate = localDateTime.split("T")[0];
    if (plantedInput) plantedInput.max = localDate;
    if (wateredInput) wateredInput.max = localDateTime;
    form.elements.name.value = plant.name;
    form.elements.plantedDate.value = plant.plantedDate;
    form.elements.type.value = plant.type;
    form.elements.lastWatered.value = plant.lastWatered
      ? plant.lastWatered.slice(0, 16)
      : "";
    form.elements.wateringFrequency.value = plant.wateringFrequency;
    form.elements.description.value = plant.description;
    currentImage = plant.image;
    submitBtn.textContent = tr(t.buttons.save);
  };
}

async function fetchPlantData(name) {
  try {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const res = await fetch(
      `https://perenual.com/api/v2/species-list?key=${API_KEY}&q=${name}`,
    );
    const data = await res.json();
    const plant = data.data?.[0];
    if (!plant) return null;
    const detailsRes = await fetch(
      `https://perenual.com/api/v2/species/details/${plant.id}?key=${API_KEY}`,
    );
    const details = await detailsRes.json();
    return {
      name: plant.common_name,
      description: details.description,
      watering: details.watering,
      wateringBenchmark: details.watering_general_benchmark,
    };
  } catch (e) {
    console.error("Ошибка API", e);
    return null;
  }
}
