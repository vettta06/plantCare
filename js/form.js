// обрабатывает открытие модального окна и добавление / редактирование растения

export function initForm(onSubmit) {
  const modal = document.getElementById("addPlantModal");
  const openBtn = document.querySelector(".btn--add");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("plantForm");
  const submitBtn = form.querySelector("button[type='submit']");

  // открыть модалку (режим ДОБАВЛЕНИЯ)

  openBtn.addEventListener("click", () => {
    modal.classList.add("modal--active");
    form.reset();

    submitBtn.textContent = "Добавить растение";

    // сбрасываем режим редактирования
    window.setEditingId(null);
  });

  // закрыть модалку

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("modal--active");
  });

  // отправка формы

  form.addEventListener("submit", (e) => {
    e.preventDefault();

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

    onSubmit(data);

    form.reset();
    modal.classList.remove("modal--active");

    submitBtn.textContent = "Добавить растение";
  });

  window.fillFormForEdit = (plant) => {
    modal.classList.add("modal--active");

    form.elements.name.value = plant.name;
    form.elements.image.value = plant.image;
    form.elements.plantedDate.value = plant.plantedDate;
    form.elements.type.value = plant.type;
    form.elements.lastWatered.value = plant.lastWatered;
    form.elements.wateringFrequency.value = plant.wateringFrequency;
    form.elements.description.value = plant.description;

    submitBtn.textContent = "Сохранить изменения";
  };
}
