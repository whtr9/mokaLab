import { MOKA_SIZES } from './data.js';
import { state, updateState } from './state.js';
import { renderDrinkSelector, renderMokaSizeButtons, syncSlidersToSize, updateUI } from './ui.js';

const STORAGE_KEY = 'mokalab_aero_presets';

export function getSavedPresets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function openSavePresetModal() {
  document.getElementById('save-modal').classList.remove('hidden');
  document.getElementById('save-modal').classList.add('flex');
}

export function closeSavePresetModal() {
  document.getElementById('save-modal').classList.add('hidden');
  document.getElementById('save-modal').classList.remove('flex');
}

export function confirmSavePreset() {
  const nameInput = document.getElementById('preset-name-input');
  const name = nameInput.value.trim() || `Рецепт ${state.coffeeG}г / ${state.waterMl}мл`;
  const presets = getSavedPresets();
  presets.push({ ...state, name, id: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  nameInput.value = '';
  closeSavePresetModal();
  renderSavedPresetsBar();
}

export function loadPreset(id) {
  const presets = getSavedPresets();
  const found = presets.find(p => p.id === id);
  if (!found) return;
  updateState(found);
  document.getElementById('paper-filter-checkbox').checked = !!state.usePaperFilter;
  renderDrinkSelector();
  renderMokaSizeButtons();
  syncSlidersToSize(state.mokaSize);
  updateUI();
}

export function deletePreset(id) {
  const presets = getSavedPresets().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  renderSavedPresetsBar();
}

export function renderSavedPresetsBar() {
  const bar = document.getElementById('saved-presets-bar');
  const presets = getSavedPresets();
  if (!presets.length) {
    bar.classList.add('hidden');
    return;
  }
  bar.classList.remove('hidden');
  bar.innerHTML = `
    <div class="brutal-card px-4 py-2.5 flex items-center gap-2 flex-wrap">
      <span class="text-xs font-bold text-[#4a6b82]">Мои рецепты:</span>
      ${presets.map(p => `
        <div class="inline-flex items-center bg-white/75 border border-sky-200 rounded-full px-3 py-1 text-xs font-semibold text-sky-900 shadow-sm gap-2">
          <button onclick="loadPreset(${p.id})" class="hover:text-sky-600">${p.name}</button>
          <button onclick="deletePreset(${p.id})" class="text-slate-400 hover:text-red-600 font-bold">×</button>
        </div>
      `).join('')}
    </div>
  `;
}

// ЭКСПОРТ / ИМПОРТ JSON
export function openJsonModal() {
  document.getElementById('json-textarea').value = JSON.stringify(state, null, 2);
  document.getElementById('json-modal').classList.remove('hidden');
  document.getElementById('json-modal').classList.add('flex');
}

export function closeJsonModal() {
  document.getElementById('json-modal').classList.add('hidden');
  document.getElementById('json-modal').classList.remove('flex');
}

export function copyJsonToClipboard() {
  const textarea = document.getElementById('json-textarea');
  textarea.select();
  navigator.clipboard ? navigator.clipboard.writeText(textarea.value) : document.execCommand('copy');
}

export function importJsonConfig() {
  try {
    const parsed = JSON.parse(document.getElementById('json-textarea').value);
    if (parsed && parsed.mokaSize && MOKA_SIZES[parsed.mokaSize]) {
      updateState(parsed);
      document.getElementById('paper-filter-checkbox').checked = !!state.usePaperFilter;
      renderDrinkSelector();
      renderMokaSizeButtons();
      syncSlidersToSize(state.mokaSize);
      updateUI();
      closeJsonModal();
    }
  } catch (e) {
    alert('Некорректный формат JSON');
  }
}
