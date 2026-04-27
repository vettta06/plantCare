// отвечает за отображение карточек растений

import { t, tr } from "./translate.js";
import { state } from "./state.js"; 

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
          <img 
            src="${p.image || "img/default-plant.png"}" 
            class="plant-card__img"
            onerror="this.onerror=null; this.src='img/default-plant.png';"
          />
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

document.querySelectorAll(".plant-card__img").forEach((img) => {
  img.onerror = () => {
    img.src = "img/default-plant.png";
  };
});

export function renderPagination(totalItems, currentPage, onPageChange) {
  const paginationNumbers = document.getElementById("paginationNumbers");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!paginationNumbers) return;

  const totalPages = Math.ceil(totalItems / state.itemsPerPage) || 1;

  // Обновляем состояние кнопок
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages;

  paginationNumbers.innerHTML = "";

  // Логика генерации кнопок (твоя логика с delta)
  const delta = 1;
  const range = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  let lastItem = 0;
  range.forEach((page) => {
    if (page - lastItem > 1) {
      _appendButton(paginationNumbers, "...", null);
    }
    _appendButton(paginationNumbers, page, () => onPageChange(page));
    lastItem = page;
  });

  // Слушатели на Prev/Next
  if (prevBtn)
    prevBtn.onclick = () => currentPage > 1 && onPageChange(currentPage - 1);
  if (nextBtn)
    nextBtn.onclick = () =>
      currentPage < totalPages && onPageChange(currentPage + 1);
}

function _appendButton(container, text, onClick) {
  const btn = document.createElement("button");
  btn.classList.add("pagination__number");
  btn.innerText = text;
  if (onClick) {
    btn.addEventListener("click", onClick);
  } else {
    btn.style.cursor = "default";
    btn.style.background = "transparent";
    btn.style.pointerEvents = "none";
  }
  container.appendChild(btn);
}
