import { MOKA_SIZES, DRINKS, GRINDERS } from './data.js';
import { state } from './state.js';

export function renderDrinkSelector() {
  const container = document.getElementById('drink-selector-grid');
  container.innerHTML = Object.values(DRINKS).map(d => {
    const active = d.id === state.drinkId ? 'active' : '';
    return `
      <button onclick="selectDrink('${d.id}')" class="tile-btn ${active} p-3 text-left flex flex-col justify-between">
        <span class="text-xs font-extrabold text-[#0f2942] leading-tight">${d.name}</span>
        <span class="text-[10px] font-semibold text-sky-700 mt-1">${d.shortDesc}</span>
      </button>
    `;
  }).join('');
}

export function renderMokaSizeButtons() {
  const container = document.getElementById('moka-size-grid');
  container.innerHTML = Object.values(MOKA_SIZES).map(s => {
    const active = s.cups === state.mokaSize ? 'active' : '';
    return `
      <button onclick="selectMokaSize(${s.cups})" class="tile-btn ${active} p-2.5 text-center">
        <div class="text-xs font-extrabold text-[#0f2942]">${s.name}</div>
        <div class="text-[11px] font-mono-num font-bold text-sky-700">${s.totalVolumeMl} мл</div>
        <div class="text-[10px] text-[#4a6b82]">${s.heightCm} × ${s.baseWidthCm} см</div>
      </button>
    `;
  }).join('');
}

export function syncSlidersToSize(cups) {
  const sizeObj = MOKA_SIZES[cups];
  const cSlider = document.getElementById('coffee-slider');
  const wSlider = document.getElementById('water-slider');

  cSlider.min = sizeObj.minCoffeeG;
  cSlider.max = sizeObj.maxCoffeeG;
  cSlider.value = state.coffeeG;

  wSlider.min = sizeObj.minWaterMl;
  wSlider.max = Math.round(sizeObj.boilerMaxWaterMl * 1.15);
  wSlider.value = state.waterMl;

  document.getElementById('coffee-min-label').textContent = `${sizeObj.minCoffeeG} г`;
  document.getElementById('coffee-max-label').textContent = `${sizeObj.maxCoffeeG} г`;
  document.getElementById('water-min-label').textContent = `${sizeObj.minWaterMl} мл`;
  document.getElementById('water-valve-label').textContent = `${sizeObj.boilerMaxWaterMl} мл`;
}

export function updateUI() {
  const sizeObj = MOKA_SIZES[state.mokaSize];
  const drinkObj = DRINKS[state.drinkId];

  // Поля ввода и слайдеры
  document.getElementById('coffee-input').value = state.coffeeG;
  document.getElementById('coffee-slider').value = state.coffeeG;
  document.getElementById('water-input').value = state.waterMl;
  document.getElementById('water-slider').value = state.waterMl;

  // Бейджи выбранного напитка и габаритов
  document.getElementById('selected-drink-badge').textContent = drinkObj.name;
  document.getElementById('protocol-drink-badge').textContent = drinkObj.name;
  document.getElementById('moka-dimensions-badge').textContent = `${sizeObj.heightCm.toFixed(1)} см × Ø ${sizeObj.baseWidthCm.toFixed(1)} см`;

  // Расчет коэффициента и выхода базы
  const ratio = state.waterMl / state.coffeeG;
  const absorbedWater = state.coffeeG * 1.9;
  const yieldMl = Math.max(10, Math.round(state.waterMl - absorbedWater));

  const modifierMl = Math.round(yieldMl * drinkObj.modifierRatio);
  const foamMl = Math.round(yieldMl * drinkObj.foamRatio);
  const totalDrinkMl = yieldMl + modifierMl + foamMl;

  document.getElementById('summary-ratio').textContent = `1 : ${ratio.toFixed(1)}`;
  document.getElementById('summary-yield').textContent = `${yieldMl} мл`;
  document.getElementById('summary-total-drink').textContent = `${totalDrinkMl} мл`;
  document.getElementById('active-preset-pill').textContent = `${sizeObj.name}: ${state.coffeeG} г / ${state.waterMl} мл`;

  // 1. КОНТРОЛЬ ЗАПОЛНЕНИЯ КОРЗИНЫ ДО КРАЕВ
  const fillPercent = Math.round((state.coffeeG / sizeObj.defaultCoffeeG) * 100);
  const basketBadge = document.getElementById('basket-fill-badge');
  const basketHint = document.getElementById('basket-headspace-hint');

  if (fillPercent < 90) {
    basketBadge.className = 'px-2.5 py-0.5 rounded-full font-bold bg-amber-100/95 text-amber-900 border border-amber-400';
    basketBadge.textContent = `Корзина заполнена на ${fillPercent}% (Есть пустота!)`;
    basketHint.innerHTML = `<span class="text-amber-800 font-semibold">Внимание:</span> между кофе и верхним фильтром образовалась пустота. Системе потребуется лишняя энергия для её преодоления — вода начнет неравномерно булькать. Досыпьте кофе до ~${sizeObj.defaultCoffeeG} г.`;
  } else if (fillPercent <= 108) {
    basketBadge.className = 'px-2.5 py-0.5 rounded-full font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300';
    basketBadge.textContent = `Корзина заполнена (${fillPercent}% — Без пустот)`;
    basketHint.textContent = 'Идеально: корзина заполнена до краев без утрамбовки. Пустоты под верхним фильтром нет — экстракция пройдет равномерно.';
  } else {
    basketBadge.className = 'px-2.5 py-0.5 rounded-full font-bold bg-red-100/90 text-red-700 border border-red-400';
    basketBadge.textContent = `Переполнение (${fillPercent}% — Риск запрессовки!)`;
    basketHint.innerHTML = `<span class="text-red-700 font-semibold">Опасно:</span> избыток кофе приведет к непроизвольной утрамбовке при закручивании — скачок давления и температуры даст жженый и горький вкус.`;
  }

  // 2. КОНТРОЛЬ КЛАПАНА И ТЕРМОДИНАМИКИ ВОДЫ
  const safetyBadge = document.getElementById('safety-badge');
  const valveIcon = document.getElementById('svg-valve-icon');
  const tempBadge = document.getElementById('water-temp-profile-badge');
  const waterFillRatio = state.waterMl / sizeObj.boilerMaxWaterMl;

  if (state.waterMl > sizeObj.boilerMaxWaterMl) {
    safetyBadge.className = 'px-2.5 py-0.5 rounded-full font-bold bg-red-100/90 border border-red-400 text-red-700';
    safetyBadge.textContent = `Выше клапана (+${state.waterMl - sizeObj.boilerMaxWaterMl} мл)!`;
    valveIcon.setAttribute('fill', '#ef4444');
  } else {
    safetyBadge.className = 'px-2.5 py-0.5 rounded-full font-bold bg-emerald-100/90 border border-emerald-400 text-emerald-800';
    safetyBadge.textContent = `Ниже клапана (Норма)`;
    valveIcon.setAttribute('fill', '#eab308');
  }

  if (waterFillRatio < 0.78) {
    tempBadge.textContent = 'Мягкий / Прохладный (~89–92°C — минимум горечи)';
    tempBadge.className = 'font-mono-num font-bold text-emerald-800 bg-emerald-100/85 px-2.5 py-0.5 rounded-full border border-emerald-300';
  } else if (waterFillRatio <= 0.94) {
    tempBadge.textContent = 'Сбалансированный (~92–95°C)';
    tempBadge.className = 'font-mono-num font-bold text-sky-800 bg-sky-100/85 px-2.5 py-0.5 rounded-full border border-sky-200';
  } else {
    tempBadge.textContent = 'Горячий профиль (~96–99°C — выше риск горечи)';
    tempBadge.className = 'font-mono-num font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300';
  }

  // 3. РАСЧЕТ ЩЕЛЧКОВ КОФЕМОЛКИ
  const grinder = GRINDERS[state.grinderId];
  let recommendedClicks = grinder.baseClicks;
  if (state.roastId === 'light_arabica') recommendedClicks -= 1;
  if (state.roastId === 'dark_italian') recommendedClicks += 1;
  if (state.mokaSize >= 6) recommendedClicks += 1;
  if (state.usePaperFilter) recommendedClicks += 1;

  document.getElementById('grinder-clicks-Main').textContent =
    `${recommendedClicks} ${grinder.unit} (диапазон ${recommendedClicks - 1}–${recommendedClicks + 1})`;
  document.getElementById('grind-micron-badge').textContent =
    state.usePaperFilter ? '~420–490 мкм (с фильтром)' : '~380–450 мкм';

  // 4. ОБНОВЛЕНИЕ SVG-РАЗРЕЗА МОКИ
  document.getElementById('svg-moka-title-badge').textContent = `${sizeObj.name} (${sizeObj.totalVolumeMl} мл)`;
  document.getElementById('svg-dim-height').textContent = `${sizeObj.heightCm.toFixed(1)} см`;
  document.getElementById('svg-dim-width').textContent = `Ø ${sizeObj.baseWidthCm.toFixed(1)} см`;

  const maxBoilerHeightPx = 72;
  const waterHeightPx = Math.min(82, Math.max(14, Math.round((state.waterMl / sizeObj.boilerMaxWaterMl) * maxBoilerHeightPx)));
  const waterY = 292 - waterHeightPx;
  const boilerWaterRect = document.getElementById('svg-boiler-water');
  boilerWaterRect.setAttribute('y', waterY);
  boilerWaterRect.setAttribute('height', waterHeightPx);
  document.getElementById('svg-water-label').textContent = `${state.waterMl} мл (~20°C)`;

  const maxBasketHeightPx = 42;
  const coffeeFillRatio = Math.min(1, state.coffeeG / sizeObj.defaultCoffeeG);
  const groundsHeightPx = Math.max(16, Math.round(coffeeFillRatio * maxBasketHeightPx));
  const groundsY = 210 - groundsHeightPx;
  const voidHeightPx = Math.max(0, 42 - groundsHeightPx);

  document.getElementById('svg-coffee-grounds-solid').setAttribute('y', groundsY);
  document.getElementById('svg-coffee-grounds-solid').setAttribute('height', groundsHeightPx);
  document.getElementById('svg-coffee-grounds').setAttribute('y', groundsY);
  document.getElementById('svg-coffee-grounds').setAttribute('height', groundsHeightPx);
  document.getElementById('svg-headspace-void').setAttribute('height', voidHeightPx);
  document.getElementById('svg-coffee-label').textContent = `${state.coffeeG.toFixed(1)} г кофе`;

  const paperFilterSvg = document.getElementById('svg-paper-filter');
  if (state.usePaperFilter) {
    paperFilterSvg.classList.remove('hidden');
  } else {
    paperFilterSvg.classList.add('hidden');
  }

  const maxUpperHeightPx = 78;
  const upperFillRatio = Math.min(1, yieldMl / sizeObj.totalVolumeMl);
  const upperCoffeeHeightPx = Math.max(16, Math.round(upperFillRatio * maxUpperHeightPx));
  const upperCoffeeY = 158 - upperCoffeeHeightPx;

  document.getElementById('svg-upper-coffee').setAttribute('y', upperCoffeeY);
  document.getElementById('svg-upper-coffee').setAttribute('height', upperCoffeeHeightPx);
  document.getElementById('svg-upper-crema').setAttribute('y', upperCoffeeY - 4);
  document.getElementById('svg-yield-label').textContent = `Выход: ${yieldMl} мл`;

  // 5. ОБНОВЛЕНИЕ SVG-РАЗРЕЗА ИТОГОВОЙ ЧАШКИ
  document.getElementById('svg-cup-title-badge').textContent = drinkObj.name;
  const cupBottomY = 266;
  const cupMaxDrawableHeight = 166;
  const scaleCup = Math.min(1.1, cupMaxDrawableHeight / Math.max(90, totalDrinkMl));

  const coffeeLayerH = Math.max(28, Math.round(yieldMl * scaleCup));
  const modifierLayerH = Math.round(modifierMl * scaleCup);
  const foamLayerH = Math.round(foamMl * scaleCup);

  const coffeeLayerY = cupBottomY - coffeeLayerH;
  const cremaLayerY = coffeeLayerY - 4;
  const modifierLayerY = cremaLayerY - modifierLayerH;
  const foamLayerY = modifierLayerY - foamLayerH;

  document.getElementById('cup-layer-coffee').setAttribute('y', coffeeLayerY);
  document.getElementById('cup-layer-coffee').setAttribute('height', coffeeLayerH);
  document.getElementById('cup-layer-crema').setAttribute('y', cremaLayerY);

  const modBg = document.getElementById('cup-layer-modifier-bg');
  const modPat = document.getElementById('cup-layer-modifier-pattern');
  modBg.setAttribute('y', modifierLayerY);
  modBg.setAttribute('height', modifierLayerH);
  modPat.setAttribute('y', modifierLayerY);
  modPat.setAttribute('height', modifierLayerH);

  if (drinkObj.modifierType === 'water') {
    modBg.setAttribute('fill', 'rgba(56, 189, 248, 0.55)');
    modPat.setAttribute('fill-opacity', '0');
  } else {
    modBg.setAttribute('fill', '#fffdf7');
    modPat.setAttribute('fill-opacity', '0.7');
  }

  const foamRect = document.getElementById('cup-layer-foam');
  foamRect.setAttribute('y', foamLayerY);
  foamRect.setAttribute('height', foamLayerH);

  document.getElementById('cup-coffee-label').textContent = `Кофе-база: ${yieldMl} мл`;
  document.getElementById('cup-total-badge').textContent = `Итого в чашке: ${totalDrinkMl} мл`;

  const modGroup = document.getElementById('cup-modifier-badge-group');
  const foamGroup = document.getElementById('cup-foam-badge-group');

  if (modifierMl > 0) {
    modGroup.classList.remove('hidden');
    const modTitle = drinkObj.modifierType === 'water' ? 'Горячая вода' : 'Молоко';
    document.getElementById('cup-modifier-label').textContent = `${modTitle}: ${modifierMl} мл`;
  } else {
    modGroup.classList.add('hidden');
  }

  if (foamMl > 0) {
    foamGroup.classList.remove('hidden');
    document.getElementById('cup-foam-label').textContent = `Микропена: ${foamMl} мл`;
  } else {
    foamGroup.classList.add('hidden');
  }

  // 6. РЕНДЕР ПОШАГОВОГО ПРОТОКОЛА
  renderProtocolSteps(sizeObj, drinkObj, yieldMl, modifierMl, foamMl, recommendedClicks, grinder.unit);
}

export function renderProtocolSteps(sizeObj, drinkObj, yieldMl, modifierMl, foamMl, clicks, unit) {
  const container = document.getElementById('protocol-steps-container');
  const filterStepText = state.usePaperFilter
    ? 'Смочите круглый <b>бумажный фильтр AeroPress</b> водой и приклейте его к верхнему металлическому ситу кофейника — это сделает чашку чище и выровняет поток.'
    : 'Разровняйте кофе легким постукиванием по бортикам воронки. <b>Никогда не давите темпером или ложкой</b>, чтобы не задирать давление и температуру.';

  const steps = [
    {
      title: 'Вода комнатной температуры (~20°C)',
      desc: `Налейте в нижнюю чашу <b>${state.waterMl} мл</b> чистой воды комнатной температуры (не кипяток!). По мере нагрева расширяющийся воздух и пар мягко увлажнят кофейную таблетку без перегрева выше 100°C.`
    },
    {
      title: 'Помол и заполнение корзины до краев',
      desc: `Смолите <b>${state.coffeeG.toFixed(1)} г</b> кофе на настройке <b>${clicks} ${unit}</b>. Засыпьте в корзину до краев без воздушной пустоты сверху. ${filterStepText}`
    },
    {
      title: 'Плавный нагрев и отсечка до «Стромболианского эффекта»',
      desc: `Поставьте Моку на средний/умеренный нагрев. Как только кофе активно пойдет в верхнюю чашу (~<b>${yieldMl} мл</b> базы), <b>сильно убавьте или выключите конфорку</b>: остаточного давления внутри хватит, чтобы протолкнуть воду без вулканического фырканья и горечи.`
    }
  ];

  if (drinkObj.modifierType === 'milk') {
    steps.push({
      title: `Приготовление молочной части (${drinkObj.name})`,
      desc: `Подогрейте и взбейте <b>${modifierMl} мл</b> молока (до 60–65°C) с образованием <b>~${foamMl} мл</b> шелковистой микропены, затем влейте в <b>${yieldMl} мл</b> готового кофейного концентрата.`
    });
  } else if (drinkObj.modifierType === 'water') {
    steps.push({
      title: 'Сборка Американо',
      desc: `Налейте в чашку <b>${modifierMl} мл</b> горячей воды (88–92°C) и аккуратно влейте сверху <b>${yieldMl} мл</b> сваренной базы из Моки для сохранения крема.`
    });
  }

  container.innerHTML = steps.map((s, idx) => `
    <div class="bg-white/60 border border-white/85 rounded-xl p-3.5 shadow-sm flex gap-3 items-start">
      <span class="w-6 h-6 rounded-full bg-sky-100 text-sky-800 border border-sky-300 font-mono-num text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        ${idx + 1}
      </span>
      <div class="text-xs">
        <div class="font-bold text-[#0f2942]">${s.title}</div>
        <div class="text-[#4a6b82] mt-0.5 leading-relaxed">${s.desc}</div>
      </div>
    </div>
  `).join('');
}
