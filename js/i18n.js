const LANG_STORAGE_KEY = 'mokalab_lang';

export const TRANSLATIONS = {
  ru: {
    pageTitle: 'MokaLab — Термодинамика и пропорции гейзерного кофе',
    appSubtitle: 'Лаборатория экстракции, термодинамики и пропорций гейзерной кофеварки',
    installApp: 'Установить приложение',
    resetBtn: 'Сбросить к эталону',
    savePresetBtn: 'Сохранить рецепт',
    exportJsonBtn: 'Экспорт / JSON',
    savedPresetsTitle: 'Сохраненные рецепты:',

    card01Title: 'Целевой напиток и размер Моки',
    card01Badge: 'Калибровка г / мл',
    selectDrinkLabel: 'Выберите кофейный напиток',
    selectMokaLabel: 'Профиль гейзерной кофеварки',
    funnelWord: 'Воронка',
    boilerWord: 'Бойлер',
    valveWord: 'Клапан',
    customMokaTileTitle: 'Своя Мока',
    customMokaTileSub: 'Калибровка г / мл',
    deleteProfileTitle: 'Удалить профиль',

    card02Title: 'Дозировка, уровень воды и температура',
    ratioLocked: '🔒 Ratio',
    ratioFree: '🔓 Ratio свободно',
    coffeeTitle: 'Молотый кофе в корзине',
    coffeeSub: 'Заполняйте до краев без темперовки',
    unitG: 'г',
    unitMl: 'мл',
    minLabel: 'Мин:',
    maxLabel: 'Макс:',
    valveLimitLabel: 'Клапан:',

    basketUnderfillBadge: (pct) => `Корзина заполнена на ${pct}% (Есть пустота!)`,
    basketUnderfillHint: (defG) => `<span class="text-amber-800 font-semibold">Внимание:</span> между кофе и верхним фильтром образовалась пустота. Системе потребуется лишняя энергия для её преодоления — вода начнет неравномерно булькать. Досыпьте кофе до ~${defG} г.`,
    basketOptimalBadge: (pct) => `Корзина заполнена (${pct}% — Без пустот)`,
    basketOptimalHint: 'Идеально: корзина заполнена до краев без утрамбовки. Пустоты под верхним фильтром нет — экстракция пройдет равномерно.',
    basketOverfillBadge: (pct) => `Переполнение (${pct}% — Риск запрессовки!)`,
    basketOverfillHint: `<span class="text-red-700 font-semibold">Опасно:</span> избыток кофе приведет к непроизвольной утрамбовке при закручивании — скачок давления и температуры даст жженый и горький вкус.`,

    waterTitle: 'Вода в бойлере (~20°C)',
    waterSub: 'Уровень воды регулирует температуру варки',
    safetyAboveValve: (diff) => `Выше клапана (+${diff} мл)!`,
    safetyBelowValve: 'Ниже клапана (Норма)',
    tempProfileLabel: 'Профиль температуры от уровня воды:',
    tempCool: 'Мягкий / Прохладный (~89–92°C — минимум горечи)',
    tempBalanced: 'Сбалансированный (~92–95°C)',
    tempHot: 'Горячий профиль (~96–99°C — выше риск горечи)',
    waterTempHint: 'Чем выше уровень воды (до клапана), тем выше начальная и конечная температура. Если кофе горчит в конце — убавьте воду на 5–10 мл.',

    summaryRatioLabel: 'Коэффициент',
    summaryYieldLabel: 'Выход базы',
    summaryTotalLabel: 'Итого в чашке',

    card03Title: 'Помол, сопротивление и фильтр',
    card03Badge: 'Контроль давления',
    grinderModelLabel: 'Модель кофемолки',
    roastLabel: 'Обжарка и состав зерна',
    roastMedium: 'Средняя / Бленд 80/20 (Классика)',
    roastLight: 'Светлая / 100% Арабика (Фрукты)',
    roastDark: 'Темная итальянская обжарка',
    paperFilterTitle: 'Использовать бумажный фильтр (AeroPress) поверх корзины',
    optionalBadge: 'Опционально',
    paperFilterDesc: 'Делает чашку чище, повышает равномерность экстракции и создает дополнительное сопротивление (позволяет сделать помол на <b>+1 щелчок крупнее</b> без потери давления).',
    grinderRecLabel: 'Рекомендация для выбранной конфигурации',
    grinderClicksText: (clicks, unit, min, max) => `${clicks} ${unit} (диапазон ${min}–${max})`,
    micronWithFilter: '~420–490 мкм (с фильтром)',
    micronNoFilter: '~380–450 мкм',
    grindPhysicsHint: '<b>Физика помола:</b> чем мельче помол, тем сильнее «закрыта» система — растут давление и температура воды. Чем крупнее помол, тем прохладнее экстракция, но при слишком крупном помоле таблетка потеряет герметичность и сквозь кофе прорвется кипяток.',

    card04Title: 'Технический разрез: Мока и Чашка',
    svgMokaHeader: 'А. Разрез Мока-пота',
    svgCupHeader: 'Б. Слои в чашке',
    svgMaxValve: 'MAX КЛАПАН',
    svgYieldBase: (ml) => `БАЗА: ~${ml} МЛ`,
    svgCoffeeLabel: (g) => `${g} Г КОФЕ`,
    svgWaterLabel: (ml) => `${ml} МЛ (~20°C)`,
    svgCupTotalTop: (ml) => `В ЧАШКЕ: ~${ml} МЛ`,
    svgCupCoffeeBase: (ml) => `КОФЕ-БАЗА: ${ml} МЛ`,
    svgCupHotWater: (ml) => `ГОРЯЧАЯ ВОДА: ${ml} МЛ`,
    svgCupMilk: (ml) => `МОЛОКО: ${ml} МЛ`,
    svgCupFoam: (ml) => `ПЕНА: ${ml} МЛ`,

    card05Title: 'Пошаговый протокол заваривания',
    step1Title: 'Вода комнатной температуры (~20°C)',
    step1Desc: (waterMl) => `Налейте в нижнюю чашу <b>${waterMl} мл</b> чистой воды комнатной температуры (не кипяток!). По мере нагрева расширяющийся воздух и пар мягко увлажнят кофейную таблетку без перегрева выше 100°C.`,
    step2Title: 'Помол и заполнение корзины до краев',
    step2FilterOn: 'Смочите круглый <b>бумажный фильтр AeroPress</b> водой и приклейте его к верхнему металлическому ситу кофейника — это сделает чашку чище и выровняет поток.',
    step2FilterOff: 'Разровняйте кофе легким постукиванием по бортикам воронки. <b>Никогда не давите темпером или ложкой</b>, чтобы не задирать давление и температуру.',
    step2Desc: (coffeeG, clicks, unit, filterText) => `Смолите <b>${coffeeG} г</b> кофе на настройке <b>${clicks} ${unit}</b>. Засыпьте в корзину до краев без воздушной пустоты сверху. ${filterText}`,
    step3Title: 'Плавный нагрев и отсечка до «Стромболианского эффекта»',
    step3Desc: (yieldMl) => `Поставьте Моку на средний/умеренный нагрев. Как только кофе активно пойдет в верхнюю чашу (~<b>${yieldMl} мл</b> базы), <b>сильно убавьте или выключите конфорку</b>: остаточного давления внутри хватит, чтобы протолкнуть воду без вулканического фырканья и горечи.`,
    step4MilkTitle: (drinkName) => `Приготовление молочной части (${drinkName})`,
    step4MilkDesc: (modMl, foamMl, yieldMl) => `Подогрейте и взбейте <b>${modMl} мл</b> молока (до 60–65°C) с образованием <b>~${foamMl} мл</b> шелковистой микропены, затем влейте в <b>${yieldMl} мл</b> готового кофейного концентрата.`,
    step4WaterTitle: 'Сборка Американо',
    step4WaterDesc: (modMl, yieldMl) => `Налейте в чашку <b>${modMl} мл</b> горячей воды (88–92°C) и аккуратно влейте сверху <b>${yieldMl} мл</b> сваренной базы из Моки для сохранения крема.`,

    saveModalTitle: 'Сохранить собственный рецепт',
    presetNameLabel: 'Название рецепта',
    presetNamePlaceholder: 'Например: Утренний Флэт 2-cup (Без горечи)',
    cancelBtn: 'Отмена',
    saveBrowserBtn: 'Сохранить в браузере',

    jsonModalTitle: 'Экспорт и импорт конфигурации (JSON)',
    copyJsonBtn: 'Скопировать JSON',
    applyJsonBtn: 'Применить JSON',
    closeBtn: 'Закрыть',
    jsonCopiedAlert: 'JSON скопирован в буфер обмена!',
    jsonErrorAlert: 'Ошибка формата JSON!',

    customMokaModalTitle: 'Калибровка своей кофеварки',
    customMokaNameLabel: 'Название кофеварки',
    customMokaNamePlaceholder: 'Например: Bialetti Venus 4 чашки',
    customMokaCoffeeLabel: 'Вместимость воронки до краев (г)',
    customMokaWaterLabel: 'Объем бойлера до клапана (мл)',
    addMokaBtn: 'Добавить кофеварку',
    alertInvalidCoffee: 'Пожалуйста, укажите реальную вместимость воронки в граммах (от 4 до 65 г).',
    alertInvalidWater: 'Пожалуйста, укажите реальный объем бойлера до клапана в миллилитрах (от 25 до 550 мл).',
    defaultCustomMokaName: (g) => `Мока ${g}г`
  },

  en: {
    pageTitle: 'MokaLab — Moka Pot Thermodynamics & Brew Calculator',
    appSubtitle: 'Extraction Lab, Thermodynamics & Brew Ratios for Moka Pot',
    installApp: 'Install App',
    resetBtn: 'Reset to Default',
    savePresetBtn: 'Save Recipe',
    exportJsonBtn: 'Export / JSON',
    savedPresetsTitle: 'Saved Recipes:',

    card01Title: 'Target Drink & Moka Size',
    card01Badge: 'Calibration g / ml',
    selectDrinkLabel: 'Select Coffee Drink',
    selectMokaLabel: 'Moka Pot Profile',
    funnelWord: 'Basket',
    boilerWord: 'Boiler',
    valveWord: 'Valve',
    customMokaTileTitle: 'Custom Moka',
    customMokaTileSub: 'Calibrate g / ml',
    deleteProfileTitle: 'Delete profile',

    card02Title: 'Dosage, Water Level & Temperature',
    ratioLocked: '🔒 Ratio',
    ratioFree: '🔓 Free Ratio',
    coffeeTitle: 'Ground Coffee in Basket',
    coffeeSub: 'Fill to the rim without tamping',
    unitG: 'g',
    unitMl: 'ml',
    minLabel: 'Min:',
    maxLabel: 'Max:',
    valveLimitLabel: 'Valve:',

    basketUnderfillBadge: (pct) => `Basket ${pct}% full (Headspace gap!)`,
    basketUnderfillHint: (defG) => `<span class="text-amber-800 font-semibold">Warning:</span> there is empty space between the coffee and the upper filter. The system will waste energy overcoming it, causing uneven sputtering. Add coffee up to ~${defG} g.`,
    basketOptimalBadge: (pct) => `Basket full (${pct}% — No gaps)`,
    basketOptimalHint: 'Ideal: the basket is filled to the rim without tamping. No headspace under the upper filter ensures even extraction.',
    basketOverfillBadge: (pct) => `Overfilled (${pct}% — Choking risk!)`,
    basketOverfillHint: `<span class="text-red-700 font-semibold">Danger:</span> excess coffee compresses when screwing the pot together — pressure and temperature spikes will cause a burnt, bitter taste.`,

    waterTitle: 'Water in Boiler (~20°C)',
    waterSub: 'Water level controls brewing temperature',
    safetyAboveValve: (diff) => `Above valve (+${diff} ml)!`,
    safetyBelowValve: 'Below valve (Safe)',
    tempProfileLabel: 'Temperature profile from water level:',
    tempCool: 'Smooth / Cooler (~89–92°C — minimal bitterness)',
    tempBalanced: 'Balanced (~92–95°C)',
    tempHot: 'Hot profile (~96–99°C — higher bitterness risk)',
    waterTempHint: 'Higher water level (up to the valve) increases initial and final brewing temperatures. If coffee tastes bitter at the end, reduce water by 5–10 ml.',

    summaryRatioLabel: 'Brew Ratio',
    summaryYieldLabel: 'Base Yield',
    summaryTotalLabel: 'Total in Cup',

    card03Title: 'Grind Size, Resistance & Filter',
    card03Badge: 'Pressure Control',
    grinderModelLabel: 'Grinder Model',
    roastLabel: 'Roast Level & Blend',
    roastMedium: 'Medium / 80/20 Blend (Classic)',
    roastLight: 'Light / 100% Arabica (Fruity)',
    roastDark: 'Dark Italian Roast',
    paperFilterTitle: 'Use an AeroPress paper filter on top of the basket',
    optionalBadge: 'Optional',
    paperFilterDesc: 'Produces a cleaner cup, improves extraction uniformity, and adds resistance (allows grinding <b>+1 click coarser</b> without losing pressure).',
    grinderRecLabel: 'Recommendation for selected setup',
    grinderClicksText: (clicks, unit, min, max) => `${clicks} ${unit} (range ${min}–${max})`,
    micronWithFilter: '~420–490 µm (with filter)',
    micronNoFilter: '~380–450 µm',
    grindPhysicsHint: '<b>Grind physics:</b> finer grinds seal the system tighter, raising pressure and water temperature. Coarser grinds brew cooler, but if too coarse, the puck loses resistance and boiling water channels through.',

    card04Title: 'Technical Cutaway: Moka & Cup',
    svgMokaHeader: 'A. Moka Pot Cutaway',
    svgCupHeader: 'B. Cup Layers',
    svgMaxValve: 'MAX VALVE',
    svgYieldBase: (ml) => `BASE: ~${ml} ML`,
    svgCoffeeLabel: (g) => `${g} G COFFEE`,
    svgWaterLabel: (ml) => `${ml} ML (~20°C)`,
    svgCupTotalTop: (ml) => `IN CUP: ~${ml} ML`,
    svgCupCoffeeBase: (ml) => `COFFEE BASE: ${ml} ML`,
    svgCupHotWater: (ml) => `HOT WATER: ${ml} ML`,
    svgCupMilk: (ml) => `MILK: ${ml} ML`,
    svgCupFoam: (ml) => `FOAM: ${ml} ML`,

    card05Title: 'Step-by-Step Brewing Protocol',
    step1Title: 'Room Temperature Water (~20°C)',
    step1Desc: (waterMl) => `Pour <b>${waterMl} ml</b> of clean room-temperature water (not boiling!) into the lower chamber. As it heats, expanding air and steam gently pre-infuse the coffee puck without overheating above 100°C.`,
    step2Title: 'Grind & Fill Basket to the Rim',
    step2FilterOn: 'Wet a round <b>AeroPress paper filter</b> with water and stick it to the upper metal screen — this keeps the cup clean and evens out the flow.',
    step2FilterOff: 'Level the grounds by gently tapping the sides of the funnel. <b>Never tamp or press with a spoon</b> to avoid excessive pressure and temperature spikes.',
    step2Desc: (coffeeG, clicks, unit, filterText) => `Grind <b>${coffeeG} g</b> of coffee at <b>${clicks} ${unit}</b>. Fill the basket to the rim leaving no empty headspace on top. ${filterText}`,
    step3Title: 'Gentle Heat & Cut-off Before the "Strombolian Phase"',
    step3Desc: (yieldMl) => `Place the Moka on medium-low heat. Once coffee flows steadily into the upper chamber (~<b>${yieldMl} ml</b> base), <b>turn the heat way down or off</b>: residual pressure inside will finish pushing the water without volcanic sputtering or bitterness.`,
    step4MilkTitle: (drinkName) => `Milk Preparation (${drinkName})`,
    step4MilkDesc: (modMl, foamMl, yieldMl) => `Heat and froth <b>${modMl} ml</b> of milk (to 60–65°C) creating <b>~${foamMl} ml</b> of silky microfoam, then pour over the <b>${yieldMl} ml</b> brewed Moka concentrate.`,
    step4WaterTitle: 'Building the Americano',
    step4WaterDesc: (modMl, yieldMl) => `Pour <b>${modMl} ml</b> of hot water (88–92°C) into your cup and gently pour the <b>${yieldMl} ml</b> brewed Moka base on top to preserve the crema.`,

    saveModalTitle: 'Save Custom Recipe',
    presetNameLabel: 'Recipe Name',
    presetNamePlaceholder: 'E.g., Morning Flat White 2-cup (No bitterness)',
    cancelBtn: 'Cancel',
    saveBrowserBtn: 'Save in Browser',

    jsonModalTitle: 'Export & Import Configuration (JSON)',
    copyJsonBtn: 'Copy JSON',
    applyJsonBtn: 'Apply JSON',
    closeBtn: 'Close',
    jsonCopiedAlert: 'JSON copied to clipboard!',
    jsonErrorAlert: 'Invalid JSON format!',

    customMokaModalTitle: 'Calibrate Custom Moka Pot',
    customMokaNameLabel: 'Moka Pot Name',
    customMokaNamePlaceholder: 'E.g., Bialetti Venus 4-cup',
    customMokaCoffeeLabel: 'Basket capacity to the rim (g)',
    customMokaWaterLabel: 'Boiler volume up to the valve (ml)',
    addMokaBtn: 'Add Moka Pot',
    alertInvalidCoffee: 'Please enter a valid basket capacity in grams (between 4 and 65 g).',
    alertInvalidWater: 'Please enter a valid boiler volume up to the valve in milliliters (between 25 and 550 ml).',
    defaultCustomMokaName: (g) => `Moka ${g}g`
  }
};

function detectInitialLang() {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  if (saved === 'ru' || saved === 'en') return saved;
  const browserLang = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
  return browserLang.startsWith('ru') ? 'ru' : 'en';
}

export let currentLang = detectInitialLang();

export function setLanguage(lang) {
  if (lang !== 'ru' && lang !== 'en') return;
  currentLang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}

export function t(key, ...args) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.ru;
  const val = dict[key];
  if (typeof val === 'function') return val(...args);
  return val !== undefined ? val : key;
}

export function localizeItem(item, field = 'name') {
  if (!item) return '';
  if (currentLang === 'en' && item[`${field}_en`]) {
    return item[`${field}_en`];
  }
  return item[field] ||
