import {
  START_GOLD, START_LIVES,
  TOWER_COST_START
} from "./config.js";

export function createState(ui) {
  const s = { ui: null };
  resetState(s, ui);
  return s;
}

export function resetState(s, ui) {
  s.ui = ui;

  s.lives = START_LIVES;
  s.gold = START_GOLD;
  s.wave = 0;
  s.towerCost = TOWER_COST_START;

  s.enemies = [];
  s.towers = [];
  s.bullets = [];

  s.selectedTower = null;

  s.spawning = false;
  s.spawnLeft = 0;
  s.spawnTimer = 0;
  s.waveInProgress = false;
  s.gameOver = false;
}

export function syncUI(s) {
  if (!s.ui) return;
  s.ui.lives.textContent = String(s.lives);
  s.ui.gold.textContent = String(s.gold);
  s.ui.wave.textContent = String(s.wave);
  s.ui.towerCost.textContent = String(s.towerCost);
}
