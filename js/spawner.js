import { path } from "./path.js";
import { syncUI } from "./state.js";

export function startNextWave(state) {
  if (state.gameOver) return;
  if (state.waveInProgress) return;

  state.wave++;
  state.waveInProgress = true;
  state.spawning = true;

  state.spawnLeft = 8 + state.wave * 2;
  state.spawnTimer = 0;

  syncUI(state);
}

export function updateSpawner(state, dt) {
  if (!state.spawning) return;

  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0 && state.spawnLeft > 0) {
    spawnEnemy(state);
    state.spawnLeft--;
    state.spawnTimer = 0.65;
  }
  if (state.spawnLeft <= 0) state.spawning = false;
}

function spawnEnemy(state) {
  const hp = 30 + state.wave * 10;
  const speed = 55 + state.wave * 6;

  state.enemies.push({
    x: path[0].x,
    y: path[0].y,
    hp,
    maxHp: hp,
    speed,
    seg: 0,
    reward: 10,
    damage: 1,
    r: 12,
  });
}
