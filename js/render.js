// отвечает за отображение карточек растений

// создать HTML карточку растения

export function createPlantCard(plant) {
  const card = document.createElement("div");
  card.classList.add("plant-card");

  card.innerHTML = `
    <div class="plant-card__image">
      <img src="${plant.image}" alt="${plant.name}" class="plant-card__img">
    </div>

    <div class="plant-card__content">
      <h3 class="plant-card__title">${plant.name}</h3>
      <p class="plant-card__desc">${plant.description || ""}</p>
      <p class="plant-card__age">Дата посадки: ${plant.plantedDate || "-"}</p>
      <p class="plant-card__watered">Последний полив: ${plant.lastWatered || "-"}</p>

      <div class="plant-card__progress">
        <div class="progress-bar">
          <div class="progress-bar__fill progress-bar__fill--green" style="width: 50%"></div>
        </div>
      </div>

      <div class="plant-card__actions">
        <button class="btn--watered">
          <img src="img/watering.svg" alt="">
          Watered
        </button>

        <button class="btn--icon">
          <img src="img/pen.svg" alt="">
        </button>

        <button class="btn--icon">
          <img src="img/trash.svg" alt="">
        </button>
      </div>
    </div>
  `;

  return card;
}

// отрисовать список растений

export function renderPlants(plants) {
  const container = document.querySelector(".plants-grid");

  container.innerHTML = "";

  plants.forEach((plant) => {
    container.appendChild(createPlantCard(plant));
  });
}
