// сохраняет и загружает список растений из localStorage

// Ключ для хранения растений

const KEY = "plants";

//  Получить все растения из localStorage

export function getPlants() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

//  Сохранить растения в localStorage

export function savePlants(plants) {
  localStorage.setItem(KEY, JSON.stringify(plants));
}
