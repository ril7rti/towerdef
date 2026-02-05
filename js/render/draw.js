import { drawGrid } from "./drawGrid.js";
import { drawPath } from "./drawPath.js";
import { drawTowers } from "./drawTowers.js";
import { drawEnemies } from "./drawEnemies.js";
import { drawBullets } from "./drawBullets.js";
import { drawCanvasUI } from "./drawUI.js";

export function draw(ctx, state, W, H) {
  ctx.clearRect(0, 0, W, H);

  drawGrid(ctx, W, H);
  drawPath(ctx);
  drawTowers(ctx, state.towers, state.selectedTower);
  drawEnemies(ctx, state.enemies);
  drawBullets(ctx, state.bullets);
  drawCanvasUI(ctx, state, W, H);
}
