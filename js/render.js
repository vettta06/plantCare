// отвечает за отображение карточек растений

import { t, tr } from "./translate.js";

// отрисовать список растений
export function renderPlants(plants) {
  const grid = document.querySelector(".plants-grid");
  const emptyState = document.getElementById("emptyState");

  if (!plants.length) {
    const activeFilter = document.querySelector(".dropdown__item--active")
      ?.dataset.filter;

    let message = tr(t.empty.first);

    if (activeFilter === "healthy") {
      message = tr(t.empty.healthy);
    }

    if (activeFilter === "watering") {
      message = tr(t.empty.watering);
    }

    emptyState.querySelector(".empty-state__text").textContent = message;

    emptyState.style.display = "block";
    grid.innerHTML = "";

    return;
  }

  emptyState.style.display = "none";

  grid.innerHTML = plants
    .map((p) => {
      const { percent } = getWaterProgress(p);
      const color = getProgressColor(percent);
      // обрезка опиания карточки
      const shortDesc =
        p.description.length > 120
          ? p.description.slice(0, 120) + "..."
          : p.description;
      return `
      <div class="plant-card" data-id="${p.id}">
        <div class="plant-card__image">
          <img src="${p.image}" class="plant-card__img" />
        </div>

        <div class="plant-card__content">
          <h3 class="plant-card__title">${p.name}</h3>
          <p class="plant-card__desc">${shortDesc}</p>
          <button class="btn btn--secondary more-btn" data-action="more">
            Подробнее
          </button>
          <p class="plant-card__age">${tr(t.form.planted)}: ${p.plantedDate}</p>
          <p class="plant-card__watered">
            ${tr(t.form.watered)}: ${formatDate(p.lastWatered)}
          </p>

          <div class="plant-card__progress">
            <div class="progress-bar">
              <div class="progress-bar__fill"
                style="width: ${percent}%; background-color: ${color}">
              </div>
            </div>
          </div>

          <div class="plant-card__actions">
            <button class="btn btn--watered" data-action="water">
              <img src="img/watering.svg" alt="water" />
              ${tr(t.buttons.watered)}
            </button>

            <button class="btn--icon" data-action="edit">
              <img src="img/pen.svg" alt="edit" />
            </button>

            <button class="btn--icon" data-action="delete">
              <img src="img/trash.svg" alt="delete" />
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// рассчитывает процент "сухости" растения
function getWaterProgress(plant) {
  const baseDate = plant.lastWatered || plant.plantedDate;

  if (!baseDate) return { percent: 100 };

  const last = new Date(baseDate);
  const now = new Date();

  if (isNaN(last.getTime())) return { percent: 100 };

  const diffHours = (now - last) / (1000 * 60 * 60);
  const freq = Number(plant.wateringFrequency) || 1;

  let percent = 100 - (diffHours / freq) * 100;

  percent = Math.min(100, Math.max(0, Math.round(percent)));
  const min = 5;
  const safePercent = Math.max(percent, min);

  return { percent: safePercent };
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleString();
}

function getProgressColor(percent) {
  if (percent > 60) return "var(--bar-green)";
  if (percent > 30) return "#FFDE88";
  return "#FC8181";
}
