// js/state.js
export const state = {
  plants: [],
  currentPage: 1,
  itemsPerPage: 9,
  editingId: null,
  filter: 'all',
  searchQuery: ''
};

// Хелпер для обновления itemsPerPage в зависимости от экрана
export function updateItemsPerPage() {
  const width = window.innerWidth;
  if (width < 768) state.itemsPerPage = 4;
  else if (width < 1024) state.itemsPerPage = 6;
  else state.itemsPerPage = 9;
}