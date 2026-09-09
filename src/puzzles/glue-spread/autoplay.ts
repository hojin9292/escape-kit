/**
 * glue-spread 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum OB-011(풀칠 면적). 화면에는 격자를 보이지 않고 종이 위를 문지른다.
 */
export const COLS = 6;
export const ROWS = 4;
export const TOTAL_CELLS = COLS * ROWS;
export const GOOD_MIN = 55;
export const GOOD_MAX = 82;
export type Judgment = "low" | "good" | "high";
export function cellsToPercent(cells: number): number {
  return (Math.max(0, Math.min(TOTAL_CELLS, cells)) / TOTAL_CELLS) * 100;
}
export function judge(percent: number): Judgment {
  if (percent < GOOD_MIN) return "low";
  if (percent > GOOD_MAX) return "high";
  return "good";
}

export const REQUIRED_ZONES = [0, 5, 9, 14, 18, 23] as const;

/** 네 귀퉁이와 가운데 두 지점이 모두 닿아야 하며, 거의 전부 덮으면 과다로 본다. */
export function judgeSpread(cellIds: Iterable<number>): Judgment {
  const cells = new Set([...cellIds].filter((id) => id >= 0 && id < TOTAL_CELLS));
  if (cells.size > 20) return "high";
  return REQUIRED_ZONES.every((id) => cells.has(id)) ? "good" : "low";
}
export const SOLUTION_CELL_COUNTS: readonly number[] = Array.from(
  { length: TOTAL_CELLS + 1 },
  (_, n) => n,
).filter((n) => judge(cellsToPercent(n)) === "good");
export const SOLVE_CELLS = SOLUTION_CELL_COUNTS[0];
export const SOLVE_CELL_IDS = REQUIRED_ZONES;
