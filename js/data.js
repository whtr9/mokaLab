// 1. ЛИНЕЙКА РАЗМЕРОВ BIALETTI MOKA EXPRESS (1, 2, 3, 4, 6, 9 чашек)
export const MOKA_SIZES = {
  1: {
    cups: 1,
    name: '1 чашка',
    totalVolumeMl: 60,
    heightCm: 13.5,
    baseWidthCm: 7.0,
    boilerMaxWaterMl: 55,
    defaultWaterMl: 45,
    defaultCoffeeG: 8.0,
    minCoffeeG: 6.0,
    maxCoffeeG: 10.0,
    minWaterMl: 25
  },
  2: {
    cups: 2,
    name: '2 чашки',
    totalVolumeMl: 90,
    heightCm: 14.5,
    baseWidthCm: 8.0,
    boilerMaxWaterMl: 80,
    defaultWaterMl: 70,
    defaultCoffeeG: 12.0,
    minCoffeeG: 9.0,
    maxCoffeeG: 15.0,
    minWaterMl: 35
  },
  3: {
    cups: 3,
    name: '3 чашки',
    totalVolumeMl: 130,
    heightCm: 16.0,
    baseWidthCm: 9.0,
    boilerMaxWaterMl: 120,
    defaultWaterMl: 105,
    defaultCoffeeG: 17.0,
    minCoffeeG: 13.0,
    maxCoffeeG: 20.0,
    minWaterMl: 55
  },
  4: {
    cups: 4,
    name: '4 чашки',
    totalVolumeMl: 185,
    heightCm: 18.0,
    baseWidthCm: 9.5,
    boilerMaxWaterMl: 170,
    defaultWaterMl: 150,
    defaultCoffeeG: 22.0,
    minCoffeeG: 17.0,
    maxCoffeeG: 26.0,
    minWaterMl: 80
  },
  6: {
    cups: 6,
    name: '6 чашек',
    totalVolumeMl: 250,
    heightCm: 21.5,
    baseWidthCm: 11.0,
    boilerMaxWaterMl: 235,
    defaultWaterMl: 205,
    defaultCoffeeG: 28.0,
    minCoffeeG: 22.0,
    maxCoffeeG: 33.0,
    minWaterMl: 110
  },
  9: {
    cups: 9,
    name: '9 чашек',
    totalVolumeMl: 410,
    heightCm: 25.0,
    baseWidthCm: 11.5,
    boilerMaxWaterMl: 380,
    defaultWaterMl: 335,
    defaultCoffeeG: 42.0,
    minCoffeeG: 34.0,
    maxCoffeeG: 48.0,
    minWaterMl: 180
  }
};

// 2. МАТРИЦА КОФЕЙНЫХ НАПИТКОВ
export const DRINKS = {
  espresso: {
    id: 'espresso',
    name: 'Эспрессо (Мока)',
    shortDesc: 'Чистый концентрат',
    modifierType: 'none',
    modifierRatio: 0,
    foamRatio: 0
  },
  flatwhite: {
    id: 'flatwhite',
    name: 'Флэт Уайт',
    shortDesc: 'Молоко 1:2.5 + тонкая пена',
    modifierType: 'milk',
    modifierRatio: 2.5,
    foamRatio: 0.35
  },
  cappuccino: {
    id: 'cappuccino',
    name: 'Капучино',
    shortDesc: 'Молоко 1:2 + пышная пена',
    modifierType: 'milk',
    modifierRatio: 2.0,
    foamRatio: 1.0
  },
  cortado: {
    id: 'cortado',
    name: 'Кортадо',
    shortDesc: 'Баланс кофе и молока 1:1',
    modifierType: 'milk',
    modifierRatio: 1.0,
    foamRatio: 0.15
  },
  americano: {
    id: 'americano',
    name: 'Американо',
    shortDesc: 'Горячая вода 1:2.2',
    modifierType: 'water',
    modifierRatio: 2.2,
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
    unit: 'щелчков'
  },
  '1zpresso_q2': {
    name: '1Zpresso Q2 / JX',
    baseClicks: 42,
    minClicks: 38,
    maxClicks: 46,
    unit: 'кликов'
  },
  comandante_c40: {
    name: 'Comandante C40 MK4',
    baseClicks: 16,
    minClicks: 14,
    maxClicks: 18,
    unit: 'кликов'
  },
  kingrinder_k6: {
    name: 'KINGrinder K6',
    baseClicks: 55,
    minClicks: 50,
    maxClicks: 60,
    unit: 'кликов'
  },
  baratza_encore: {
    name: 'Baratza Encore ESP',
    baseClicks: 14,
    minClicks: 12,
    maxClicks: 16,
    unit: 'делений'
  }
};
