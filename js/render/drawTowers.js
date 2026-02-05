export function drawTowers(ctx, towers, selectedTower) {
  for (const t of towers) {
    ctx.save();

    // 本体
    ctx.fillStyle = "#2a66ff";
    ctx.beginPath();
    ctx.arc(t.x, t.y, 14, 0, Math.PI * 2);
    ctx.fill();

    // 射程
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = "#9fb7ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
    ctx.stroke();

    // 選択枠
    if (selectedTower === t) {
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 18, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
