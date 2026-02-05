import { BULLET_SPEED } from "../config.js";
import { dist } from "../utils.js";
import { syncUI } from "../state.js";

export function updateCombat(state, dt) {
  // タワー発射
  for (const t of state.towers) {
    t.cooldown -= dt;
    if (t.cooldown > 0) continue;

    let best = null;
    let bestD = Infinity;

    for (const en of state.enemies) {
      if (en.hp <= 0) continue;
      const d = dist(t, en);
      if (d <= t.range && d < bestD) {
        bestD = d;
        best = en;
      }
    }

    if (best) {
      t.cooldown = t.fireRate;
      const dx = best.x - t.x;
      const dy = best.y - t.y;
      const len = Math.hypot(dx, dy) || 1;

      state.bullets.push({
        x: t.x,
        y: t.y,
        vx: (dx / len) * BULLET_SPEED,
        vy: (dy / len) * BULLET_SPEED,
        r: 4,
        damage: t.damage,
        targetRef: best,
        life: 1.2,
      });
    }
  }

  // 弾更新・命中
  for (const b of state.bullets) {
    b.life -= dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;

    const en = b.targetRef;
    if (en && en.hp > 0) {
      if (dist(b, en) <= en.r + b.r) {
        en.hp -= b.damage;
        b.life = 0;

        if (en.hp <= 0) {
          state.gold += en.reward;
          syncUI(state);
        }
      }
    }
  }
}
