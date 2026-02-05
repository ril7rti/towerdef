import { CELL } from "../config.js";

export function drawGrid(ctx, W, H) {
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = "#1e2448";

  for (let x = 0; x <= W; x += CELL) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += CELL) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();
}
