import { PATH_HALF } from "../config.js";
import { path } from "../path.js";

export function drawPath(ctx) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = "#2a315a";
  ctx.lineWidth = PATH_HALF * 2;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
  ctx.stroke();

  ctx.strokeStyle = "#6d78c7";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
  ctx.stroke();

  ctx.restore();
}
