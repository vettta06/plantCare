// содержит вспомогательные функции для работы с датами и логикой полива

// генерация уникального id

export function generateId() {
  return Date.now().toString();
}

export function getLocalDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;

  return new Date(now - offset).toISOString().slice(0, 16);
}
