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