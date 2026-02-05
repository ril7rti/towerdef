"use strict";

import { CANVAS_W, CANVAS_H, DT_MAX } from "./config.js";
import { createState, syncUI, resetState } from "./state.js";
import { attachInput } from "./input.js";
import { startNextWave, updateSpawner } from "./spawner.js";
import { updateMovement } from "./systems/movement.js";
import { updateCombat } from "./systems/combat.js";
import { updateCleanup } from "./systems/cleanup.js";
import { draw } from "./render/draw.js";

console.log("main.js loaded");

const canvas = document.getElementById("game");
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;
const ctx = canvas.getContext("2d");

const ui = {
  lives: document.getElementById("lives"),
  gold: document.getElementById("gold"),
  wave: document.getElementById("wave"),
  towerCost: document.getElementById("towerCost"),
  startWave: document.getElementById("startWave"),
  restart: document.getElementById("restart"),
};


let state = createState(ui);
syncUI(state);

attachInput(canvas, state);

ui.restart.addEventListener("click", () => {
  resetState(state, ui);  // ★ stateを差し替えない
  syncUI(state);
});

let last = performance.now();
function loop(now) {
  const dt = Math.min(DT_MAX, (now - last) / 1000);
  last = now;

  if (!state.gameOver) {
    updateSpawner(state, dt);
    updateMovement(state, dt);
    updateCombat(state, dt);
    updateCleanup(state);
  }

  draw(ctx, state, canvas.width, canvas.height);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

