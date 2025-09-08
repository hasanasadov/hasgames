import React, { useEffect, useMemo, useState } from "react";

/**
 * TicTacToe — GlassBoard (with Dynamic Pieces option)
 * - bg-star qorunur
 * - PvP / PvBot, X/O, Easy/Smart AI
 * - NEW: Dynamic pieces (max 3 per player) — 4-cü daş qoyulanda həmin oyunçunun ən köhnə daşı silinir
 * - Glassmorphism UI
 */

/* ----------------------------- helpers ------------------------------------ */
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(b) {
  for (const [a, c, d] of LINES) {
    const v = b[a];
    if (v && v === b[c] && v === b[d]) return { winner: v, line: [a, c, d] };
  }
  return null;
}
const isFull = (b) => b.every((v) => v !== null);

// --- AI: simple reliable (smart) --------------------------------------------
function emptyIdx(b) {
  return b.reduce((acc, v, i) => (v == null ? (acc.push(i), acc) : acc), []);
}
function smartMove(board, ai, human) {
  // win
  for (const [a, b, c] of LINES) {
    const line = [board[a], board[b], board[c]],
      idxs = [a, b, c];
    if (line.filter((v) => v === ai).length === 2 && line.includes(null))
      return idxs[line.indexOf(null)];
  }
  // block
  for (const [a, b, c] of LINES) {
    const line = [board[a], board[b], board[c]],
      idxs = [a, b, c];
    if (line.filter((v) => v === human).length === 2 && line.includes(null))
      return idxs[line.indexOf(null)];
  }
  if (board[4] == null) return 4;
  const corners = [0, 2, 6, 8].filter((i) => board[i] == null);
  if (corners.length)
    return corners[Math.floor(Math.random() * corners.length)];
  const sides = [1, 3, 5, 7].filter((i) => board[i] == null);
  return sides.length ? sides[Math.floor(Math.random() * sides.length)] : null;
}
function pickAiMove(board, ai, human, difficulty) {
  const e = emptyIdx(board);
  if (!e.length) return null;
  if (difficulty === "easy") return e[Math.floor(Math.random() * e.length)];
  return smartMove(board, ai, human);
}

/* ------------------------------ UI atoms ---------------------------------- */
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

function Toggle({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/15 backdrop-blur">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={[
            "px-3 py-1.5 rounded-lg text-sm font-semibold transition",
            value === o.value
              ? "bg-white text-slate-900 shadow"
              : "text-white/90 hover:text-white hover:bg-white/5",
          ].join(" ")}
          type="button"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Cell({ value, onClick, isWinning, disabled, willRemove }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={[
        "relative",
        "h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32",
        "bg-white/12 backdrop-blur-xl rounded-2xl",
        "flex items-center justify-center select-none bg-white/10",
        "border border-white/25 shadow-[inset_0_2px_8px_rgba(0,0,0,.25)]",
        "transition-transform",
        !disabled && value == null ? "hover:scale-[1.01] active:scale-95" : "",
        disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer",
        isWinning ? "ring-1 ring-emerald-400/60" : "",
      ].join(" ")}
      aria-label={value ? `Cell with ${value}` : "Empty cell"}
      title={willRemove ? "Next move: this piece will be removed" : undefined}
    >
      <span
        className={[
          "font-black drop-shadow",
          "text-5xl md:text-6xl",
          value === "X"
            ? "text-sky-300"
            : value === "O"
            ? "text-amber-300"
            : "text-white/60",
          willRemove ? "opacity-45" : "",
        ].join(" ")}
      >
        {value}
      </span>

      {willRemove && (
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-white/35 animate-pulse" />
      )}
    </button>
  );
}

/* ---------------------------- main component ------------------------------ */
export default function TicTacToeGlassBoard() {
  const [board, setBoard] = useState(Array(9).fill(null));

  const [mode, setMode] = useState("pvb"); // pvp | pvb
  const [me, setMe] = useState("X"); // you: X | O (PvB)
  const [difficulty, setDifficulty] = useState("smart"); // easy | smart

  // ✅ NEW: dynamic pieces rule
  const [dynamicOn, setDynamicOn] = useState(false);
  const [placed, setPlaced] = useState({ X: [], O: [] }); // FIFO index-lər

  // ✅ turn ayrıca state (dinamik qayda üçün vacibdir)
  const [turn, setTurn] = useState("X");

  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });

  const win = useMemo(() => getWinner(board), [board]);
  const draw = useMemo(() => !win && isFull(board), [board, win]);

  const aiColor = me === "X" ? "O" : "X";
  const isHumanTurn = mode === "pvp" ? true : turn === me;

  // 🔎 Dinamik modda növbəti silinəcək indeks
  const willRemoveIndex = useMemo(() => {
    if (!dynamicOn) return null;
    const list = placed[turn] || [];
    return list.length === 3 ? list[0] : null;
  }, [dynamicOn, placed, turn]);

  /* ----------------------------- moves ------------------------------------ */
  function applyMove(index, player) {
    if (board[index] !== null) return false;

    const next = board.slice();
    next[index] = player;

    // Dynamic FIFO: 4-cü daş → ən köhnəni sil
    const list = [...(placed[player] || []), index];
    if (dynamicOn && list.length > 3) {
      const oldest = list.shift();
      next[oldest] = null;
    }

    setBoard(next);
    setPlaced((prev) => ({ ...prev, [player]: list }));
    setTurn((p) => (p === "X" ? "O" : "X"));
    return true;
  }

  function play(i) {
    if (win || draw) return;
    if (mode === "pvb" && !isHumanTurn) return;
    applyMove(i, turn);
  }

  function newRound() {
    setBoard(Array(9).fill(null));
    setPlaced({ X: [], O: [] });
    setTurn("X");
  }

  function resetScores() {
    setScores({ X: 0, O: 0, ties: 0 });
  }

  /* ------------------------- scoreboard update ---------------------------- */
  useEffect(() => {
    if (win) setScores((s) => ({ ...s, [win.winner]: s[win.winner] + 1 }));
    else if (draw) setScores((s) => ({ ...s, ties: s.ties + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!win, draw]);

  /* ------------------------------ robot ----------------------------------- */
  useEffect(() => {
    if (mode !== "pvb" || win || draw) return;
    if (turn !== aiColor) return;

    const t = setTimeout(
      () => {
        const idx = pickAiMove(board, aiColor, me, difficulty);
        if (idx != null) applyMove(idx, aiColor);
      },
      difficulty === "easy" ? 420 : 300
    );

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, mode, turn, aiColor, me, difficulty, win, draw]);

  /* ------------------------------ UI ------------------------------------- */
  const status = win
    ? `Winner: ${win.winner}`
    : draw
    ? "It’s a tie!"
    : `Turn: ${turn}`;

  return (
    <div className="min-h-[calc(100vh-136px)] w-full text-white bg-star flex items-center justify-center p-4">
      <div className="w-full max-w-7xl space-y-6 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            TicTacToe <span className="text-white/60">GlassBoard</span>
          </h1>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={newRound}
              type="button"
              className="rounded-xl bg-white text-slate-900 px-3 py-2 font-semibold border border-white/10 shadow hover:shadow-lg active:scale-[0.98] transition"
            >
              New Round
            </button>
          </div>
        </div>

        {/* Controls + Score */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
          <GlassCard className="p-4 ">
            <div className="mb-3 text-sm uppercase tracking-wide text-white/85">
              Settings
            </div>

            {/* Game rule: Dynamic pieces */}
            <div className="mb-4">
              <div className="mb-2 text-xs uppercase tracking-wide text-white/80">
                Rule
              </div>
              <Toggle
                value={dynamicOn ? "dynamic" : "classic"}
                onChange={(v) => {
                  setDynamicOn(v === "dynamic");
                }}
                options={[
                  { value: "classic", label: "Classic (no limit)" },
                  { value: "dynamic", label: "Dynamic (max 3 / player)" },
                ]}
              />
            </div>

            {/* Play mode */}
            <div className="mb-3">
              <div className="mb-2 text-xs uppercase tracking-wide text-white/80">
                Play Mode
              </div>
              <Toggle
                value={mode}
                onChange={(v) => {
                  newRound();
                  setMode(v);
                }}
                options={[
                  { value: "pvp", label: "PvP" },
                  { value: "pvb", label: "PvBot" },
                ]}
              />
            </div>

            {/* PvBot specifics */}
            {mode === "pvb" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 text-sm uppercase tracking-wide text-white/80">
                    You Play As
                  </div>
                  <Toggle
                    value={me}
                    onChange={(v) => {
                      newRound();
                      setMe(v);
                    }}
                    options={[
                      { value: "X", label: "X" },
                      { value: "O", label: "O" },
                    ]}
                  />
                </div>
                <div>
                  <div className="mb-2 text-sm uppercase tracking-wide text-white/80">
                    Difficulty
                  </div>
                  <Toggle
                    value={difficulty}
                    onChange={(v) => {
                      newRound();
                      setDifficulty(v);
                    }}
                    options={[
                      { value: "easy", label: "Easy" },
                      { value: "smart", label: "Smart" },
                    ]}
                  />
                </div>
              </div>
            )}
          </GlassCard>

          {/* Scoreboard */}
          <GlassCard className="p-4 lg:col-span-2">
            <div className="text-sm uppercase tracking-wide text-white/85 mb-3">
              Scoreboard (All time)
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-center">
                <div className="text-xs uppercase tracking-wider text-white/80 mb-1">
                  X Wins
                </div>
                <div className="text-2xl font-black">{scores.X}</div>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-center">
                <div className="text-xs uppercase tracking-wider text-white/80 mb-1">
                  O Wins
                </div>
                <div className="text-2xl font-black">{scores.O}</div>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-center">
                <div className="text-xs uppercase tracking-wider text-white/80 mb-1">
                  Ties
                </div>
                <div className="text-2xl font-black">{scores.ties}</div>
              </div>
            </div>
            <div className="mt-3">
              <button
                onClick={resetScores}
                type="button"
                className="rounded-lg px-3 py-2 font-semibold border border-white/20 bg-white/10 hover:bg-white/15"
              >
                Reset Scores
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Board */}
        <GlassCard className="p-5 md:p-6">
          <div className="mx-auto w-fit mb-4">
            <div className="rounded-2xl px-4 py-2 text-base md:text-lg font-semibold border border-white/25 bg-white/15 backdrop-blur">
              {win
                ? `Winner: ${win.winner}`
                : draw
                ? "It’s a tie!"
                : `Turn: ${turn}`}
            </div>
          </div>

          <div className="mx-auto w-fit">
            <div
              className="grid grid-cols-3 gap-2 "
              role="grid"
              aria-label="Tic Tac Toe board"
            >
              {board.map((v, i) => (
                <Cell
                  key={i}
                  value={v}
                  onClick={() => play(i)}
                  isWinning={!!win?.line?.includes(i)}
                  disabled={!!win || !!draw || (!isHumanTurn && mode === "pvb")}
                  willRemove={
                    dynamicOn &&
                    i === willRemoveIndex &&
                    board[i] === turn && // yalnız növbəti silinəcək daş aktiv oyunçuya aiddir
                    !win &&
                    !draw
                  }
                />
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
