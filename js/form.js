// обрабатывает открытие модального окна и добавление нового растения

// инициализация формы

export function initForm(onSubmit) {
  const modal = document.getElementById("addPlantModal");
  const openBtn = document.querySelector(".btn--add");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("plantForm");

  // открыть модалку

  openBtn.addEventListener("click", () => {
    modal.classList.add("modal--active");
  });

  // закрыть модалку

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("modal--active");
  });

  // отправка формы

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input, select, textarea");

    const data = {
      name: inputs[0].value,
      image: inputs[1].value,
      plantedDate: inputs[2].value,
      type: inputs[3].value,
      lastWatered: inputs[4].value,
      wateringFrequency: inputs[5].value,
      description: inputs[6].value,
    };

    onSubmit(data);

    form.reset();
    modal.classList.remove("modal--active");
  });
}
