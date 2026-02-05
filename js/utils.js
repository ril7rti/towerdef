export function dist(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// 点pから線分abへの最短距離
export function pointToSegDist(p, a, b) {
  const abx = b.x - a.x, aby = b.y - a.y;
  const apx = p.x - a.x, apy = p.y - a.y;
  const abLen2 = abx * abx + aby * aby;
  if (abLen2 === 0) return dist(p, a);
  let t = (apx * abx + apy * aby) / abLen2;
  t = clamp(t, 0, 1);
  const closest = { x: a.x + abx * t, y: a.y + aby * t };
  return dist(p, closest);
}

export function sameCell(a, b, cellSize) {
  return Math.floor(a.x / cellSize) === Math.floor(b.x / cellSize) &&
         Math.floor(a.y / cellSize) === Math.floor(b.y / cellSize);
}

export function snapToGrid(x, y, cellSize) {
  const gx = Math.floor(x / cellSize) * cellSize + cellSize / 2;
  const gy = Math.floor(y / cellSize) * cellSize + cellSize / 2;
  return { x: gx, y: gy };
}
