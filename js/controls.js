// управляет поиском и фильтрацией растений

// инициализация контролов

export function initControls(getPlants, onChange) {
  const searchInput = document.querySelector(".search");
  const filterBtn = document.getElementById("filterBtn");
  const filterMenu = document.getElementById("filterMenu");

  let currentSearch = "";
  let currentFilter = "all";

  // открыть/закрыть dropdown

  filterBtn.addEventListener("click", () => {
    filterMenu.classList.toggle("dropdown__menu--active");
  });

  // поиск

  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase();
    apply();
  });

  // фильтр

  filterMenu.addEventListener("click", (e) => {
    if (!e.target.dataset.filter) return;

    currentFilter = e.target.dataset.filter;

    // подсветка выбранного
    filterMenu.querySelectorAll(".dropdown__item").forEach((item) => {
      item.classList.remove("dropdown__item--active");
    });

    e.target.classList.add("dropdown__item--active");

    // меняем текст кнопки
    filterBtn.querySelector(".filter-text").textContent = e.target.textContent;

    filterMenu.classList.remove("dropdown__menu--active");

    apply();
  });

  // применить

  function apply() {
    let result = [...getPlants()];

    // поиск

    if (currentSearch) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(currentSearch),
      );
    }

    // фильтр

    if (currentFilter === "watering") {
      result = result.filter((p) => isNeedWater(p));
    }

    if (currentFilter === "healthy") {
      result = result.filter((p) => !isNeedWater(p));
    }

    onChange(result);
  }
}

// проверка: нужно ли поливать

function isNeedWater(plant) {
  const baseDate = plant.lastWatered || plant.plantedDate;
  if (!baseDate) return true;

  const last = new Date(baseDate);
  const now = new Date();

  const diffHours = (now - last) / (1000 * 60 * 60);
  const freq = Number(plant.wateringFrequency) || 1;

  const percent = 100 - (diffHours / freq) * 100;

  return percent <= 30;
}
