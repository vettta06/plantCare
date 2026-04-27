export const lang =
  localStorage.getItem("lang") ||
  (navigator.language.startsWith("ru") ? "ru" : "en");

export const t = {
  nav: {
    home: { ru: "Главная", en: "Home" },
    stats: { ru: "Статистика", en: "Statistics" },
    about: { ru: "О проекте", en: "About" },
  },

  empty: {
    first: { ru: "Растений пока нет", en: "No plants now" },
    healthy: {
      ru: "Нет здоровых растений. Полейте растения!",
      en: "No healthy plants. Please water your plants!",
    },
    watering: {
      ru: "Все растения политы",
      en: "Everything is watered",
    },
  },

  buttons: {
    add: { ru: "Добавить растение", en: "Add plant" },
    save: { ru: "Сохранить изменения", en: "Save changes" },
    watered: { ru: "Полить", en: "Watered" },
    delete: { ru: "Удалить растение?", en: "Delete plant?" },
  },

  form: {
    planted: { ru: "Дата посадки", en: "Planting date" },
    watered: { ru: "Дата последнего полива", en: "Last watered" },
  },
};

const staticText = {
  home: { ru: "Главная", en: "Home" },
  stats: { ru: "Статистика", en: "Statistics" },
  plantName: { ru: "Название растения...", en: "Plant name..." },
  imageUrl: { ru: "Ссылка на изображение...", en: "Image URL..." },
  frequency: { ru: "Частота полива (часы)...", en: "Watering frequency..." },
  description: { ru: "Описание...", en: "Description..." },
  all: { ru: "Все растения", en: "All plants" },
  watering: { ru: "Требуют полива", en: "Need watering" },
  healthy: { ru: "Здоровы", en: "Healthy" },
  footer: { ru: "PlantCare - с заботой о ваших растениях", en: "PlantCare - with care for your plants" },
  formTitle: { ru: "Форма добавления растения", en: "Add plant form" },
  planted: { ru: "Дата посадки", en: "Planting date" },
  watered: { ru: "Дата последнего полива", en: "Last watered" },
  type: { ru: "Тип...", en: "Type..." },
  statsTitle: { ru: "Обзор вашей коллекции", en: "Overview of your collection" },
  total: { ru: "всего", en: "total" },
  needWater: { ru: "нужно полить", en: "need watering" },
  plantTypes: { ru: "Типы растений", en: "Plant types" },
  waterNeeds: { ru: "Потребность в воде", en: "Water needs" },
  leafy: { ru: "Лиственные", en: "Leafy" },
  flowering: { ru: "Цветущие", en: "Flowering" },
  succulents: { ru: "Суккуленты", en: "Succulents" },
  allGood: { ru: "Все хорошо", en: "All good" },
  attention: { ru: "Приемлемо", en: "Attention" },
  critical: { ru: "Критично", en: "Critical" },
  developer: { ru: "Разработчик:", en: "Developer:" },
};

export function translateStaticText() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (staticText[key]) {
      el.textContent = staticText[key][lang];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (staticText[key]) {
      el.placeholder = staticText[key][lang];
    }
  });
}

// helper
export function tr(obj) {
  return obj[lang];
}

//перевод
export async function translateToEnglish(text) {
  if (!text.trim()) return "";

  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`,
  );

  const data = await res.json();
  return data[0][0][0];
}

export async function translateToRussian(text) {
  if (!text.trim()) return "";
  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ru&dt=t&q=${encodeURIComponent(text)}`
  );
  const data = await res.json();
  return data[0].map((item) => item[0]).join("");
}