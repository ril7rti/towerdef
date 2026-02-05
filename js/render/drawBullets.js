export function drawBullets(ctx, bullets) {
  for (const b of bullets) {
    ctx.save();
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
