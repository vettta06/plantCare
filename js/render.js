// отвечает за отображение карточек растений

// отрисовать список растений

export function renderPlants(plants) {
  const grid = document.querySelector(".plants-grid");

  grid.innerHTML = plants
    .map((p) => {
      const { percent } = getWaterProgress(p);
      const color = getProgressColor(percent);

      return `
      <div class="plant-card" data-id="${p.id}">
        <div class="plant-card__image">
          <img src="${p.image}" class="plant-card__img" />
        </div>

        <div class="plant-card__content">
          <h3 class="plant-card__title">${p.name}</h3>
          <p class="plant-card__desc">${p.description}</p>
          <p class="plant-card__age">Дата посадки: ${p.plantedDate}</p>
          <p class="plant-card__watered">
            Последний полив: ${formatDate(p.lastWatered)}
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
              Watered
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

  return { percent };
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
