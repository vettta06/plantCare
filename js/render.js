// отвечает за отображение карточек растений

// отрисовать список растений

export function renderPlants(plants) {
  const grid = document.querySelector(".plants-grid");

  grid.innerHTML = plants
    .map(
      (p) => `
      <div class="plant-card" data-id="${p.id}">
        <div class="plant-card__image">
          <img src="${p.image}" class="plant-card__img" />
        </div>

        <div class="plant-card__content">
          <h3 class="plant-card__title">${p.name}</h3>
          <p class="plant-card__desc">${p.description}</p>
          <p class="plant-card__age">Дата посадки: ${p.plantedDate}</p>
          <p class="plant-card__watered">Последний полив: ${p.lastWatered}</p>
          <div class="plant-card__progress">
            <div class="progress-bar">
                <div class="progress-bar__fill progress-bar__fill--green" style="width: 50%"></div>
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
    `,
    )
    .join("");
}
