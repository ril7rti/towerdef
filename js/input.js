import {
  CELL, TOWER_COST_MAX, TOWER_COST_STEP
} from "./config.js";
import { isOnPath } from "./path.js";
import { sameCell, snapToGrid } from "./utils.js";
import { syncUI } from "./state.js";

export function attachInput(canvas, state) {
  canvas.addEventListener("click", (e) => {
    if (state.gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const pos = snapToGrid(x, y, CELL);
    addTower(state, pos);
  });
}

export function addTower(state, pos) {
  if (state.gameOver) return;
  if (state.gold < state.towerCost) return;
  if (isOnPath(pos)) return;

  for (const t of state.towers) {
    if (sameCell(t, pos, CELL)) return;
  }

  state.gold -= state.towerCost;
  state.towerCost = Math.min(TOWER_COST_MAX, state.towerCost + TOWER_COST_STEP);

  state.towers.push({
    x: pos.x,
    y: pos.y,
    range: 140,
    fireRate: 0.55,
    cooldown: 0,
    damage: 12,
  });

  syncUI(state);
}
