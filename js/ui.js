import { MOKA_SIZES, DRINKS, GRINDERS } from './data.js';
import { state } from './state.js';
import { t, currentLang, localizeItem } from './i18n.js';

export function applyStaticTranslations() {
  document.title = t('pageTitle');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });

  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.textContent = currentLang === 'ru' ? '🌐 EN' : '🌐 RU';
  }

  const lockBtn = document.getElementById('lock-ratio-btn');
  if (lockBtn) {
    if (state.ratioLocked) {
      lockBtn.textContent = `${t('ratioLocked')} 1:${state.lockedRatioValue.toFixed(1)}`;
    } else {
      lockBtn.textContent = t('ratioFree');
    }
  }
}

export function renderDrinkSelector() {
  const container = document.getElementById('drink-selector-grid');
  container.innerHTML = Object.values(DRINKS).map(d => {
    const active = d.id === state.drinkId ? 'active' : '';
    const name = localizeItem(d, 'name');
    const shortDesc = localizeItem(d, 'shortDesc');
    return `
      <button onclick="selectDrink('${d.id}')" class="tile-btn ${active} p-3 text-left flex flex-col justify-between">
        <span class="text-xs font-extrabold text-[#0f2942] leading-tight">${name}</span>
        <span class="text-[10px] font-semibold text-sky-700 mt-1">${shortDesc}</span>
      </button>
    `;
  }).join('');
}

export function renderMokaSizeButtons() {
  const container = document.getElementById('moka-size-grid');
  const unitG = t('unitG');
  const unitMl = t('unitMl');

  const sizeCardsHtml = Object.values(MOKA_SIZES).map(s => {
    const active = String(s.cups) === String(state.mokaSize) ? 'active' : '';
    const displayName = localizeItem(s, 'name');
    const deleteBtnHtml = s.isCustom
      ? `<span onclick="event.stopPropagation(); removeCustomMoka('${s.id}')"
               title="${t('deleteProfileTitle')}"
               class="absolute top-1 right-1.5 text-[11px] font-bold text-slate-400 hover:text-red-600 px-1">✕</span>`
      : '';

    return `
      <button onclick="selectMokaSize('${s.cups}')" class="tile-btn ${active} p-2.5 text-center relative flex flex-col justify-center">
        ${deleteBtnHtml}
        <div class="text-xs font-extrabold text-[#0f2942] truncate px-2">${displayName}</div>
        <div class="text-[11px] font-mono-num font-bold text-amber-800 mt-0.5">${t('funnelWord')}: ${s.defaultCoffeeG} ${unitG}</div>
        <div class="text-[10px] font-mono-num font-semibold text-sky-700">${t('boilerWord')}: ${s.boilerMaxWaterMl} ${unitMl}</div>
      </button>
    `;
  }).join('');

  const addCustomBtnHtml = `
    <button onclick="openCustomMokaModal()"
            class="tile-btn p-2.5 text-center flex flex-col items-center justify-center border-dashed border-2 border-sky-400/80 hover:border-sky-500">
      <div class="text-base font-extrabold text-sky-700 leading-none">+</div>
      <div class="text-xs font-extrabold text-[#0f2942] mt-1">${t('customMokaTileTitle')}</div>
      <div class="text-[10px] font-semibold text-sky-700">${t('customMokaTileSub')}</div>
    </button>
  `;

  container.innerHTML = sizeCardsHtml + addCustomBtnHtml;
}

export function syncSlidersToSize(cupsKey) {
  const sizeObj = MOKA_SIZES[cupsKey] || MOKA_SIZES['2'];
  const cSlider = document.getElementById('coffee-slider');
  const wSlider = document.getElementById('water-slider');
  const unitG = t('unitG');
  const unitMl = t('unitMl');

  cSlider.min = sizeObj.minCoffeeG;
  cSlider.max = sizeObj.maxCoffeeG;
  cSlider.value = state.coffeeG;

  wSlider.min = sizeObj.minWaterMl;
  wSlider.max = Math.round(sizeObj.boilerMaxWaterMl * 1.15);
  wSlider.value = state.waterMl;

  document.getElementById('coffee-min-label').textContent = `${sizeObj.minCoffeeG} ${unitG}`;
  document.getElementById('coffee-max-label').textContent = `${sizeObj.maxCoffeeG} ${unitG}`;
  document.getElementById('water-min-label').textContent = `${sizeObj.minWaterMl} ${unitMl}`;
  document.getElementById('water-valve-label').textContent = `${sizeObj.boilerMaxWaterMl} ${unitMl}`;
}

export function updateUI() {
  const sizeObj = MOKA_SIZES[state.mokaSize] || MOKA_SIZES['2'];
  const drinkObj = DRINKS[state.drinkId];
  const sizeName = localizeItem(sizeObj, 'name');
  const drinkName = localizeItem(drinkObj, 'name');
  const unitG = t('unitG');
  const unitMl = t('unitMl');

  document.getElementById('coffee-input').value = state.coffeeG;
  document.getElementById('coffee-slider').value = state.coffeeG;
  document.getElementById('water-input').value = state.waterMl;
  document.getElementById('water-slider').value = state.waterMl;

  document.getElementById('selected-drink-badge').textContent = drinkName;
  document.getElementById('protocol-drink-badge').textContent = drinkName;
  document.getElementById('moka-capacity-badge').textContent =
    `${t('funnelWord')}: ${sizeObj.defaultCoffeeG} ${unitG} | ${t('valveWord')}: ${sizeObj.boilerMaxWaterMl} ${unitMl}`;

  const ratio = state.waterMl / state.coffeeG;
  const absorbedWater = state.coffeeG * 1.9;
  const yieldMl = Math.max(10, Math.round(state.waterMl - absorbedWater));

  const modifierMl = Math.round(yieldMl * drinkObj.modifierRatio);
  const foamMl = Math.round(yieldMl * drinkObj.foamRatio);
  const totalDrinkMl = yieldMl + modifierMl + foamMl;

  document.getElementById('summary-ratio').textContent = `1 : ${ratio.toFixed(1)}`;
  document.getElementById('summary-yield').textContent = `${yieldMl} ${unitMl}`;
  document.getElementById('summary-total-drink').textContent = `${totalDrinkMl} ${unitMl}`;
  document.getElementById('active-preset-pill').textContent = `${sizeName}: ${state.coffeeG} ${unitG} / ${state.waterMl} ${unitMl}`;

  // 1. КОНТРОЛЬ ЗАПОЛНЕНИЯ КОРЗИНЫ
  const fillPercent = Math.round((state.coffeeG / sizeObj.defaultCoffeeG) * 100);
  const basketBadge = document.getElementById('basket-fill-badge');
  const basketHint = document.getElementById('basket-headspace-hint');

  if (fillPercent < 90) {
    basketBadge.className = 'px-2.5 py-0.5 rounded-full font-bold bg-amber-100/95 text-amber-900 border border-amber-400';
    basketBadge.textContent = t('basketUnderfillBadge', fillPercent);
    basketHint.innerHTML = t('basketUnderfillHint', sizeObj.defaultCoffeeG);
  } else if (fillPercent <= 108) {
    basketBadge.className = 'px-2.5 py-0.5 rounded-full font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300';
    basketBadge.textContent = t('basketOptimalBadge', fillPercent);
    basketHint.textContent = t('basketOptimalHint');
  } else {
    basketBadge.className = 'px-2.5 py-0.5 rounded-full font-bold bg-red-100/90 text-red-700 border border-red-400';
    basketBadge.textContent = t('basketOverfillBadge', fillPercent);
    basketHint.innerHTML = t('basketOverfillHint');
  }

  // 2. КОНТРОЛЬ КЛАПАНА И ТЕРМОДИНАМИКИ
  const safetyBadge = document.getElementById('safety-badge');
  const valveIcon = document.getElementById('svg-valve-icon');
  const tempBadge = document.getElementById('water-temp-profile-badge');
  const waterFillRatio = state.waterMl / sizeObj.boilerMaxWaterMl;

  if (state.waterMl > sizeObj.boilerMaxWaterMl) {
    safetyBadge.className = 'px-2.5 py-0.5 rounded-full font-bold bg-red-100/90 border border-red-400 text-red-700';
    safetyBadge.textContent = t('safetyAboveValve', state.waterMl - sizeObj.boilerMaxWaterMl);
    valveIcon.setAttribute('fill', '#ef4444');
  } else {
    safetyBadge.className = 'px-2.5 py-0.5 rounded-full font-bold bg-emerald-100/90 border border-emerald-400 text-emerald-800';
    safetyBadge.textContent = t('safetyBelowValve');
    valveIcon.setAttribute('fill', '#eab308');
  }

  if (waterFillRatio < 0.78) {
    tempBadge.textContent = t('tempCool');
    tempBadge.className = 'font-mono-num font-bold text-emerald-800 bg-emerald-100/85 px-2.5 py-0.5 rounded-full border border-emerald-300';
  } else if (waterFillRatio <= 0.94) {
    tempBadge.textContent = t('tempBalanced');
    tempBadge.className = 'font-mono-num font-bold text-sky-800 bg-sky-100/85 px-2.5 py-0.5 rounded-full border border-sky-200';
  } else {
    tempBadge.textContent = t('tempHot');
    tempBadge.className = 'font-mono-num font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300';
  }

  // 3. РАСЧЕТ ЩЕЛЧКОВ КОФЕМОЛКИ
  const grinder = GRINDERS[state.grinderId];
  const grinderUnit = localizeItem(grinder, 'unit');
  let recommendedClicks = grinder.baseClicks;
  if (state.roastId === 'light_arabica') recommendedClicks -= 1;
  if (state.roastId === 'dark_italian') recommendedClicks += 1;
  if (sizeObj.defaultCoffeeG >= 24) recommendedClicks += 1;
  if (state.usePaperFilter) recommendedClicks += 1;

  document.getElementById('grinder-clicks-Main').textContent =
    t('grinderClicksText', recommendedClicks, grinderUnit, recommendedClicks - 1, recommendedClicks + 1);
  document.getElementById('grind-micron-badge').textContent =
    state.usePaperFilter ? t('micronWithFilter') : t('micronNoFilter');

  // 4. ОБНОВЛЕНИЕ SVG-РАЗРЕЗА МОКИ
  document.getElementById('svg-moka-title-badge').textContent =
    `${sizeName} (${sizeObj.defaultCoffeeG} ${unitG} / ${sizeObj.boilerMaxWaterMl} ${unitMl})`;

  const boilerBottomY = 328;
  const valveLineY = 229;
  const maxDrawableWaterHeight = boilerBottomY - valveLineY;
  const waterHeightPx = Math.min(114, Math.max(12, (state.waterMl / sizeObj.boilerMaxWaterMl) * maxDrawableWaterHeight));
  const waterTopY = boilerBottomY - waterHeightPx;

  const boilerWaterRect = document.getElementById('svg-boiler-water');
  const waterSurfaceLine = document.getElementById('svg-water-surface');
  boilerWaterRect.setAttribute('y', waterTopY);
  boilerWaterRect.setAttribute('height', waterHeightPx);
  waterSurfaceLine.setAttribute('y1', waterTopY);
  waterSurfaceLine.setAttribute('y2', waterTopY);
  document.getElementById('svg-water-label').textContent = t('svgWaterLabel', state.waterMl);

  const basketBottomY = 238;
  const maxBasketHeight = 54;
  const coffeeFillRatio = Math.min(1, state.coffeeG / sizeObj.defaultCoffeeG);
  const coffeeHeightPx = Math.max(14, Math.round(coffeeFillRatio * maxBasketHeight));
  const coffeeTopY = basketBottomY - coffeeHeightPx;
  const voidHeightPx = Math.max(0, maxBasketHeight - coffeeHeightPx);

  document.getElementById('svg-coffee-grounds-solid').setAttribute('y', coffeeTopY);
  document.getElementById('svg-coffee-grounds-solid').setAttribute('height', coffeeHeightPx);
  document.getElementById('svg-coffee-grounds').setAttribute('y', coffeeTopY);
  document.getElementById('svg-coffee-grounds').setAttribute('height', coffeeHeightPx);
  document.getElementById('svg-headspace-void').setAttribute('height', voidHeightPx);
  document.getElementById('svg-coffee-label').textContent = t('svgCoffeeLabel', state.coffeeG.toFixed(1));

  const paperFilterSvg = document.getElementById('svg-paper-filter');
  if (state.usePaperFilter) {
    paperFilterSvg.classList.remove('hidden');
  } else {
    paperFilterSvg.classList.add('hidden');
  }

  const upperBottomY = 182;
  const maxUpperHeight = 86;
  const yieldRatio = Math.min(1.0, yieldMl / (sizeObj.boilerMaxWaterMl * 0.85));
  const upperHeightPx = Math.max(14, yieldRatio * maxUpperHeight);
  const upperTopY = upperBottomY - upperHeightPx;

  document.getElementById('svg-upper-coffee').setAttribute('y', upperTopY);
  document.getElementById('svg-upper-coffee').setAttribute('height', upperHeightPx);
  document.getElementById('svg-upper-crema').setAttribute('y', upperTopY - 4);
  document.getElementById('svg-yield-label').textContent = t('svgYieldBase', yieldMl);

  // 5. ОБНОВЛЕНИЕ SVG-РАЗРЕЗА ИТОГОВОЙ ЧАШКИ
  document.getElementById('svg-cup-title-badge').textContent = drinkName;
  document.getElementById('cup-total-top').textContent = t('svgCupTotalTop', totalDrinkMl);

  const cupBottomY = 308;
  const cupMaxHeightPx = 215;
  const referenceScaleMaxMl = Math.max(totalDrinkMl * 1.12, yieldMl * 2.2, 120);
  const pxPerMl = cupMaxHeightPx / referenceScaleMaxMl;

  const coffeeH = Math.max(26, yieldMl * pxPerMl);
  const modH = modifierMl > 0 ? Math.max(24, modifierMl * pxPerMl) : 0;
  const foamH = foamMl > 0 ? Math.max(16, foamMl * pxPerMl) : 0;

  const coffeeY = cupBottomY - coffeeH;
  const modY = coffeeY - modH;
  const foamY = modY - foamH;

  document.getElementById('cup-layer-coffee').setAttribute('y', coffeeY);
  document.getElementById('cup-layer-coffee').setAttribute('height', coffeeH);
  document.getElementById('cup-layer-crema').setAttribute('y', coffeeY - 4);

  const modLayer = document.getElementById('cup-layer-modifier');
  const modLayerBg = document.getElementById('cup-layer-modifier-bg');
  modLayer.setAttribute('y', modY);
  modLayer.setAttribute('height', modH);
  modLayerBg.setAttribute('y', modY);
  modLayerBg.setAttribute('height', modH);

  if (drinkObj.modifierType === 'water') {
    modLayerBg.setAttribute('fill', 'rgba(56, 189, 248, 0.55)');
    modLayer.setAttribute('fill-opacity', '0');
  } else {
    modLayerBg.setAttribute('fill', '#fffdf7');
    modLayer.setAttribute('fill-opacity', '1');
  }

  const foamLayer = document.getElementById('cup-layer-foam');
  foamLayer.setAttribute('y', foamY);
  foamLayer.setAttribute('height', foamH);

  document.getElementById('cup-label-coffee').textContent = t('svgCupCoffeeBase', yieldMl);

  const modLabelGroup = document.getElementById('cup-label-mod-group');
  if (modifierMl > 0) {
    modLabelGroup.setAttribute('opacity', '1');
    const modCenterY = modY + modH / 2;
    modLabelGroup.querySelector('rect').setAttribute('y', modCenterY - 10);
    const textEl = document.getElementById('cup-label-mod');
    textEl.setAttribute('y', modCenterY + 3);
    textEl.textContent = drinkObj.modifierType === 'water'
      ? t('svgCupHotWater', modifierMl)
      : t('svgCupMilk', modifierMl);
  } else {
    modLabelGroup.setAttribute('opacity', '0');
  }

  const foamLabelGroup = document.getElementById('cup-label-foam-group');
  if (foamMl > 0) {
    foamLabelGroup.setAttribute('opacity', '1');
    const foamCenterY = Math.max(84, foamY + foamH / 2);
    foamLabelGroup.querySelector('rect').setAttribute('y', foamCenterY - 9);
    const textEl = document.getElementById('cup-label-foam');
    textEl.setAttribute('y', foamCenterY + 3);
    textEl.textContent = t('svgCupFoam', foamMl);
  } else {
    foamLabelGroup.setAttribute('opacity', '0');
  }

  // 6. РЕНДЕР ПОШАГОВОГО ПРОТОКОЛА
  renderProtocolSteps(sizeObj, drinkObj, yieldMl, modifierMl, foamMl, recommendedClicks, grinderUnit);
}

export function renderProtocolSteps(sizeObj, drinkObj, yieldMl, modifierMl, foamMl, clicks, unit) {
  const container = document.getElementById('protocol-steps-container');
  const drinkName = localizeItem(drinkObj, 'name');
  const filterStepText = state.usePaperFilter ? t('step2FilterOn') : t('step2FilterOff');

  const steps = [
    {
      title: t('step1Title'),
      desc: t('step1Desc', state.waterMl)
    },
    {
      title: t('step2Title'),
      desc: t('step2Desc', state.coffeeG.toFixed(1), clicks, unit, filterStepText)
    },
    {
      title: t('step3Title'),
      desc: t('step3Desc', yieldMl)
    }
  ];

  if (drinkObj.modifierType === 'milk') {
    steps.push({
      title: t('step4MilkTitle', drinkName),
      desc: t('step4MilkDesc', modifierMl, foamMl, yieldMl)
    });
  } else if (drinkObj.modifierType === 'water') {
    steps.push({
      title: t('step4WaterTitle'),
      desc: t('step4WaterDesc', modifierMl, yieldMl)
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
