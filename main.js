// main.js
"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  lives: document.getElementById("lives"),
  gold: document.getElementById("gold"),
  wave: document.getElementById("wave"),
  towerCost: document.getElementById("towerCost"),
  startWave: document.getElementById("startWave"),
  restart: document.getElementById("restart"),
};

const W = canvas.width;
const H = canvas.height;

const CELL = 40; // グリッドサイズ
const PATH_HALF = 22; // 道の半径（配置不可判定にも使う）

// 道（ポリライン）：この点を順番に通る
const path = [
  { x: 40, y: 260 },
  { x: 240, y: 260 },
  { x: 240, y: 120 },
  { x: 520, y: 120 },
  { x: 520, y: 380 },
  { x: 820, y: 380 },
];

function dist(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// 点pから線分abへの最短距離
function pointToSegDist(p, a, b) {
  const abx = b.x - a.x, aby = b.y - a.y;
  const apx = p.x - a.x, apy = p.y - a.y;
  const abLen2 = abx * abx + aby * aby;
  if (abLen2 === 0) return dist(p, a);
  let t = (apx * abx + apy * aby) / abLen2;
  t = clamp(t, 0, 1);
  const closest = { x: a.x + abx * t, y: a.y + aby * t };
  return dist(p, closest);
}

// 道の上（近すぎ）ならtrue
function isOnPath(p) {
  for (let i = 0; i < path.length - 1; i++) {
    if (pointToSegDist(p, path[i], path[i + 1]) <= PATH_HALF) return true;
  }
  return false;
}

function snapToGrid(x, y) {
  const gx = Math.floor(x / CELL) * CELL + CELL / 2;
  const gy = Math.floor(y / CELL) * CELL + CELL / 2;
  return { x: gx, y: gy };
}

function sameCell(a, b) {
  return Math.floor(a.x / CELL) === Math.floor(b.x / CELL) &&
         Math.floor(a.y / CELL) === Math.floor(b.y / CELL);
}

let state;

function reset() {
  state = {
    lives: 10,
    gold: 100,
    wave: 0,
    towerCost: 50,
    enemies: [],
    towers: [],
    bullets: [],
    spawning: false,
    spawnLeft: 0,
    spawnTimer: 0,
    waveInProgress: false,
    gameOver: false,
  };
  syncUI();
}

function syncUI() {
  ui.lives.textContent = String(state.lives);
  ui.gold.textContent = String(state.gold);
  ui.wave.textContent = String(state.wave);
  ui.towerCost.textContent = String(state.towerCost);
}

function startNextWave() {
  if (state.gameOver) return;
  if (state.waveInProgress) return;

  state.wave++;
  state.waveInProgress = true;
  state.spawning = true;

  // 難易度：waveが進むと数とHPと速度が増える
  state.spawnLeft = 8 + state.wave * 2;
  state.spawnTimer = 0;

  syncUI();
}

function spawnEnemy() {
  const hp = 30 + state.wave * 10;
  const speed = 55 + state.wave * 6; // px/s
  state.enemies.push({
    x: path[0].x,
    y: path[0].y,
    hp,
    maxHp: hp,
    speed,
    seg: 0, // 現在どの線分上か
    reward: 10,
    damage: 1,
    r: 12,
  });
}

function addTower(pos) {
  if (state.gameOver) return;
  if (state.gold < state.towerCost) return;

  // 道の上は不可
  if (isOnPath(pos)) return;

  // 既に同じセルにタワーがあるなら不可
  for (const t of state.towers) {
    if (sameCell(t, pos)) return;
  }

  state.gold -= state.towerCost;
  state.towerCost = Math.min(120, state.towerCost + 5);

  state.towers.push({
    x: pos.x,
    y: pos.y,
    range: 140,
    fireRate: 0.55, // 秒
    cooldown: 0,
    damage: 12,
  });

  syncUI();
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  addTower(snapToGrid(x, y));
});

ui.startWave.addEventListener("click", startNextWave);
ui.restart.addEventListener("click", () => reset());

function update(dt) {
  if (state.gameOver) return;

  // スポーン管理
  if (state.spawning) {
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0 && state.spawnLeft > 0) {
      spawnEnemy();
      state.spawnLeft--;
      state.spawnTimer = 0.65; // 次の敵まで
    }
    if (state.spawnLeft <= 0) {
      state.spawning = false;
    }
  }

  // 敵移動
  for (const en of state.enemies) {
    const a = path[en.seg];
    const b = path[en.seg + 1];
    if (!b) continue;

    const dirx = b.x - en.x;
    const diry = b.y - en.y;
    const d = Math.hypot(dirx, diry);

    if (d < 1) {
      en.seg++;
      continue;
    }
    const vx = (dirx / d) * en.speed;
    const vy = (diry / d) * en.speed;
    en.x += vx * dt;
    en.y += vy * dt;

    // 線分終端を超えたら次へ
    if (dist({ x: en.x, y: en.y }, b) < 8) {
      en.seg++;
      if (en.seg >= path.length - 1) {
        // ゴール到達
        state.lives -= en.damage;
        en.hp = 0; // remove
        if (state.lives <= 0) {
          state.lives = 0;
          state.gameOver = true;
        }
        syncUI();
      }
    }
  }

  // タワー攻撃
  for (const t of state.towers) {
    t.cooldown -= dt;
    if (t.cooldown > 0) continue;

    // 射程内で一番近い敵
    let best = null;
    let bestD = Infinity;
    for (const en of state.enemies) {
      if (en.hp <= 0) continue;
      const d = dist(t, en);
      if (d <= t.range && d < bestD) {
        bestD = d;
        best = en;
      }
    }

    if (best) {
      t.cooldown = t.fireRate;
      // 弾を生成（見た目用）。命中は弾が当たった時に処理
      const speed = 320;
      const dx = best.x - t.x;
      const dy = best.y - t.y;
      const len = Math.hypot(dx, dy) || 1;
      state.bullets.push({
        x: t.x,
        y: t.y,
        vx: (dx / len) * speed,
        vy: (dy / len) * speed,
        r: 4,
        damage: t.damage,
        targetId: best, // 参照（簡易）
        life: 1.2, // 秒で消える
      });
    }
  }

  // 弾更新・当たり判定
  for (const b of state.bullets) {
    b.life -= dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;

    const en = b.targetId;
    if (en && en.hp > 0) {
      if (dist(b, en) <= en.r + b.r) {
        en.hp -= b.damage;
        b.life = 0;

        if (en.hp <= 0) {
          state.gold += en.reward;
          syncUI();
        }
      }
    }
  }

  // 掃除
  state.enemies = state.enemies.filter(en => en.hp > 0);
  state.bullets = state.bullets.filter(b => b.life > 0);

  // ウェーブ終了判定
  if (state.waveInProgress && !state.spawning && state.enemies.length === 0) {
    state.waveInProgress = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // 背景グリッド
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = "#1e2448";
  for (let x = 0; x <= W; x += CELL) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += CELL) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();

  // 道
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

  // タワー
  for (const t of state.towers) {
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

  // 敵
  for (const en of state.enemies) {
    ctx.save();
    ctx.fillStyle = "#ff4757";
    ctx.beginPath();
    ctx.arc(en.x, en.y, en.r, 0, Math.PI * 2);
    ctx.fill();

    // HPバー
    const w = 30, h = 5;
    const hpRatio = Math.max(0, en.hp) / en.maxHp;
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(en.x - w/2, en.y - en.r - 12, w, h);
    ctx.fillStyle = "#7CFF6B";
    ctx.fillRect(en.x - w/2, en.y - en.r - 12, w * hpRatio, h);

    ctx.restore();
  }

  // 弾
  for (const b of state.bullets) {
    ctx.save();
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // テキスト
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "16px system-ui, sans-serif";

  if (state.gameOver) {
    ctx.font = "42px system-ui, sans-serif";
    ctx.fillText("GAME OVER", W/2 - 120, H/2);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("リスタートを押してください", W/2 - 105, H/2 + 30);
  } else if (!state.waveInProgress) {
    ctx.fillText("次のウェーブを開始できます", 14, 26);
  } else {
    ctx.fillText(`ウェーブ進行中... 残り出現: ${state.spawnLeft}`, 14, 26);
  }
  ctx.restore();
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000); // 最大33ms
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

reset();
requestAnimationFrame(loop);
