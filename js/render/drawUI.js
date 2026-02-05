export function drawCanvasUI(ctx, state, W, H) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "16px system-ui, sans-serif";

  if (state.gameOver) {
    ctx.font = "42px system-ui, sans-serif";
    ctx.fillText("GAME OVER", W / 2 - 120, H / 2);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("リスタートを押してください", W / 2 - 105, H / 2 + 30);
  } else if (!state.waveInProgress) {
    ctx.fillText("次のウェーブを開始できます", 14, 26);
  } else {
    ctx.fillText(`ウェーブ進行中... 残り出現: ${state.spawnLeft}`, 14, 26);
  }

  ctx.restore();
}
