export function drawTowers(ctx, towers) {
  for (const t of towers) {
    ctx.save();
    ctx.fillStyle = "#2a66ff";
    ctx.beginPath();
    ctx.arc(t.x, t.y, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = "#9fb7ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
