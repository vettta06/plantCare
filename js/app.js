// js/app.js
import { getPlants, savePlants } from "./storage.js";
import { createPlant } from "./plants.js";
import { renderPlants, renderPagination } from "./render.js";
import { initForm } from "./form.js";
import { initControls } from "./controls.js";
import { getLocalDateTime } from "./utils.js";
import { renderStats } from "./stats.js";
import { translateStaticText } from "./translate.js";
import { state, updateItemsPerPage } from "./state.js"; 


function init() {
  // 1. Переводы
  translateStaticText();

  // 2. Загрузка данных
  state.plants = getPlants();

  // 3. Настройка UI компонентов
  initTheme();
  initMobileMenu();
  initModals();

  // 4. Инициализация форм и фильтров
  if (document.querySelector("form")) {
    initForm(handleAddPlant);
    
    // Передаем коллбек обновления UI в контролы
    initControls(
      () => state.plants, 
      (filteredData) => {
        state.currentPage = 1;
        updateUI(filteredData);
      }
    );
  }

  // 5. Первый рендер
  updateItemsPerPage();
  updateUI();

  // 6. Глобальные слушатели
  setupGlobalListeners();
}

function updateUI(data = state.plants) {
  const isMainPage = document.querySelector(".plants-grid");
  const isStatsPage = document.querySelector(".stats-charts");

  if (isMainPage) {
    renderMainPage(data);
  }
  if (isStatsPage) {
    renderStats(state.plants);
  }
}

function renderMainPage(data) {
  const emptyState = document.getElementById('emptyState');
  const pagination = document.getElementById('pagination');

  if (!data.length) {
    if (emptyState) emptyState.style.display = 'block';
    if (pagination) pagination.style.display = 'none';
    renderPlants([]);
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (pagination) pagination.style.display = 'flex';

  // Пагинация
  const totalPages = Math.ceil(data.length / state.itemsPerPage) || 1;
  if (state.currentPage > totalPages) state.currentPage = 1;

  const start = (state.currentPage - 1) * state.itemsPerPage;
  const end = start + state.itemsPerPage;
  const paginatedData = data.slice(start, end);

  renderPlants(paginatedData);
  
  // Рисуем пагинацию через отдельную функцию
  renderPagination(data.length, state.currentPage, (newPage) => {
    state.currentPage = newPage;
    updateUI(data);
    document.querySelector(".plants-grid")?.scrollIntoView({ behavior: "smooth" });
  });
}

function handleAddPlant(data) {
  if (state.editingId !== null) {
    // Редактирование
    state.plants = state.plants.map(p => 
      p.id === state.editingId ? { ...p, ...data, lastWatered: data.lastWatered || p.lastWatered } : p
    );
    state.editingId = null;
  } else {
    // Создание
    const plant = createPlant(data);
    state.plants.push(plant);
  }
  savePlants(state.plants);
  updateUI();
}

function setupGlobalListeners() {
  document.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;
    const card = actionEl.closest(".plant-card");
    if (!card) return;

    const id = card.dataset.id;
    const action = actionEl.dataset.action;

    if (action === "water") {
      const plant = state.plants.find(p => p.id === id);
      if (plant) {
        plant.lastWatered = getLocalDateTime();
        savePlants(state.plants);
        updateUI();
      }
    }
    if (action === "delete") {
      if (confirm("Удалить?")) {
        state.plants = state.plants.filter(p => p.id !== id);
        savePlants(state.plants);
        updateUI();
      }
    }
    if (action === "edit") {
      const plant = state.plants.find(p => p.id === id);
      if (plant) {
        state.editingId = id;
        window.fillFormForEdit(plant);
      }
    }
    if (action === "more") {
      const plant = state.plants.find(p => p.id === id);
      if (plant) window.openDescModal(plant.name, plant.description);
    }
  });

  window.addEventListener("resize", () => {
    updateItemsPerPage();
    state.currentPage = 1;
    updateUI();
  });
}

function initTheme() {
  const themeBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (themeIcon) themeIcon.src = "img/sun.svg";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        if (themeIcon) themeIcon.src = "img/moon.svg";
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        if (themeIcon) themeIcon.src = "img/sun.svg";
      }
    });
  }
}

function initMobileMenu() {
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.querySelector(".mobile-menu__overlay");
  const closeBtn = document.querySelector(".mobile-menu__close");

  if (burger && menu) burger.addEventListener("click", () => {
    menu.classList.add("mobile-menu--active");
    overlay?.classList.add("mobile-menu__overlay--active");
  });

  if (closeBtn && menu) closeBtn.addEventListener("click", () => {
    menu.classList.remove("mobile-menu--active");
    overlay?.classList.remove("mobile-menu__overlay--active");
  });

  if (overlay && menu) overlay.addEventListener("click", () => {
    menu.classList.remove("mobile-menu--active");
    overlay.classList.remove("mobile-menu__overlay--active");
  });
}

function initModals() {
  const fab = document.getElementById("fabAdd");
  const openBtn = document.getElementById("openModalBtn");
  const modal = document.getElementById("addPlantModal");
  const modalOverlay = modal?.querySelector(".modal__overlay");
  const descModal = document.getElementById("descModal");
  const closeDescBtn = document.getElementById("closeDescModal");

  const openModal = (id) => document.getElementById(id)?.classList.add("modal--active");
  const closeModal = (id) => document.getElementById(id)?.classList.remove("modal--active");

  if (fab) fab.addEventListener("click", () => openModal("addPlantModal"));
  if (openBtn) openBtn.addEventListener("click", () => openModal("addPlantModal"));
  if (modalOverlay) modalOverlay.addEventListener("click", () => closeModal("addPlantModal"));
  
  if (closeDescBtn) closeDescBtn.addEventListener("click", () => closeModal("descModal"));
  if (descModal) {
     descModal.addEventListener("click", (e) => {
       if (e.target.classList.contains("modal__overlay")) closeModal("descModal");
     });
  }
  window.openDescModal = (title, text) => {
    document.getElementById("descTitle").textContent = title;
    document.getElementById("descText").textContent = text;
    openModal("descModal");
  };
}

// Запуск
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}