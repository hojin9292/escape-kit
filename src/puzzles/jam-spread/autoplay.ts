/**
 * jam-spread 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 근거: imankeum FO-005(식빵 잼, `spread_area`). 정답 구간은 원본 그대로(면적
 * 45~72%). imankeum은 드래그로 표면을 문질러 넓이를 바꾸지만, 이 방탈출에서는
 * **격자 칸을 하나씩 탭**하는 이산 조작으로 옮긴다(1번 방에 없던 새 조작 — 넓이 격자).
 * 칸 개수만으로 판정이 결정되는 순수 함수라 몇 칸을 칠하든 유일해 검산이 가능하다.
 */

export const COLS = 6;
export const ROWS = 4;
export const TOTAL_CELLS = COLS * ROWS;

export const GOOD_MIN = 45;
export const GOOD_MAX = 72;

export type Judgment = "low" | "good" | "high";

/** 칠한 칸 수 → 넓이 퍼센트 */
export function cellsToPercent(cells: number): number {
  return (Math.max(0, Math.min(TOTAL_CELLS, cells)) / TOTAL_CELLS) * 100;
}

export function judge(percent: number): Judgment {
  if (percent < GOOD_MIN) return "low";
  if (percent > GOOD_MAX) return "high";
  return "good";
}

/** 정답으로 인정되는 칸 수 목록 — 전수 열거로 유일해 구간을 확인한다 */
export const SOLUTION_CELL_COUNTS: readonly number[] = Array.from(
  { length: TOTAL_CELLS + 1 },
  (_, n) => n,
).filter((n) => judge(cellsToPercent(n)) === "good");

export const SOLVE_CELLS = SOLUTION_CELL_COUNTS[0];
