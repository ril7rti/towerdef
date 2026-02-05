export function updateCleanup(state) {
  state.enemies = state.enemies.filter(en => en.hp > 0);
  state.bullets = state.bullets.filter(b => b.life > 0);

  if (state.waveInProgress && !state.spawning && state.enemies.length === 0) {
    state.waveInProgress = false;
  }
}
