// src/pages/ClickGlass.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

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

/* ------------------------------ constants ------------------------------ */
const DIFFICULTIES = { easy: 1000, medium: 600, hard: 300 };

/* ------------------------------ component ------------------------------ */
export default function ClickGlass() {
  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [duration, setDuration] = useState(10); // seconds

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  const [history, setHistory] = useState([]); // {name, point, difficulty, duration, ts}

  const arenaRef = useRef(null);
  const moveTimer = useRef(null);
  const countdownTimer = useRef(null);
  const savedRef = useRef(false);
  const scoreRef = useRef(0);

  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [dotSize, setDotSize] = useState(26); // px (mobil üçün böyüyəcək)
  const [pulse, setPulse] = useState(false);

  // always keep latest score in a ref (so auto-stop saves the right value)
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // responsive dot size (mobil → daha böyük)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setDotSize(mq.matches ? 30 : 26);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  function placeDot() {
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const padding = 6; // div-in iç kənarına toxunmasın deyə
    const maxX = Math.max(rect.width - dotSize - padding * 2, 0);
    const maxY = Math.max(rect.height - dotSize - padding * 2, 0);
    const x = Math.floor(Math.random() * (maxX + 1)) + padding;
    const y = Math.floor(Math.random() * (maxY + 1)) + padding;
    setDotPos({ x, y });
  }

  function startGame() {
    if (isPlaying) return;
    savedRef.current = false;
    setScore(0);
    setTimeLeft(duration);
    setIsPlaying(true);
    placeDot();
  }

  function stopGame(save = true) {
    clearInterval(moveTimer.current);
    clearInterval(countdownTimer.current);
    moveTimer.current = null;
    countdownTimer.current = null;
    setIsPlaying(false);

    if (save && !savedRef.current) {
      savedRef.current = true;
      setHistory((h) => [
        {
          name: (username || "").trim() || "Guest",
          point: scoreRef.current,
          difficulty,
          duration,
          ts: Date.now(),
        },
        ...h,
      ]);
    }
  }

  // timers: hareket + geri sayım
  useEffect(() => {
    if (!isPlaying) return;
    // move interval
    moveTimer.current = setInterval(placeDot, DIFFICULTIES[difficulty]);
    // countdown
    countdownTimer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdownTimer.current);
          stopGame(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(moveTimer.current);
      clearInterval(countdownTimer.current);
    };
  }, [isPlaying, difficulty]);

  // resize → dot-u yerləştir
  useEffect(() => {
    const onResize = () => placeDot();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onDotClick = () => {
    if (!isPlaying) return;
    setScore((s) => s + 1);
    setPulse(true);
    placeDot();
    setTimeout(() => setPulse(false), 120);
  };

  const topScores = useMemo(
    () => [...history].sort((a, b) => b.point - a.point).slice(0, 10),
    [history]
  );

  function resetLeaderboard() {
    if (confirm("Clear leaderboard?")) setHistory([]);
  }

  const statusText = isPlaying
    ? "Tap the dot!"
    : "Ready to play? Choose settings and press Start.";

  return (
    <div className="min-h-[calc(100vh-136px)] w-full text-white bg-star flex items-center justify-center p-4">
      <div className="w-full max-w-7xl space-y-6 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Click <span className="text-white/60">the Dot</span>
          </h1>
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <GhostBtn onClick={() => stopGame(true)}>Stop</GhostBtn>
            ) : (
              <PrimaryBtn onClick={startGame}>Start</PrimaryBtn>
            )}
          </div>
        </div>

        {/* Controls + Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Settings */}
          <GlassCard className="p-4">
            <div className="mb-3 text-sm uppercase tracking-wide text-white/85">
              Settings
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-white/80">
                  Username
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your name"
                  disabled={isPlaying}
                  className="rounded-lg px-3 py-2 bg-white/15 border border-white/25 backdrop-blur placeholder-white/60 outline-none focus:ring-2 focus:ring-sky-300"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-white/80">
                  Duration (s)
                </span>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={duration}
                  onChange={(e) =>
                    setDuration(Math.max(5, Math.min(60, +e.target.value || 0)))
                  }
                  disabled={isPlaying}
                  className="rounded-lg px-3 py-2 bg-white/15 border border-white/25 backdrop-blur outline-none focus:ring-2 focus:ring-sky-300"
                />
              </label>

              <div className="sm:col-span-2">
                <div className="text-xs uppercase tracking-wide text-white/80 mb-1">
                  Difficulty
                </div>
                <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/15 backdrop-blur">
                  {["easy", "medium", "hard"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      disabled={isPlaying} // oyun zamanı dəyişməsin
                      type="button"
                      className={[
                        "px-3 py-1.5 rounded-lg text-sm font-semibold transition",
                        difficulty === d
                          ? "bg-white text-slate-900 shadow"
                          : "text-white/90 hover:text-white hover:bg-white/5",
                        isPlaying ? "opacity-70 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      {d[0].toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Status */}
          <GlassCard className="p-4">
            <div className="text-sm uppercase tracking-wide text-white/85 mb-3">
              Status
            </div>
            <div className="flex flex-col gap-2">
              <div className="rounded-2xl border border-white/30 bg-white/20 backdrop-blur-2xl backdrop-saturate-150 shadow-xl [box-shadow:inset_0_1px_0_rgba(255,255,255,0.55),0_12px_40px_rgba(0,0,0,0.25)] px-4 py-3 text-center font-semibold">
                {statusText}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-center">
                  <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
                    Score
                  </div>
                  <div className="text-2xl font-black">{score}</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-center">
                  <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
                    Time
                  </div>
                  <div className="text-2xl font-black">{timeLeft}s</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-center">
                  <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
                    Diff
                  </div>
                  <div className="text-xl font-black capitalize">
                    {difficulty}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Leaderboard */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm uppercase tracking-wide text-white/85">
                Leaderboard (Top 10)
              </div>
              <button
                onClick={resetLeaderboard}
                className="text-xs rounded-lg px-3 py-1.5 border border-white/20 bg-white/10 hover:bg-white/15"
              >
                Clear
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-white/80">
                  <tr>
                    <th className="text-left py-2 pr-2">#</th>
                    <th className="text-left py-2 pr-2">Name</th>
                    <th className="text-right py-2 pr-2">Score</th>
                    <th className="text-right py-2 pr-2">Diff</th>
                    <th className="text-right py-2">Dur</th>
                  </tr>
                </thead>
                <tbody>
                  {topScores.length === 0 ? (
                    <tr>
                      <td className="py-2 text-white/70" colSpan={5}>
                        No scores yet.
                      </td>
                    </tr>
                  ) : (
                    topScores.map((g, i) => (
                      <tr key={g.ts} className="border-t border-white/10">
                        <td className="py-2 pr-2">
                          {i < 3 ? (
                            <span
                              className={[
                                "inline-flex items-center justify-center rounded-full w-6 h-6 text-xs font-bold",
                                i === 0
                                  ? "bg-amber-300 text-slate-900"
                                  : i === 1
                                  ? "bg-slate-200 text-slate-900"
                                  : "bg-orange-300 text-slate-900",
                              ].join(" ")}
                            >
                              {i + 1}
                            </span>
                          ) : (
                            <span className="opacity-80">{i + 1}</span>
                          )}
                        </td>
                        <td className="py-2 pr-2">{g.name}</td>
                        <td className="py-2 pr-2 text-right font-bold">
                          {g.point}
                        </td>
                        <td className="py-2 pr-2 text-right capitalize">
                          {g.difficulty}
                        </td>
                        <td className="py-2 text-right">{g.duration}s</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Arena */}
        <GlassCard className="p-3 md:p-4">
          <div
            className="relative mx-auto rounded-2xl border border-white/25 bg-white/10 backdrop-blur-2xl overflow-hidden"
            style={{ width: "min(560px, 100%)", height: "340px" }}
            ref={arenaRef}
          >
            {/* soft glare */}
            <div className="pointer-events-none absolute -top-12 left-8 w-48 h-48 rounded-full bg-white/20 blur-3xl" />
            {/* clickable dot */}
            {isPlaying && (
              <button
                onClick={onDotClick}
                className={[
                  "absolute rounded-full",
                  "bg-white",
                  "shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
                  "after:content-[''] after:absolute after:inset-0 after:rounded-full after:transition after:duration-150",
                  pulse ? "after:scale-125 after:bg-white/30" : "",
                ].join(" ")}
                style={{
                  width: `${dotSize}px`,
                  height: `${dotSize}px`,
                  transform: `translate(${dotPos.x}px, ${dotPos.y}px)`,
                }}
                aria-label="Target dot"
              />
            )}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm">
                Press <span className="mx-1 font-bold">Start</span> to begin
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
