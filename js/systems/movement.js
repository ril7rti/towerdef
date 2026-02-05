import { path } from "../path.js";
import { dist } from "../utils.js";
import { syncUI } from "../state.js";

export function updateMovement(state, dt) {
  for (const en of state.enemies) {
    const a = path[en.seg];
    const b = path[en.seg + 1];
    if (!b) continue;

    const dirx = b.x - en.x;
    const diry = b.y - en.y;
    const d = Math.hypot(dirx, diry);

    if (d < 1) {
      en.seg++;
      continue;
    }

    en.x += (dirx / d) * en.speed * dt;
    en.y += (diry / d) * en.speed * dt;

    if (dist({ x: en.x, y: en.y }, b) < 8) {
      en.seg++;
      if (en.seg >= path.length - 1) {
        state.lives -= en.damage;
        en.hp = 0;

        if (state.lives <= 0) {
          state.lives = 0;
          state.gameOver = true;
        }
        syncUI(state);
      }
    }
  }
}
