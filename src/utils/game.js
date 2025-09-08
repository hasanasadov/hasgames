// Primitive oyun məntiqi (saf funksiyalar)
export const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function getWinner(b) {
  for (const [a, c, d] of LINES) {
    const v = b[a];
    if (v && v === b[c] && v === b[d]) return { winner: v, line: [a, c, d] };
  }
  return null;
}

export const isFull = (b) => b.every((v) => v !== null);

export const next = (b) =>
  b.filter((x) => x === "X").length === b.filter((o) => o === "O").length
    ? "X"
    : "O";

export const empties = (b) =>
  b.reduce((acc, v, i) => (v == null ? (acc.push(i), acc) : acc), []);
