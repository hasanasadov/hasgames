import React, { useEffect, useMemo, useRef, useState } from "react";

// --- helpers -----------------------------------------------------------------
const ROWS = 6;
const COLS = 7;

const createEmptyBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const dirs = [
  [1, 0], // →
  [0, 1], // ↓
  [1, 1], // ↘
  [1, -1], // ↗
];

const inBounds = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;

function getDropRow(board, col) {
  for (let r = ROWS - 1; r >= 0; r--) if (board[r][col] == null) return r;
  return -1;
}

/** Win checker: {winner:'red'|'blue', line:[[r,c]...]} | null */
function checkWin(board, row, col, player) {
  for (const [dx, dy] of dirs) {
    let line = [[row, col]];
    // back
    for (let s = 1; s < 4; s++) {
      const r = row - dy * s,
        c = col - dx * s;
      if (inBounds(r, c) && board[r][c] === player) line.unshift([r, c]);
      else break;
    }
    // forward
    for (let s = 1; s < 4; s++) {
      const r = row + dy * s,
        c = col + dx * s;
      if (inBounds(r, c) && board[r][c] === player) line.push([r, c]);
      else break;
    }
    if (line.length >= 4) return { winner: player, line };
  }
  return null;
}

const isBoardFull = (b) => b.every((row) => row.every((v) => v !== null));
const cloneBoard = (b) => b.map((row) => row.slice());

// --- AI (easy/smart) ---------------------------------------------------------
function validCols(board) {
  const v = [];
  for (let c = 0; c < COLS; c++) if (getDropRow(board, c) !== -1) v.push(c);
  return v;
}

function simulate(board, col, player) {
  const r = getDropRow(board, col);
  if (r === -1) return { next: null, row: -1, win: null };
  const next = cloneBoard(board);
  next[r][col] = player;
  return { next, row: r, win: checkWin(next, r, col, player) };
}

function immediateLosing(board, col, me, opp) {
  // If I play col, can opponent immediately win next?
  const { next } = simulate(board, col, me);
  if (!next) return true;
  for (const oc of validCols(next)) {
    const { win } = simulate(next, oc, opp);
    if (win) return true;
  }
  return false;
}

function pickAi(board, me, opp, diff = "smart") {
  const candidates = validCols(board);
  if (!candidates.length) return null;

  if (diff === "easy") {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // 1) Win now
  for (const c of candidates) {
    const { win } = simulate(board, c, me);
    if (win) return c;
  }
  // 2) Block opp's win
  for (const c of candidates) {
    const { win } = simulate(board, c, opp);
    if (win) return c;
  }
  // 3) Prefer center
  if (candidates.includes(3)) return 3;

  // 4) Prefer near-center ordering
  const order = [3, 2, 4, 1, 5, 0, 6];
  const sorted = order.filter((c) => candidates.includes(c));

  // 5) Avoid immediate losing if possible
  const safe = sorted.filter((c) => !immediateLosing(board, c, me, opp));
  return (safe.length ? safe : sorted)[0] ?? candidates[0];
}

// --- tiny UI atoms (glass buttons) -------------------------------------------
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

// --- main component -----------------------------------------------------------
export default function ConnectFour() {
  const [board, setBoard] = useState(createEmptyBoard);
  const [turn, setTurn] = useState("red"); // 'red' | 'blue'
  const [result, setResult] = useState(null); // {winner,line} | {draw:true} | null
  const [hoverCol, setHoverCol] = useState(null);
  const [lastMove, setLastMove] = useState(null); // [r,c]
  const [moves, setMoves] = useState([]); // [{r,c,color}]
  const [mode, setMode] = useState("pvb"); // 'pvp' | 'pvb'
  const [me, setMe] = useState("red"); // 'red' | 'blue' (only PvB)
  const [diff, setDiff] = useState("smart"); // 'easy' | 'smart'
  const [scores, setScores] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("cf_scores") || '{"red":0,"blue":0,"ties":0}'
      );
    } catch {
      return { red: 0, blue: 0, ties: 0 };
    }
  });
  const boardRef = useRef(null);

  const statusText = useMemo(() => {
    if (!result) return `Next: ${turn === "red" ? "Red" : "Blue"}`;
    if (result.draw) return "It’s a tie!";
    return `${result.winner === "red" ? "Red" : "Blue"} wins!`;
  }, [result, turn]);

  const winningLine = result?.line ?? [];
  const isFinished = Boolean(result && (result.winner || result.draw));

  function applyMove(col, color) {
    const row = getDropRow(board, col);
    if (row === -1) return false;

    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = color;

    const win = checkWin(nextBoard, row, col, color);
    const draw = !win && isBoardFull(nextBoard);

    setBoard(nextBoard);
    setLastMove([row, col]);
    setMoves((m) => [...m, { r: row, c: col, color }]);

    if (win) setResult({ winner: color, line: win.line });
    else if (draw) setResult({ draw: true });
    else setTurn((t) => (t === "red" ? "blue" : "red"));
    return true;
  }

  function dropInColumn(col) {
    if (isFinished) return;
    applyMove(col, turn);
  }

  function newRound(startTurn = "red") {
    setBoard(createEmptyBoard());
    setTurn(startTurn);
    setResult(null);
    setHoverCol(null);
    setLastMove(null);
    setMoves([]);
  }

  function resetGame() {
    newRound("red");
  }

  function undo() {
    if (!moves.length || isFinished) {
      // if finished, allow undo to continue anyway
      if (!moves.length) return;
      setResult(null);
    }
    const last = moves[moves.length - 1];
    const b = cloneBoard(board);
    b[last.r][last.c] = null;
    setBoard(b);
    setMoves((m) => m.slice(0, -1));
    setTurn(last.color); // back to the player who made the undone move
    setLastMove(
      moves.length > 1
        ? [moves[moves.length - 2].r, moves[moves.length - 2].c]
        : null
    );
  }

  // scoreboard persist (update only when result set)
  useEffect(() => {
    if (!result) return;
    setScores((s) => {
      const ns = { ...s };
      if (result.draw) ns.ties += 1;
      else if (result.winner) ns[result.winner] += 1;
      localStorage.setItem("cf_scores", JSON.stringify(ns));
      return ns;
    });
  }, [result]);

  // PvB: bot move when it's bot's turn
  useEffect(() => {
    if (mode !== "pvb" || isFinished) return;
    const botColor = me === "red" ? "blue" : "red";
    if (turn !== botColor) return;

    const t = setTimeout(
      () => {
        const col = pickAi(board, botColor, me, diff);
        if (col != null) applyMove(col, botColor);
      },
      diff === "easy" ? 380 : 260
    );

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, turn, mode, me, diff, isFinished]);

  // If PvB and user plays Blue + new round with Blue starting → bot starts
  useEffect(() => {
    if (mode !== "pvb") return;
    const botColor = me === "red" ? "blue" : "red";
    if (turn !== botColor || isFinished || moves.length > 0) return;

    const id = setTimeout(() => {
      const col = pickAi(board, botColor, me, diff);
      if (col != null) applyMove(col, botColor);
    }, 220);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, me]);

  // keyboard control
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (isFinished) return;
      if (["ArrowLeft", "ArrowRight", "Enter", " "].includes(e.key))
        e.preventDefault();
      if (e.key === "ArrowLeft")
        setHoverCol((c) => (c == null ? 0 : Math.max(0, c - 1)));
      if (e.key === "ArrowRight")
        setHoverCol((c) => (c == null ? 0 : Math.min(COLS - 1, c + 1)));
      if (e.key === "Enter" || e.key === " ") dropInColumn(hoverCol ?? 0);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [hoverCol, isFinished]);

  const statusTone = result?.winner
    ? "bg-emerald-400/15 border-emerald-300/30 text-emerald-200"
    : result?.draw
    ? "bg-fuchsia-400/10 border-fuchsia-300/30 text-fuchsia-200"
    : "bg-white/10 border-white/20 text-white";

  return (
    <div className="min-h-[calc(100vh-136px)] w-full bg-star text-white flex items-center justify-center p-4">
      <div className="w-full max-w-7xl space-y-6 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Connect <span className="text-white/60">4</span>
          </h1>
          <div className="flex items-center gap-2">
            <GhostBtn onClick={undo} title="Undo last move">
              Undo
            </GhostBtn>
            <PrimaryBtn onClick={resetGame}>New Round</PrimaryBtn>
          </div>
        </div>

        {/* Settings + Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-white/30 bg-white/20 backdrop-blur-2xl backdrop-saturate-150 shadow-xl p-4">
            <div className="text-sm uppercase tracking-wide text-white/90 mb-3">
              Settings
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Mode */}
              <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/15 backdrop-blur">
                {["pvp", "pvb"].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      newRound("red");
                      setMode(m);
                    }}
                    className={[
                      "px-3 py-1.5 rounded-lg text-sm font-semibold transition",
                      mode === m
                        ? "bg-white text-slate-900 shadow"
                        : "text-white/90 hover:text-white hover:bg-white/5",
                    ].join(" ")}
                    type="button"
                  >
                    {m === "pvp" ? "PvP" : "PvBot"}
                  </button>
                ))}
              </div>

              {/* You play as (PvB only) */}
              {mode === "pvb" && (
                <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/15 backdrop-blur">
                  {["red", "blue"].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setMe(c);
                        newRound(
                          c === "red" ? "red" : "red"
                        ); /* round red starts; bot may auto-start if me=blue */
                      }}
                      className={[
                        "px-3 py-1.5 rounded-lg text-sm font-semibold transition",
                        me === c
                          ? "bg-white text-slate-900 shadow"
                          : "text-white/90 hover:text-white hover:bg-white/5",
                      ].join(" ")}
                      type="button"
                    >
                      You: {c === "red" ? "Red" : "Blue"}
                    </button>
                  ))}
                </div>
              )}

              {/* Difficulty (PvB) */}
              {mode === "pvb" && (
                <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/15 backdrop-blur">
                  {["easy", "smart"].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDiff(d);
                        newRound("red");
                      }}
                      className={[
                        "px-3 py-1.5 rounded-lg text-sm font-semibold transition",
                        diff === d
                          ? "bg-white text-slate-900 shadow"
                          : "text-white/90 hover:text-white hover:bg-white/5",
                      ].join(" ")}
                      type="button"
                    >
                      {d === "easy" ? "Easy" : "Smart"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/30 bg-white/20 backdrop-blur-2xl backdrop-saturate-150 shadow-xl p-4 lg:col-span-2">
            <div className="text-sm uppercase tracking-wide text-white/90 mb-3">
              Scoreboard
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/30 bg-white/20 backdrop-blur p-4 text-center">
                <div className="text-xs uppercase tracking-wider text-white/90 mb-1">
                  Red Wins
                </div>
                <div className="text-2xl font-black">{scores.red}</div>
              </div>
              <div className="rounded-xl border border-white/30 bg-white/20 backdrop-blur p-4 text-center">
                <div className="text-xs uppercase tracking-wider text-white/90 mb-1">
                  Blue Wins
                </div>
                <div className="text-2xl font-black">{scores.blue}</div>
              </div>
              <div className="rounded-xl border border-white/30 bg-white/20 backdrop-blur p-4 text-center">
                <div className="text-xs uppercase tracking-wider text-white/90 mb-1">
                  Ties
                </div>
                <div className="text-2xl font-black">{scores.ties}</div>
              </div>
            </div>
            <div className="mt-3">
              <GhostBtn
                onClick={() => {
                  const ns = { red: 0, blue: 0, ties: 0 };
                  setScores(ns);
                  localStorage.setItem("cf_scores", JSON.stringify(ns));
                }}
              >
                Reset Scores
              </GhostBtn>
            </div>
          </div>
        </div>

        {/* Status */}
        <div
          className={[
            "rounded-3xl border px-4 py-3 w-fit mx-auto",
            "backdrop-blur-2xl backdrop-saturate-150",
            statusTone,
          ].join(" ")}
        >
          <div className="text-base md:text-lg font-semibold">{statusText}</div>
          <div className="text-[12px] md:text-xs text-white/70 mt-1 text-center">
            Tip: Klaviatura ilə ◀ ▶ seç, Enter/Space ilə at.
          </div>
        </div>

        {/* Board */}
        <div
          ref={boardRef}
          tabIndex={0}
          className={[
            "relative mx-auto focus:outline-none",
            "rounded-3xl border border-white/40 bg-white/25",
            "backdrop-blur-2xl backdrop-saturate-150",
            "shadow-2xl [box-shadow:inset_0_1px_0_rgba(255,255,255,0.6),0_16px_50px_rgba(0,0,0,0.35)]",
            "p-3 md:p-4",
          ].join(" ")}
          role="grid"
          aria-label="Connect Four board"
        >
          {/* glare highlight */}
          <div className="pointer-events-none absolute -top-8 left-8 w-40 h-40 rounded-full bg-white/20 blur-3xl" />

          {/* columns hover area */}
          <div className="grid grid-cols-7 gap-x-3 gap-y-2 md:gap-y-3 w-fit mx-auto">
            {Array.from({ length: COLS }).map((_, col) => {
              const ghostRow =
                hoverCol === col && !isFinished ? getDropRow(board, col) : -1;
              return (
                <div
                  key={`col-${col}`}
                  className="flex flex-col gap-2 md:gap-3 w-fit"
                  onMouseEnter={() => setHoverCol(col)}
                  onMouseLeave={() => setHoverCol(null)}
                  onClick={() => dropInColumn(col)}
                  role="button"
                  aria-label={`Drop in column ${col + 1}`}
                >
                  {/* top hover indicator */}
                  <div className="h-6 md:h-7 flex items-center justify-center ">
                    <span
                      className={[
                        "inline-block rounded-full transition-transform",
                        hoverCol === col && !isFinished
                          ? "scale-100"
                          : "scale-0",
                        turn === "red" ? "bg-red-400" : "bg-blue-400",
                        "shadow",
                        "w-4 h-4 md:w-5 md:h-5",
                      ].join(" ")}
                    />
                  </div>

                  {/* cells in this column */}
                  {Array.from({ length: ROWS }).map((_, r) => {
                    const cell = board[r][col];
                    const isWin = winningLine.some(
                      ([rr, cc]) => rr === r && cc === col
                    );
                    const isLast =
                      lastMove && lastMove[0] === r && lastMove[1] === col;

                    return (
                      <div
                        key={`cell-${r}-${col}`}
                        className={[
                          "w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16",
                          "rounded-full relative",
                          // hole effect: inner glass ring + subtle inner shadow
                          "bg-white/15 border border-white/40",
                          "backdrop-blur-xl",
                          "shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]",
                          "flex items-center justify-center",
                          isFinished ? "cursor-default" : "cursor-pointer",
                          "select-none",
                        ].join(" ")}
                      >
                        {/* ghost preview for this column */}
                        {ghostRow === r && cell == null && (
                          <span
                            className={[
                              "absolute inset-1 rounded-full opacity-40",
                              turn === "red"
                                ? "bg-gradient-to-br from-red-400 to-red-600"
                                : "bg-gradient-to-br from-blue-400 to-blue-600",
                            ].join(" ")}
                          />
                        )}

                        {/* disc */}
                        {cell && (
                          <span
                            className={[
                              "block rounded-full",
                              "w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12",
                              cell === "red"
                                ? "bg-gradient-to-br from-red-400 to-red-600"
                                : "bg-gradient-to-br from-blue-400 to-blue-600",
                              "shadow-lg",
                              isWin ? "ring-4 ring-emerald-300/70" : "",
                              isLast
                                ? "outline outline-2 outline-white/70"
                                : "",
                              "animate-[drop_.22s_ease-out]",
                            ].join(" ")}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <GhostBtn onClick={resetGame}>Reset Game</GhostBtn>
        </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes drop {
          from { transform: translateY(-10px); opacity: .7; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}
