// ============================================================================
// MokaLab — Модуль данных, геометрии Bialetti и физических констант (data.js)
// ============================================================================

// Физическая константа: сколько мл воды удерживает 1 грамм молотого кофе в таблетке
const WATER_RETENTION_PER_GRAM = 1.9;

// 1. ЛИНЕЙКА BIALETTI MOKA EXPRESS (Калибровка по реальному объему бойлера до клапана)
// baseCoffeeDarkG — эталонная масса 100% заполненной до краев корзины на ТЕМНОЙ обжарке (12.0 г для 2 чашек)
// valveLimitMl — реальный объем нижнего бойлера ровно до латунного клапана безопасности (103 мл для 2 чашек)
// nominalYieldMl — паспортный номинальный объем верхней чаши (90 мл для 2 чашек)
const MOKA_SIZES = {
  1: {
    cups: 1,
    name: '1 чашка',
    nominalYieldMl: 60,
    valveLimitMl: 68,
    defaultWaterMl: 50,
    minWaterMl: 25,
    baseCoffeeDarkG: 8.0,
    minCoffeeG: 5.5,
    maxCoffeeG: 11.5,
    heightCm: 13.5,
    baseWidthCm: 7.0
  },
  2: {
    cups: 2,
    name: '2 чашки',
    nominalYieldMl: 90,
    valveLimitMl: 103,      // Реальный лимит до клапана
    defaultWaterMl: 70,     // Ваш проверенный эталон для плотного эспрессо-концентрата
    minWaterMl: 35,
    baseCoffeeDarkG: 12.0,  // 100% заполнение корзины темными бобами
    minCoffeeG: 8.0,
    maxCoffeeG: 16.5,
    heightCm: 14.5,
    baseWidthCm: 8.0
  },
  3: {
    cups: 3,
    name: '3 чашки',
    nominalYieldMl: 130,
    valveLimitMl: 150,
    defaultWaterMl: 110,
    minWaterMl: 55,
    baseCoffeeDarkG: 16.5,
    minCoffeeG: 12.0,
    maxCoffeeG: 22.0,
    heightCm: 16.0,
    baseWidthCm: 9.0
  },
  4: {
    cups: 4,
    name: '4 чашки',
    nominalYieldMl: 185,
    valveLimitMl: 205,
    defaultWaterMl: 150,
    minWaterMl: 80,
    baseCoffeeDarkG: 21.0,
    minCoffeeG: 15.0,
    maxCoffeeG: 27.0,
    heightCm: 18.0,
    baseWidthCm: 9.5
  },
  6: {
    cups: 6,
    name: '6 чашек',
    nominalYieldMl: 250,
    valveLimitMl: 285,
    defaultWaterMl: 210,
    minWaterMl: 110,
    baseCoffeeDarkG: 27.0,
    minCoffeeG: 20.0,
    maxCoffeeG: 35.0,
    heightCm: 21.5,
    baseWidthCm: 11.0
  },
  9: {
    cups: 9,
    name: '9 чашек',
    nominalYieldMl: 410,
    valveLimitMl: 450,
    defaultWaterMl: 330,
    minWaterMl: 180,
    baseCoffeeDarkG: 41.0,
    minCoffeeG: 30.0,
    maxCoffeeG: 52.0,
    heightCm: 25.0,
    baseWidthCm: 11.5
  }
};

// 2. ПРОФИЛИ ОБЖАРКИ И ПЛОТНОСТИ ЗЕРНА (Roast Density Profiles)
// Влияют на то, сколько граммов кофе помещается в 100% объем корзины без пустот (Headspace),
// а также корректируют размер помола.
const ROAST_PROFILES = {
  arabica_dark: {
    id: 'arabica_dark',
    name: 'Тёмная обжарка (Итальянская классика)',
    shortName: 'Тёмная',
    densityFactor: 1.00, // Эталон пользователя: на 2 чашки ровно 12.0 г заполняют корзину до краев
    clickOffset: +1,     // Пористое зерно легче отдает вещества -> мелем на 1 клик крупнее
    retentionFactor: 2.0,
    desc: 'Крупное пористое зерно низкой плотности. Полная корзина 2-cup вмещает ~12 г.'
  },
  blend_80_20: {
    id: 'blend_80_20',
    name: 'Эспрессо-бленд (80% Арабика / 20% Робуста)',
    shortName: 'Бленд 80/20',
    densityFactor: 1.06, // На 2 чашки ~12.5 - 13.0 г для полного заполнения
    clickOffset: 0,
    retentionFactor: 1.9,
    desc: 'Классический плотный бленд с густой крема. Полная корзина 2-cup вмещает ~12.5–13 г.'
  },
  arabica_med: {
    id: 'arabica_med',
    name: '100% Арабика — Средняя обжарка',
    shortName: 'Средняя',
    densityFactor: 1.10, // Более тяжелое зерно: на 2 чашки ~13.0 - 13.5 г до краев
    clickOffset: 0,
    retentionFactor: 1.9,
    desc: 'Средняя плотность зерна. Чтобы не было пустоты в корзине 2-cup, требуется ~13–13.5 г.'
  },
  arabica_light: {
    id: 'arabica_light',
    name: 'Светлая обжарка (Омни / Фильтр)',
    shortName: 'Светлая',
    densityFactor: 1.18, // Очень плотное тяжелое зерно: на 2 чашки до ~14.0 г в том же объеме корзины
    clickOffset: -1,     // Сложнее экстрагируется -> мелем на 1 клик мельче
    retentionFactor: 1.8,
    desc: 'Твердое и тяжелое зерно высокой плотности. Полная корзина 2-cup вмещает до ~14 г.'
  }
};

// 3. МАТРИЦА КОФЕЙНЫХ НАПИТКОВ (Латте строго исключен)
const DRINKS = {
  espresso: {
    id: 'espresso',
    name: 'Эспрессо (Мока)',
    shortDesc: 'Плотный концентрат • База',
    code: 'База',
    modifierType: 'none',
    modifierRatio: 0,
    foamShare: 0
  },
  flatwhite: {
    id: 'flatwhite',
    name: 'Флэт Уайт',
    shortDesc: 'База + молоко (1:2.4) и микропена',
    code: 'Молочный',
    modifierType: 'milk',
    modifierRatio: 2.4,
    foamShare: 0.15
  },
  cappuccino: {
    id: 'cappuccino',
    name: 'Капучино',
    shortDesc: 'База + молоко (1:3.0) и пышная пена',
    code: 'Классика',
    modifierType: 'milk',
    modifierRatio: 3.0,
    foamShare: 0.32
  },
  cortado: {
    id: 'cortado',
    name: 'Кортадо',
    shortDesc: 'Баланс 1:1 теплого молока и кофе',
    code: 'Баланс 1:1',
    modifierType: 'milk',
    modifierRatio: 1.0,
    foamShare: 0.10
  },
  americano: {
    id: 'americano',
    name: 'Американо',
    shortDesc: 'Мока-база + горячая вода (1:2.2)',
    code: 'Черный',
    modifierType: 'water',
    modifierRatio: 2.2,
    foamShare: 0
  }
};

// 4. ПРОФИЛИ КОФЕМОЛОК
const GRINDERS = {
  timemore_c3: {
    name: 'Timemore Chestnut C3 / C3S Pro',
    baseClicks: 15,
    range: 1,
    unit: 'щелчков',
    note: 'Эталон под Мока-базу и Флэт Уайт'
  },
  comandante: {
    name: 'Comandante C40 (MK3 / MK4)',
    baseClicks: 16,
    range: 2,
    unit: 'кликов',
    note: 'Стандартная ось (32 клика на Red Clix)'
  },
  '1zpresso_q2': {
    name: '1Zpresso Q2 / JX',
    baseClicks: 42,
    range: 3,
    unit: 'кликов',
    note: '1.4 оборота от нуля'
  },
  kingrinder_k6: {
    name: 'KINGrinder K6',
    baseClicks: 55,
    range: 4,
    unit: 'кликов',
    note: 'Внешнее кольцо регулировки'
  },
  generic_burr: {
    name: 'Универсальная жерновая (1–30)',
    baseClicks: 10,
    range: 2,
    unit: 'делений',
    note: 'Шкала 1–30 (средне-мелкий помол)'
  }
};

// 5. СЕМЬ ФИЗИЧЕСКИХ ПРАВИЛ ЭКСТРАКЦИИ (База знаний интерфейса)
const PHYSICS_RULES = [
  {
    id: 'room_water',
    icon: 'droplets',
    title: '1. Вода комнатной температуры (~20°C)',
    badge: 'Разрушение мифа',
    color: 'sky',
    text: 'Заливайте воду комнатной температуры, а не кипяток. Кипяток гарантирует уход температуры за 100°C к финалу варки и резкую горечь. Кофе не «сгорит» на плите: расширяющийся воздух и пар заранее увлажняют таблетку, работая как предсмачивание (блум) в пуровере.'
  },
  {
    id: 'water_level_temp',
    icon: 'thermometer',
    title: '2. Регулировка температуры уровнем воды',
    badge: 'Термодинамика',
    color: 'sky',
    text: 'Чем больше воды залито в бойлер (ближе к клапану 103 мл), тем меньше воздушный карман и тем выше начальная и конечная температура заваривания. Если кофе горчит в конце — налейте меньше воды (например, 70–85 мл вместо 100 мл).'
  },
  {
    id: 'no_headspace',
    icon: 'layers',
    title: '3. Заполняйте корзину строго до краев',
    badge: 'Без пустот',
    color: 'amber',
    text: 'Молотый кофе всегда должен заполнять корзину на 100% по объему (для темной обжарки в 2-cup это ~12 г, для светлой — до ~14 г). Если недосыпать кофе, образуется воздушная пустота: системе потребуется лишняя энергия, и вода начнет неравномерно булькать.'
  },
  {
    id: 'no_tamping',
    icon: 'ban',
    title: '4. Никогда не утрамбовывайте кофе',
    badge: 'Запрет темперовки',
    color: 'red',
    text: 'Не давите на кофе темпером или ложкой — только легкое постукивание для выравнивания. Утрамбовка резко увеличивает сопротивление таблетки, заставляя систему задирать давление и температуру, что дает жженый и едкий напиток.'
  },
  {
    id: 'grind_balance',
    icon: 'sliders',
    title: '5. Баланс помола, давления и герметичности',
    badge: 'Гидравлика',
    color: 'amber',
    text: 'Чем мельче помол, тем сильнее «закрыта» система — растут давление и температура. Более крупный помол снижает температуру, но слишком крупный разрушит герметизацию таблетки: давление упадет, и сквозь кофе прорвется кипяток.'
  },
  {
    id: 'paper_filter',
    icon: 'filter',
    title: '6. Бумажный фильтр AeroPress (Опционально)',
    badge: 'Чистота и поток',
    color: 'emerald',
    text: 'Смоченный фильтр от AeroPress поверх кофейной корзины задерживает мелкую взвесь и масла, выравнивает поток воды и создает дополнительное сопротивление — это позволяет смолоть кофе на 1 щелчок крупнее без потери давления.'
  },
  {
    id: 'strombolian',
    icon: 'flame-kindling',
    title: '7. Избегайте «Стромболианского эффекта»',
    badge: 'Стоп-фаза',
    color: 'red',
    text: 'Не допускайте вулканического фырканья и плевания паром в конце варки. Как только кофе активно пошел в верхнюю чашу, сильно убавьте или выключите огонь — остаточного давления в бойлере хватит, чтобы протолкнуть воду без перегрева.'
  }
];
