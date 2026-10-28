import { t } from './i18n.js';

// 1. БАЗОВЫЕ ЭТАЛОНЫ МОКИ (2 и 3 чашки с вашими обновленными объемами бойлера)
export const DEFAULT_MOKA_SIZES = {
  2: {
    id: '2',
    cups: '2',
    name: '2 чашки',
    name_en: '2 Cups',
    boilerMaxWaterMl: 100,
    defaultWaterMl: 70,
    defaultCoffeeG: 12.0,
    minCoffeeG: 9.0,
    maxCoffeeG: 15.0,
    minWaterMl: 35,
    isCustom: false
  },
  3: {
    id: '3',
    cups: '3',
    name: '3 чашки',
    name_en: '3 Cups',
    boilerMaxWaterMl: 150,
    defaultWaterMl: 105,
    defaultCoffeeG: 17.0,
    minCoffeeG: 13.0,
    maxCoffeeG: 20.0,
    minWaterMl: 55,
    isCustom: false
  }
};

const CUSTOM_MOKAS_STORAGE_KEY = 'mokalab_custom_mokas_v1';

export const MOKA_SIZES = { ...DEFAULT_MOKA_SIZES };

export function loadCustomMokasIntoCatalog() {
  Object.keys(MOKA_SIZES).forEach(k => delete MOKA_SIZES[k]);
  Object.assign(MOKA_SIZES, DEFAULT_MOKA_SIZES);

  try {
    const raw = localStorage.getItem(CUSTOM_MOKAS_STORAGE_KEY);
    if (!raw) return;
    const customList = JSON.parse(raw);
    if (Array.isArray(customList)) {
      customList.forEach(item => {
        MOKA_SIZES[item.id] = item;
      });
    }
  } catch (e) {
    console.error('Error reading custom mokas:', e);
  }
}

export function saveCustomMokaToCatalog(name, coffeeG, boilerMaxWaterMl) {
  const id = 'custom_' + Date.now();
  const cleanCoffee = parseFloat(Number(coffeeG).toFixed(1));
  const cleanWater = Math.round(Number(boilerMaxWaterMl));

  const defaultWaterMl = Math.round(cleanWater * 0.88);
  const minCoffeeG = Math.max(4, parseFloat((cleanCoffee * 0.75).toFixed(1)));
  const maxCoffeeG = parseFloat((cleanCoffee * 1.25).toFixed(1));
  const minWaterMl = Math.max(20, Math.round(cleanWater * 0.45));

  const finalName = name.trim() || t('defaultCustomMokaName', cleanCoffee);

  const newMoka = {
    id,
    cups: id,
    name: finalName,
    name_en: finalName,
    boilerMaxWaterMl: cleanWater,
    defaultWaterMl,
    defaultCoffeeG: cleanCoffee,
    minCoffeeG,
    maxCoffeeG,
    minWaterMl,
    isCustom: true
  };

  try {
    const raw = localStorage.getItem(CUSTOM_MOKAS_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push(newMoka);
    localStorage.setItem(CUSTOM_MOKAS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving custom moka:', e);
  }

  loadCustomMokasIntoCatalog();
  return newMoka;
}

export function deleteCustomMokaFromCatalog(id) {
  try {
    const raw = localStorage.getItem(CUSTOM_MOKAS_STORAGE_KEY);
    if (!raw) return;
    const list = JSON.parse(raw).filter(item => item.id !== id);
    localStorage.setItem(CUSTOM_MOKAS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error deleting custom moka:', e);
  }
  loadCustomMokasIntoCatalog();
}

loadCustomMokasIntoCatalog();

// 2. МАТРИЦА КОФЕЙНЫХ НАПИТКОВ
export const DRINKS = {
  espresso: {
    id: 'espresso',
    name: 'Эспрессо (Мока)',
    name_en: 'Espresso (Moka)',
    shortDesc: 'Чистый концентрат',
    shortDesc_en: 'Pure concentrate',
    modifierType: 'none',
    modifierRatio: 0,
    foamRatio: 0
  },
  flatwhite: {
    id: 'flatwhite',
    name: 'Флэт Уайт',
    name_en: 'Flat White',
    shortDesc: 'Молоко 1:2 + тонкая пена',
    shortDesc_en: 'Milk 1:2 + microfoam',
    modifierType: 'milk',
    modifierRatio: 2.0,
    foamRatio: 0.25
  },
  cappuccino: {
    id: 'cappuccino',
    name: 'Капучино',
    name_en: 'Cappuccino',
    shortDesc: 'Молоко 1:2 + пышная пена',
    shortDesc_en: 'Milk 1:2 + rich foam',
    modifierType: 'milk',
    modifierRatio: 2.0,
    foamRatio: 1.0
  },
  cortado: {
    id: 'cortado',
    name: 'Кортадо',
    name_en: 'Cortado',
    shortDesc: 'Баланс кофе и молока 1:1',
    shortDesc_en: '1:1 coffee & milk balance',
    modifierType: 'milk',
    modifierRatio: 1.0,
    foamRatio: 0.15
  },
  americano: {
    id: 'americano',
    name: 'Американо',
    name_en: 'Americano',
    shortDesc: 'Горячая вода 1:2',
    shortDesc_en: 'Hot water 1:2',
    modifierType: 'water',
    modifierRatio: 2.0,
    foamRatio: 0
  }
};

// 3. БАЗА КОФЕМОЛОК
export const GRINDERS = {
  timemore_c3: {
    name: 'Timemore C3 / C3S Pro',
    baseClicks: 15,
    minClicks: 14,
    maxClicks: 16,
    unit: 'щелчков',
    unit_en: 'clicks'
  },
  '1zpresso_q2': {
    name: '1Zpresso Q2 / JX',
    baseClicks: 42,
    minClicks: 38,
    maxClicks: 46,
    unit: 'кликов',
    unit_en: 'clicks'
  },
  comandante_c40: {
    name: 'Comandante C40 MK4',
    baseClicks: 16,
    minClicks: 14,
    maxClicks: 18,
    unit: 'кликов',
    unit_en: 'clicks'
  },
  kingrinder_k6: {
    name: 'KINGrinder K6',
    baseClicks: 55,
    minClicks: 50,
    maxClicks: 60,
    unit: 'кликов',
    unit_en: 'clicks'
  },
  baratza_encore: {
    name: 'Baratza Encore ESP',
    baseClicks: 14,
    minClicks: 12,
    maxClicks: 16,
    unit: 'делений',
    unit_en: 'steps'
  }
};
