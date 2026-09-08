/**
 * glue-spread 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum OB-011(풀칠 면적). jam-spread와 같은 격자 탭 구조.
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
export const SOLUTION_CELL_COUNTS: readonly number[] = Array.from(
  { length: TOTAL_CELLS + 1 },
  (_, n) => n,
).filter((n) => judge(cellsToPercent(n)) === "good");
export const SOLVE_CELLS = SOLUTION_CELL_COUNTS[0];
