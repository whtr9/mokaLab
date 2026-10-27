import { MOKA_SIZES } from './data.js';
import { state, resetState } from './state.js';
import { renderDrinkSelector, renderMokaSizeButtons, syncSlidersToSize, updateUI } from './ui.js';
import * as storage from './storage.js';
import { initPWA } from './pwa.js';

function selectDrink(drinkId) {
  state.drinkId = drinkId;
  renderDrinkSelector();
  updateUI();
}

function selectMokaSize(cups) {
  state.mokaSize = cups;
  const sizeObj = MOKA_SIZES[cups];
  state.coffeeG = sizeObj.defaultCoffeeG;
  state.waterMl = sizeObj.defaultWaterMl;
  state.lockedRatioValue = state.waterMl / state.coffeeG;
  renderMokaSizeButtons();
  syncSlidersToSize(cups);
  updateUI();
}

function toggleRatioLock() {
  state.ratioLocked = !state.ratioLocked;
  state.lockedRatioValue = state.waterMl / state.coffeeG;
  const btn = document.getElementById('lock-ratio-btn');
  if (state.ratioLocked) {
    btn.textContent = `🔒 Ratio 1:${state.lockedRatioValue.toFixed(1)}`;
    btn.className = 'text-xs font-bold px-3 py-1 rounded-full bg-sky-600 text-white border border-sky-700 shadow-sm transition';
  } else {
    btn.textContent = '🔓 Ratio свободно';
    btn.className = 'text-xs font-bold px-3 py-1 rounded-full bg-white/85 border border-sky-300 text-sky-800 shadow-sm hover:bg-sky-50 transition';
  }
}

function handleCoffeeSlider(val) {
  state.coffeeG = parseFloat(val);
  if (state.ratioLocked) {
    state.waterMl = Math.round(state.coffeeG * state.lockedRatioValue);
  }
  updateUI();
}

function handleManualCoffeeInput(val) {
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return;
  state.coffeeG = num;
  if (state.ratioLocked) {
    state.waterMl = Math.round(state.coffeeG * state.lockedRatioValue);
  }
  updateUI();
}

function handleWaterSlider(val) {
  state.waterMl = parseInt(val, 10);
  if (state.ratioLocked) {
    state.coffeeG = parseFloat((state.waterMl / state.lockedRatioValue).toFixed(1));
  }
  updateUI();
}

function handleManualWaterInput(val) {
  const num = parseInt(val, 10);
  if (isNaN(num) || num <= 0) return;
  state.waterMl = num;
  if (state.ratioLocked) {
    state.coffeeG = parseFloat((state.waterMl / state.lockedRatioValue).toFixed(1));
  }
  updateUI();
}

function handleGrinderChange(val) {
  state.grinderId = val;
  updateUI();
}

function handleRoastChange(val) {
  state.roastId = val;
  updateUI();
}

function togglePaperFilter(checked) {
  state.usePaperFilter = checked;
  updateUI();
}

function resetToDefaultStandard() {
  resetState();
  document.getElementById('paper-filter-checkbox').checked = false;
  renderDrinkSelector();
  renderMokaSizeButtons();
  syncSlidersToSize(2);
  updateUI();
}

function init() {
  renderDrinkSelector();
  renderMokaSizeButtons();
  syncSlidersToSize(state.mokaSize);
  updateUI();
  storage.renderSavedPresetsBar();
  initPWA();
}

// Привязка функций к глобальному объекту window для работы HTML-атрибутов onclick/oninput
Object.assign(window, {
  selectDrink,
  selectMokaSize,
  toggleRatioLock,
  handleCoffeeSlider,
  handleManualCoffeeInput,
  handleWaterSlider,
  handleManualWaterInput,
  handleGrinderChange,
  handleRoastChange,
  togglePaperFilter,
  resetToDefaultStandard,
  openSavePresetModal: storage.openSavePresetModal,
  closeSavePresetModal: storage.closeSavePresetModal,
  confirmSavePreset: storage.confirmSavePreset,
  loadPreset: storage.loadPreset,
  deletePreset: storage.deletePreset,
  openJsonModal: storage.openJsonModal,
  closeJsonModal: storage.closeJsonModal,
  copyJsonToClipboard: storage.copyJsonToClipboard,
  importJsonConfig: storage.importJsonConfig
});

window.addEventListener('DOMContentLoaded', init);
