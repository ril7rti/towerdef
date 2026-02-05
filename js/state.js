import {
  START_GOLD, START_LIVES,
  TOWER_COST_START
} from "./config.js";

export function createState(ui) {
  return {
    ui,
    lives: START_LIVES,
    gold: START_GOLD,
    wave: 0,
    towerCost: TOWER_COST_START,

    enemies: [],
    towers: [],
    bullets: [],

    spawning: false,
    spawnLeft: 0,
    spawnTimer: 0,
    waveInProgress: false,
    gameOver: false,
  };
}

export function syncUI(s) {
  if (!s.ui) return;
  s.ui.lives.textContent = String(s.lives);
  s.ui.gold.textContent = String(s.gold);
  s.ui.wave.textContent = String(s.wave);
  s.ui.towerCost.textContent = String(s.towerCost);
}
