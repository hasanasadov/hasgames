import React, { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------- tiny UI atoms (Connect4 style) ------------------ */
const PrimaryBtn = ({ className = "", ...props }) => (
  <button
    {...props}
    className={[
      "rounded-xl px-3 py-2 font-semibold",
      "bg-white/90 text-slate-900 border border-white/40",
      "shadow hover:shadow-lg active:scale-[0.98] transition",
      className,
    ].join(" ")}
  />
);

const GhostBtn = ({ className = "", ...props }) => (
  <button
    {...props}
    className={[
      "rounded-xl px-3 py-2 font-semibold",
      "border border-white/40 bg-white/20 hover:bg-white/30 text-white",
      "backdrop-blur",
      className,
    ].join(" ")}
  />
);

const GlassCard = ({ className = "", children }) => (
  <div
    className={[
      "relative rounded-3xl border border-white/40 bg-white/20",
      "backdrop-blur-2xl backdrop-saturate-150",
      "shadow-2xl [box-shadow:inset_0_1px_0_rgba(255,255,255,0.6),0_16px_50px_rgba(0,0,0,0.35)]",
      className,
    ].join(" ")}
  >
    <div className="pointer-events-none absolute -top-8 left-8 w-40 h-40 rounded-full bg-white/20 blur-3xl" />

    {/* <div className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-white/15" /> */}
    {children}
  </div>
);

/* ------------------------------- helpers ----------------------------------- */
const NEI = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function makeEmptyBoard(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      mine: false,
      flagged: false,
      revealed: false,
      adj: 0,
    }))
  );
}

function placeMines(board, density) {
  const size = board.length;
  const total = Math.round(size * size * density);
  let placed = 0;
  while (placed < total) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
  return total;
}

function recalcAdj(board) {
  const n = board.length;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c].mine) {
        board[r][c].adj = 0;
        continue;
      }
      let count = 0;
      for (const [dr, dc] of NEI) {
        const rr = r + dr,
          cc = c + dc;
        if (rr >= 0 && rr < n && cc >= 0 && cc < n && board[rr][cc].mine)
          count++;
      }
      board[r][c].adj = count;
    }
  }
}

/** First-click safe: kliklənən hücrə minadırsa başqa boş yerə köçür. */
function ensureSafeAt(board, r, c) {
  if (!board[r][c].mine) return;
  const n = board.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (!board[i][j].mine && !(i === r && j === c)) {
        board[i][j].mine = true;
        board[r][c].mine = false;
        recalcAdj(board);
        return;
      }
    }
  }
}

/** adj=0 üçün flood-reveal */
function floodReveal(board, sr, sc) {
  const n = board.length;
  const stack = [[sr, sc]];
  const seen = new Set();
  const key = (r, c) => `${r},${c}`;
  while (stack.length) {
    const [r, c] = stack.pop();
    const k = key(r, c);
    if (seen.has(k)) continue;
    seen.add(k);

    const cell = board[r][c];
    if (cell.revealed || cell.flagged) continue;

    cell.revealed = true;
    if (cell.adj === 0) {
      for (const [dr, dc] of NEI) {
        const rr = r + dr,
          cc = c + dc;
        if (rr >= 0 && rr < n && cc >= 0 && cc < n) {
          const nb = board[rr][cc];
          if (!nb.revealed && !nb.flagged) stack.push([rr, cc]);
        }
      }
    }
  }
}

/* -------------------------------- component -------------------------------- */
export default function MineField() {
  // Input (pending) values
  const [size, setSize] = useState(8); // 3..20
  const [density, setDensity] = useState(0.18); // 0.12 / 0.18 / 0.24

  // Active game state (only changes on Apply/New Game)
  const [board, setBoard] = useState(() => makeEmptyBoard(8));
  const [totalMines, setTotalMines] = useState(0);

  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [timer, setTimer] = useState(0);

  // 📱 Flag Mode (mobil üçün)
  const [flagMode, setFlagMode] = useState(false);

  // 🔵 long-press üçün ref
  const touchRef = useRef({ t: null, consumed: false });

  // Timer
  useEffect(() => {
    if (!started || gameOver) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [started, gameOver]);

  // Flags & derived
  const flags = useMemo(
    () => board.flat().filter((c) => c.flagged).length,
    [board]
  );
  const minesLeft = Math.max(totalMines - flags, 0);

  function newGame(newSize = size, newDensity = density) {
    const s = clamp(newSize, 3, 20);
    const b = makeEmptyBoard(s);
    const tm = placeMines(b, newDensity);
    recalcAdj(b);
    setBoard(b);
    setTotalMines(tm);
    setStarted(false);
    setGameOver(false);
    setWin(false);
    setTimer(0);
  }

  // İlk renderdə board qur
  useEffect(() => {
    newGame(size, density);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------- IMPORTANT: No auto-apply on size/difficulty changes ----------
  // Size/density input-ları sadəcə state-də saxlanır.
  // Board və totalMines yalnız Apply / New Game basanda yenilənir.

  // Actions
  function revealLeft(r, c) {
    if (gameOver) return;

    const next = board.map((row) => row.map((cell) => ({ ...cell })));

    // start on first reveal
    if (!started) {
      ensureSafeAt(next, r, c);
      setStarted(true);
    }

    const cell = next[r][c];
    if (cell.flagged || cell.revealed) return;

    if (cell.mine) {
      // reveal all mines
      next.forEach((row) =>
        row.forEach((c2) => {
          if (c2.mine) c2.revealed = true;
        })
      );
      setBoard(next);
      setGameOver(true);
      setWin(false);
      return;
    }

    if (cell.adj === 0) floodReveal(next, r, c);
    else next[r][c].revealed = true;

    // Win check
    const safe = next.flat().filter((c2) => !c2.mine).length;
    const opened = next.flat().filter((c2) => c2.revealed && !c2.mine).length;

    setBoard(next);
    if (opened === safe) {
      next.forEach((row) =>
        row.forEach((c2) => (c2.mine ? (c2.revealed = true) : null))
      );
      setBoard(next);
      setGameOver(true);
      setWin(true);
    }
  }

  function toggleFlag(r, c) {
    if (gameOver) return;
    const next = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = next[r][c];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    setBoard(next);
  }

  // Desktop sağ klik
  function handleContextMenu(e, r, c) {
    e.preventDefault();
    toggleFlag(r, c);
  }

  // Touch (long-press)
  function handleTouchStart(r, c) {
    if (touchRef.current.t) clearTimeout(touchRef.current.t);
    touchRef.current.consumed = false;
    touchRef.current.t = setTimeout(() => {
      toggleFlag(r, c);
      touchRef.current.consumed = true;
    }, 450);
  }
  function handleTouchMove() {
    if (touchRef.current.t) {
      clearTimeout(touchRef.current.t);
      touchRef.current.t = null;
      touchRef.current.consumed = true;
    }
  }
  function handleTouchEnd(r, c) {
    if (touchRef.current.t) {
      clearTimeout(touchRef.current.t);
      touchRef.current.t = null;
    }
    if (!touchRef.current.consumed) {
      if (flagMode) toggleFlag(r, c);
      else revealLeft(r, c);
    }
  }

  const statusText = gameOver
    ? win
      ? "You win! 🎉"
      : "Boom! 💥"
    : started
    ? "Good luck!"
    : "Set size & difficulty, then Apply / New Game";

  return (
    <div className="min-h-[calc(100vh-136px)] w-full bg-star text-white flex items-center justify-center p-4">
      <div className="w-full max-w-7xl space-y-6 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Mine<span className="text-white/60">field</span>
          </h1>
          <div className="flex items-center gap-2">
            <PrimaryBtn onClick={() => newGame()}>New Game</PrimaryBtn>
            <GhostBtn onClick={() => newGame(size, density)}>Apply</GhostBtn>
          </div>
        </div>

        {/* Status + Info */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div
            className={[
              "rounded-3xl border border-white/30 bg-white/20",
              "backdrop-blur-2xl backdrop-saturate-150",
              "shadow-xl [box-shadow:inset_0_1px_0_rgba(255,255,255,0.55),0_12px_40px_rgba(0,0,0,0.25)]",
              "px-4 py-3",
            ].join(" ")}
          >
            <div className="text-base md:text-lg font-semibold">
              {statusText}
            </div>
          </div>

          <div className="rounded-full px-3 py-1.5 border border-white/20 bg-white/10 backdrop-blur text-sm">
            Mines left: <span className="font-semibold">{minesLeft}</span>
          </div>

          <div className="rounded-full px-3 py-1.5 border border-white/20 bg-white/10 backdrop-blur text-sm">
            🖱️ Right-click = 🚩 Flag • 📱 Long-press or use
            <button
              onClick={() => setFlagMode((f) => !f)}
              className={[
                "ml-2 rounded-lg px-2 py-1 text-xs font-semibold border",
                flagMode
                  ? "bg-white text-slate-900 border-white/10"
                  : "bg-white/10 border-white/25",
              ].join(" ")}
              type="button"
              title="Flag Mode"
            >
              Flag Mode {flagMode ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GlassCard className="p-4">
            <div className="text-sm uppercase tracking-wide text-white/85 mb-3">
              Settings
            </div>

            <div className="grid gap-4">
              {/* Size */}
              <div>
                <div className="text-xs uppercase tracking-wide text-white/80 mb-1">
                  Size
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={3}
                    max={20}
                    value={size}
                    onChange={(e) =>
                      setSize(clamp(parseInt(e.target.value || "0", 10), 3, 20))
                    }
                    className="w-24 rounded-lg px-3 py-2 bg-white/10 border border-white/25 backdrop-blur text-white text-center"
                  />
                  <GhostBtn onClick={() => newGame(size, density)}>
                    Apply
                  </GhostBtn>
                </div>
                <div className="mt-1 text-xs text-white/70">
                  Changes are applied only when you press <b>Apply</b> or{" "}
                  <b>New Game</b>.
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <div className="text-xs uppercase tracking-wide text-white/80 mb-1">
                  Difficulty (Mines)
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: "Easy", val: 0.12 },
                    { label: "Normal", val: 0.18 },
                    { label: "Hard", val: 0.24 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setDensity(opt.val)}
                      className={[
                        "rounded-lg px-3 py-1.5 text-sm font-semibold",
                        "border border-white/25",
                        density === opt.val
                          ? "bg-white text-slate-900"
                          : "bg-white/10 hover:bg-white/15 text-white",
                      ].join(" ")}
                      type="button"
                    >
                      {opt.label}
                    </button>
                  ))}
                  <GhostBtn onClick={() => newGame(size, density)}>
                    Apply
                  </GhostBtn>
                </div>
                <div className="mt-1 text-xs text-white/70">
                  Mine count preview does not change until you press{" "}
                  <b>Apply</b>.
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Stats */}
          <GlassCard className="p-4 lg:col-span-2">
            <div className="text-sm uppercase tracking-wide text-white/85 mb-3">
              Stats
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-center">
                <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
                  Mines
                </div>
                <div className="text-2xl font-black">{totalMines}</div>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-center">
                <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
                  Flags
                </div>
                <div className="text-2xl font-black">{flags}</div>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-center">
                <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
                  Time
                </div>
                <div className="text-2xl font-black">{timer}s</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Board */}
        <GlassCard className="p-4 md:p-5">
          <div className="mx-auto" onContextMenu={(e) => e.preventDefault()}>
            <div
              className="grid gap-px bg-white/30 rounded-2xl overflow-hidden mx-auto max-w-fit"
              style={{
                gridTemplateColumns: `repeat(${board.length || 1}, 2.5rem)`,
              }}
              role="grid"
              aria-label="Minefield board"
            >
              {board.map((row, r) =>
                row.map((cell, c) => {
                  const revealed = cell.revealed;
                  const cls = [
                    "relative aspect-square",
                    "flex items-center justify-center select-none",
                    "text-base md:text-lg font-bold",
                    "transition",
                    !revealed
                      ? "bg-white/12 border border-white/30 backdrop-blur-xl hover:bg-white/18 cursor-pointer"
                      : "bg-white/20 border border-white/30",
                    gameOver && cell.mine ? "bg-red-500/70 text-white" : "",
                  ].join(" ");

                  const numColor =
                    cell.adj === 1
                      ? "text-sky-300"
                      : cell.adj === 2
                      ? "text-emerald-300"
                      : cell.adj === 3
                      ? "text-rose-300"
                      : cell.adj === 4
                      ? "text-purple-300"
                      : cell.adj >= 5
                      ? "text-amber-300"
                      : "text-white/90";

                  return (
                    <button
                      key={`${r}-${c}`}
                      className={cls}
                      onClick={() =>
                        flagMode ? toggleFlag(r, c) : revealLeft(r, c)
                      }
                      onContextMenu={(e) => handleContextMenu(e, r, c)}
                      onTouchStart={() => handleTouchStart(r, c)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={() => handleTouchEnd(r, c)}
                      aria-label={`Cell ${r + 1},${c + 1}`}
                      title="Left-click: reveal • Right-click/long-press: flag"
                    >
                      {revealed ? (
                        cell.mine ? (
                          "💣"
                        ) : cell.adj > 0 ? (
                          <span className={`drop-shadow ${numColor}`}>
                            {cell.adj}
                          </span>
                        ) : (
                          ""
                        )
                      ) : cell.flagged ? (
                        "🚩"
                      ) : (
                        ""
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
