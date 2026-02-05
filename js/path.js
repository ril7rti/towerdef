import { PATH_HALF } from "./config.js";
import { pointToSegDist } from "./utils.js";

export const path = [
  { x: 40, y: 260 },
  { x: 240, y: 260 },
  { x: 240, y: 120 },
  { x: 520, y: 120 },
  { x: 520, y: 380 },
  { x: 820, y: 380 },
];

export function isOnPath(p) {
  for (let i = 0; i < path.length - 1; i++) {
    if (pointToSegDist(p, path[i], path[i + 1]) <= PATH_HALF) return true;
  }
  return false;
}
