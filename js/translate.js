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
    first: { ru: "Добавьте первое растение", en: "Add your first plant" },
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

// helper
export function tr(obj) {
  return obj[lang];
}
