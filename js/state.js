export const DEFAULT_STATE = {
  mokaSize: 2,
  drinkId: 'espresso',
  coffeeG: 12.0,
  waterMl: 70,
  ratioLocked: false,
  lockedRatioValue: 70 / 12.0,
  grinderId: 'timemore_c3',
  roastId: 'medium_blend',
  usePaperFilter: false
};

export const state = { ...DEFAULT_STATE };

export function updateState(patch) {
  Object.assign(state, patch);
}

export function resetState() {
  Object.assign(state, DEFAULT_STATE);
}
