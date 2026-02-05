import {
  CELL,
  TOWER_COST_MAX,
  TOWER_COST_STEP
} from "./config.js";

import { isOnPath } from "./path.js";
import { dist, sameCell, snapToGrid } from "./utils.js";
import { syncUI } from "./state.js";

/* =========================
   強化コスト（固定・簡易）
========================= */
const UPGRADE_COST_DAMAGE = 40;
const UPGRADE_COST_RANGE  = 35;

/* =========================
   入力イベント登録
========================= */
export function attachInput(canvas, state) {

  /* ---- マウスクリック ---- */
  canvas.addEventListener("click", (e) => {
    if (state.gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top)  * (canvas.height / rect.height);

    // ① まずタワー選択を試す
    const clicked = { x, y };
    const tower = findTowerNear(state, clicked, 18);
    if (tower) {
      state.selectedTower = tower;
      return;
    }

    // ② タワーが無ければ新規配置
    const pos = snapToGrid(x, y, CELL);
    addTower(state, pos);
  });

  /* ---- キーボード操作 ---- */
  window.addEventListener("keydown", (e) => {
    if (state.gameOver) return;
    if (!state.selectedTower) return;

    const key = e.key.toLowerCase();
    if (key === "u") upgradeDamage(state);
    if (key === "i") upgradeRange(state);
  });
}

/* =========================
   タワー選択判定
========================= */
function findTowerNear(state, p, radius) {
  let best = null;
  let bestDist = Infinity;

  for (const t of state.towers) {
    const d = dist(t, p);
    if (d <= radius && d < bestDist) {
      bestDist = d;
      best = t;
    }
  }
  return best;
}

/* =========================
   タワー配置
========================= */
export function addTower(state, pos) {
  if (state.gameOver) return;
  if (state.gold < state.towerCost) return;
  if (isOnPath(pos)) return;

  // 同じマスに既にタワーがあるか
  for (const t of state.towers) {
    if (sameCell(t, pos, CELL)) return;
  }

  state.gold -= state.towerCost;
  state.towerCost = Math.min(
    TOWER_COST_MAX,
    state.towerCost + TOWER_COST_STEP
  );

  const newTower = {
    x: pos.x,
    y: pos.y,
    range: 140,
    fireRate: 0.55,
    cooldown: 0,
    damage: 12,

    // 強化レベル（表示・拡張用）
    lvlDmg: 0,
    lvlRng: 0,
  };

  state.towers.push(newTower);

  // 置いたタワーを自動選択
  state.selectedTower = newTower;

  syncUI(state);
}

/* =========================
   強化：攻撃力
========================= */
function upgradeDamage(state) {
  const t = state.selectedTower;
  if (!t) return;
  if (state.gold < UPGRADE_COST_DAMAGE) return;

  state.gold -= UPGRADE_COST_DAMAGE;
  t.damage += 5;
  t.lvlDmg++;

  syncUI(state);
}

/* =========================
   強化：射程
========================= */
function upgradeRange(state) {
  const t = state.selectedTower;
  if (!t) return;
  if (state.gold < UPGRADE_COST_RANGE) return;

  state.gold -= UPGRADE_COST_RANGE;
  t.range += 18;
  t.lvlRng++;

  syncUI(state);
}
