// src/pages/SudokuGlass.jsx
import React, { useEffect, useRef, useState } from "react";

/* --------------------------- tiny UI atoms ---------------------------- */
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
      "relative rounded-3xl",
      "bg-gradient-to-br from-white/12 to-white/8",
      "backdrop-blur-2xl",
      "border border-white/20",
      "shadow-xl shadow-black/30",
      "[box-shadow:inset_0_1px_0_rgba(255,255,255,.25)]",
      className,
    ].join(" ")}
  >
    <div className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-white/10" />
    {children}
  </div>
);

/* ------------------------------ helpers ------------------------------ */
const range9 = [...Array(9).keys()];
const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const boxStart = (i) => Math.floor(i / 3) * 3;

const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (a) => {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const deepCopy = (b) => b.map((r) => r.slice());
const deepCopyNotes = (n) => n.map((r) => r.map((s) => new Set([...s])));

function computeConflicts(board) {
  const bad = new Set();
  // rows
  for (let r = 0; r < 9; r++) {
    const map = new Map();
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (!v) continue;
      if (!map.has(v)) map.set(v, []);
      map.get(v).push([r, c]);
    }
    for (const [, list] of map)
      if (list.length > 1) list.forEach(([rr, cc]) => bad.add(`${rr},${cc}`));
  }
  // cols
  for (let c = 0; c < 9; c++) {
    const map = new Map();
    for (let r = 0; r < 9; r++) {
      const v = board[r][c];
      if (!v) continue;
      if (!map.has(v)) map.set(v, []);
      map.get(v).push([r, c]);
    }
    for (const [, list] of map)
      if (list.length > 1) list.forEach(([rr, cc]) => bad.add(`${rr},${cc}`));
  }
  // boxes
  for (let br = 0; br < 9; br += 3) {
    for (let bc = 0; bc < 9; bc += 3) {
      const map = new Map();
      for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) {
          const v = board[r][c];
          if (!v) continue;
          if (!map.has(v)) map.set(v, []);
          map.get(v).push([r, c]);
        }
      }
      for (const [, list] of map)
        if (list.length > 1) list.forEach(([rr, cc]) => bad.add(`${rr},${cc}`));
    }
  }
  return bad;
}

function isSolved(board) {
  if (board.some((row) => row.some((v) => v === ""))) return false;
  return computeConflicts(board).size === 0;
}

function canPlace(board, r, c, val) {
  for (let i = 0; i < 9; i++) {
    if (board[r][i] === val) return false;
    if (board[i][c] === val) return false;
  }
  const rs = boxStart(r),
    cs = boxStart(c);
  for (let rr = rs; rr < rs + 3; rr++)
    for (let cc = cs; cc < cs + 3; cc++)
      if (board[rr][cc] === val) return false;
  return true;
}

// Solver (can count solutions up to limit for uniqueness check)
function solve(board, count = false, limit = 2) {
  const b = deepCopy(board);
  let solutions = 0;

  function findEmpty() {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++) if (b[r][c] === "") return [r, c];
    return null;
  }

  function dfs() {
    if (solutions >= limit) return;
    const spot = findEmpty();
    if (!spot) {
      solutions++;
      return;
    }
    const [r, c] = spot;
    for (const d of shuffle(DIGITS)) {
      if (canPlace(b, r, c, d)) {
        b[r][c] = d;
        dfs();
        if (solutions >= limit) return;
        b[r][c] = "";
      }
    }
  }

  dfs();
  if (count) return { count: solutions };
  return { solved: solutions > 0, board: b };
}

function generateFullBoard() {
  const b = Array.from({ length: 9 }, () => Array(9).fill(""));
  function fill(pos = 0) {
    if (pos === 81) return true;
    const r = Math.floor(pos / 9),
      c = pos % 9;
    for (const d of shuffle(DIGITS)) {
      if (canPlace(b, r, c, d)) {
        b[r][c] = d;
        if (fill(pos + 1)) return true;
        b[r][c] = "";
      }
    }
    return false;
  }
  fill(0);
  return b;
}

// Unique-solution puzzle
function generatePuzzle(difficulty = "normal") {
  const full = generateFullBoard();
  const work = deepCopy(full);

  let targetClues;
  if (difficulty === "easy") targetClues = 40 + rnd(6);
  else if (difficulty === "hard") targetClues = 24 + rnd(5);
  else targetClues = 30 + rnd(7);

  const positions = shuffle(
    range9.flatMap((r) => range9.map((c) => r * 9 + c))
  );
  let clues = 81;

  for (const pos of positions) {
    if (clues <= targetClues) break;
    const r = Math.floor(pos / 9),
      c = pos % 9;
    if (work[r][c] === "") continue;
    const keep = work[r][c];
    work[r][c] = "";
    const { count } = solve(work, true, 2);
    if (count !== 1) work[r][c] = keep;
    else clues--;
  }
  const givens = work.map((row) => row.map((v) => v !== ""));
  return { puzzle: work, givens };
}

/* --------------------------- Sudoku component --------------------------- */
export default function SudokuGlass() {
  const [difficulty, setDifficulty] = useState("normal");

  const [board, setBoard] = useState(() =>
    Array.from({ length: 9 }, () => Array(9).fill(""))
  );
  const [givens, setGivens] = useState(() =>
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );
  const [notes, setNotes] = useState(() =>
    range9.map(() => range9.map(() => new Set()))
  );
  const [selected, setSelected] = useState(null);
  const [autoNotesOn, setAutoNotesOn] = useState(true); // DEFAULT: ON
  const [highlightSame, setHighlightSame] = useState(true);
  const [conflicts, setConflicts] = useState(new Set());
  const [solved, setSolved] = useState(false);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [undo, setUndo] = useState(null);
  const [loading, setLoading] = useState(true);

  const boardRef = useRef(null);
  useEffect(() => {
    if (boardRef.current) boardRef.current.focus();
  }, [loading]);

  // timer
  useEffect(() => {
    if (!started || solved) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [started, solved]);

  function pushUndo() {
    setUndo({ board: deepCopy(board), notes: deepCopyNotes(notes) });
  }
  function restoreUndo() {
    if (!undo) return;
    setBoard(undo.board);
    setNotes(undo.notes);
    setConflicts(computeConflicts(undo.board));
    setSolved(isSolved(undo.board));
    setUndo(null);
  }

  function recomputeAllNotes(currentBoard) {
    const nn = range9.map(() => range9.map(() => new Set()));
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] !== "" || givens[r][c]) continue;
        const used = new Set();
        for (let x = 0; x < 9; x++)
          if (currentBoard[r][x]) used.add(currentBoard[r][x]);
        for (let y = 0; y < 9; y++)
          if (currentBoard[y][c]) used.add(currentBoard[y][c]);
        const rs = boxStart(r),
          cs = boxStart(c);
        for (let rr = rs; rr < rs + 3; rr++)
          for (let cc = cs; cc < cs + 3; cc++)
            if (currentBoard[rr][cc]) used.add(currentBoard[rr][cc]);
        nn[r][c] = new Set(DIGITS.filter((d) => !used.has(d)));
      }
    }
    return nn;
  }

  // Auto-notes: toggle → dərhal yenidən hesabla / göstərmə
  useEffect(() => {
    if (loading) return;
    if (autoNotesOn) setNotes(recomputeAllNotes(board));
    // OFF olanda silmirik; sadəcə render etməyəcəyik.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoNotesOn]);

  function setCellValue(r, c, val) {
    if (givens[r][c]) return;
    if (!DIGITS.includes(val) && val !== "") return;

    pushUndo();
    const nb = deepCopy(board);
    nb[r][c] = val;

    let nn = deepCopyNotes(notes);
    // Bu hüceyrənin qeydlərini təmizlə
    nn[r][c].clear();

    // Auto-notes ON → bütün qeydləri yenidən qur
    if (autoNotesOn) {
      nn = recomputeAllNotes(nb);
    } else if (val) {
      // OFF rejimdə minimal təmizlik (performans üçün)
      for (let x = 0; x < 9; x++) nn[r][x].delete(val);
      for (let y = 0; y < 9; y++) nn[y][c].delete(val);
      const rs = boxStart(r),
        cs = boxStart(c);
      for (let rr = rs; rr < rs + 3; rr++)
        for (let cc = cs; cc < cs + 3; cc++) nn[rr][cc].delete(val);
    }

    setBoard(nb);
    setNotes(nn);
    setConflicts(computeConflicts(nb));
    setSolved(isSolved(nb));
    if (!started) setStarted(true);
  }

  function clearCell(r, c) {
    if (givens[r][c]) return;
    pushUndo();
    const nb = deepCopy(board);
    nb[r][c] = "";
    let nn = deepCopyNotes(notes);
    nn[r][c].clear();

    if (autoNotesOn) nn = recomputeAllNotes(nb);

    setBoard(nb);
    setNotes(nn);
    setConflicts(computeConflicts(nb));
    setSolved(isSolved(nb));
  }

  function handleDigitInput(d) {
    if (!selected) return;
    const { r, c } = selected;
    setCellValue(r, c, d);
  }

  // NEW GAME
  function newGame(diff = difficulty) {
    setLoading(true);
    setTimeout(() => {
      const { puzzle, givens } = generatePuzzle(diff);
      setBoard(puzzle);
      setGivens(givens);
      // Auto-notes vəziyyətinə görə ilkin notes
      setNotes(
        autoNotesOn
          ? recomputeAllNotes(puzzle)
          : range9.map(() => range9.map(() => new Set()))
      );
      setConflicts(computeConflicts(puzzle));
      setSolved(false);
      setSelected(null);
      setTimer(0);
      setStarted(false);
      setUndo(null);
      setLoading(false);
    }, 0);
  }

  // first mount
  useEffect(() => {
    newGame(difficulty); /* eslint-disable-next-line */
  }, []);

  // keyboard
  function onKeyDown(e) {
    if (!selected || loading) return;
    const { key } = e;
    if (DIGITS.includes(key)) {
      e.preventDefault();
      handleDigitInput(key);
    } else if (key === "Backspace" || key === "Delete") {
      e.preventDefault();
      clearCell(selected.r, selected.c);
    } else if (key === "ArrowUp") {
      e.preventDefault();
      setSelected(({ r, c }) => ({ r: Math.max(0, r - 1), c }));
    } else if (key === "ArrowDown") {
      e.preventDefault();
      setSelected(({ r, c }) => ({ r: Math.min(8, r + 1), c }));
    } else if (key === "ArrowLeft") {
      e.preventDefault();
      setSelected(({ r, c }) => ({ r, c: Math.max(0, c - 1) }));
    } else if (key === "ArrowRight") {
      e.preventDefault();
      setSelected(({ r, c }) => ({ r, c: Math.min(8, c + 1) }));
    }
  }

  // derived for highlighting
  const sameDigit =
    selected && board[selected.r][selected.c]
      ? board[selected.r][selected.c]
      : null;
  function isPeer(r, c) {
    if (!selected) return false;
    const { r: sr, c: sc } = selected;
    const sameRow = r === sr;
    const sameCol = c === sc;
    const sameBox =
      boxStart(r) === boxStart(sr) && boxStart(c) === boxStart(sc);
    return sameRow || sameCol || sameBox;
  }

  // keypad (mobile)
  const keypad = (
    <div className="grid grid-cols-5 gap-2 w-full sm:w-auto">
      {DIGITS.map((d) => (
        <button
          key={d}
          onClick={() => handleDigitInput(d)}
          className="rounded-xl px-3 py-2 font-semibold border border-white/25 bg-white/10 hover:bg-white/15 text-white"
          type="button"
          disabled={loading}
        >
          {d}
        </button>
      ))}
      <button
        onClick={() => selected && clearCell(selected.r, selected.c)}
        className="col-span-2 rounded-xl px-3 py-2 font-semibold border border-white/25 bg-white/10 hover:bg-white/15"
        type="button"
        disabled={loading}
      >
        Erase
      </button>
      <button
        onClick={() => setAutoNotesOn((v) => !v)}
        className={[
          "col-span-3 rounded-xl px-3 py-2 font-semibold border",
          autoNotesOn
            ? "bg-white text-slate-900 border-white/10"
            : "bg-white/10 border-white/25",
        ].join(" ")}
        type="button"
        disabled={loading}
      >
        Auto-notes {autoNotesOn ? "ON" : "OFF"}
      </button>
    </div>
  );

  const statusText = loading
    ? "Generating…"
    : solved
    ? "Solved! 🎉"
    : started
    ? "Good luck!"
    : "Fill the grid";

  return (
    <div className="min-h-[calc(100vh-136px)] w-full text-white bg-star flex items-center justify-center p-4">
      <div className="w-full max-w-7xl space-y-6 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Su<span className="text-white/60">doku</span>
          </h1>
          <div className="flex items-center gap-2">
            <PrimaryBtn onClick={() => newGame(difficulty)} disabled={loading}>
              New Game
            </PrimaryBtn>
            <GhostBtn onClick={restoreUndo} disabled={!undo || loading}>
              Undo
            </GhostBtn>
          </div>
        </div>

        {/* Status + toggles */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="rounded-3xl border border-white/30 bg-white/20 backdrop-blur-2xl backdrop-saturate-150 shadow-xl [box-shadow:inset_0_1px_0_rgba(255,255,255,0.55),0_12px_40px_rgba(0,0,0,0.25)] px-4 py-3">
            <div className="text-base md:text-lg font-semibold">
              {statusText}
            </div>
          </div>

          <div className="rounded-full px-3 py-1.5 border border-white/20 bg-white/10 backdrop-blur text-sm">
            Time: <span className="font-semibold">{timer}s</span>
          </div>

          <button
            onClick={() => setHighlightSame((v) => !v)}
            className="rounded-full px-3 py-1.5 border border-white/25 bg-white/10 hover:bg-white/15 text-sm"
            type="button"
            disabled={loading}
          >
            Same Digit: {highlightSame ? "ON" : "OFF"}
          </button>

          {/* Auto-notes toggle (global) */}
          <button
            onClick={() => setAutoNotesOn((v) => !v)}
            className={[
              "rounded-full px-3 py-1.5 border text-sm font-semibold",
              autoNotesOn
                ? "bg-white text-slate-900 border-white/10"
                : "bg-white/10 border-white/25",
            ].join(" ")}
            type="button"
            disabled={loading}
            title="When ON, candidates auto-update after each move"
          >
            Auto-notes {autoNotesOn ? "ON" : "OFF"}
          </button>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            {["easy", "normal", "hard"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={[
                  "rounded-full px-3 py-1.5 border text-sm font-semibold",
                  difficulty === d
                    ? "bg-white text-slate-900 border-white/10"
                    : "bg-white/10 border-white/25",
                ].join(" ")}
                disabled={loading}
              >
                {d[0].toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Board + keypad */}
        <GlassCard className="p-4 md:p-6">
          <div
            ref={boardRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="outline-none"
          >
            <div className="mx-auto w-fit">
              <div
                className="grid grid-cols-9 gap-px bg-white/30 rounded-3xl overflow-hidden"
                role="grid"
                aria-label="Sudoku board"
              >
                {range9.map((r) =>
                  range9.map((c) => {
                    const key = `${r},${c}`;
                    const val = board[r][c];
                    const isGiven = givens[r][c];
                    const isSelected =
                      selected && selected.r === r && selected.c === c;
                    const inPeer = isPeer(r, c);
                    const inConflict = conflicts.has(key);
                    const same =
                      highlightSame &&
                      selected &&
                      board[selected.r][selected.c] &&
                      val &&
                      val === board[selected.r][selected.c];

                    return (
                      <button
                        key={key}
                        onClick={() => !loading && setSelected({ r, c })}
                        className={[
                          "relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16",
                          "flex items-center justify-center select-none",
                          "bg-white/12 backdrop-blur-xl",
                          "border border-white/25",
                          "shadow-[inset_0_2px_8px_rgba(0,0,0,.18)]",
                          isGiven
                            ? "bg-white/20 text-white font-extrabold"
                            : "text-white",
                          isSelected
                            ? "ring-2 ring-sky-300"
                            : inPeer
                            ? "bg-white/16"
                            : "",
                          same ? "outline outline-2 outline-amber-300/70" : "",
                          inConflict ? "ring-2 ring-rose-400/80" : "",
                          r === 2 || r === 5
                            ? "shadow-[0_3px_0_rgba(255,255,255,0.25)]"
                            : "",
                          c === 2 || c === 5
                            ? "shadow-[3px_0_0_rgba(255,255,255,0.25)]"
                            : "",
                          loading ? "opacity-60 cursor-wait" : "",
                        ].join(" ")}
                        aria-label={`Cell ${r + 1},${c + 1}`}
                      >
                        {val ? (
                          <span className="text-lg md:text-xl font-black drop-shadow">
                            {val}
                          </span>
                        ) : autoNotesOn && notes[r][c].size > 0 ? ( // <-- yalnız ON ikən göstər
                          <div className="grid grid-cols-3 gap-0.5 w-10 h-10 md:w-12 md:h-12 text-[10px] md:text-xs text-white/80">
                            {DIGITS.map((d) => (
                              <span
                                key={d}
                                className="flex items-center justify-center"
                              >
                                {notes[r][c].has(d) ? d : ""}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* mobile keypad */}
            <div className="mt-5 flex justify-center">{keypad}</div>
          </div>
        </GlassCard>

        {/* Bottom actions */}
        <div className="flex items-center justify-center gap-3">
          <GhostBtn onClick={() => newGame(difficulty)} disabled={loading}>
            New Game ({difficulty})
          </GhostBtn>
        </div>
      </div>
    </div>
  );
}
