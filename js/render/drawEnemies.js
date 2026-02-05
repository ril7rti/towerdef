export function drawEnemies(ctx, enemies) {
  for (const en of enemies) {
    ctx.save();
    ctx.fillStyle = "#ff4757";
    ctx.beginPath();
    ctx.arc(en.x, en.y, en.r, 0, Math.PI * 2);
    ctx.fill();

    const w = 30, h = 5;
    const hpRatio = Math.max(0, en.hp) / en.maxHp;

    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(en.x - w / 2, en.y - en.r - 12, w, h);

    ctx.fillStyle = "#7CFF6B";
    ctx.fillRect(en.x - w / 2, en.y - en.r - 12, w * hpRatio, h);

    ctx.restore();
  }
}
