/**
 * jam-spread 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 근거: imankeum FO-005(식빵 잼, `spread_area`). 정답 구간은 원본 그대로(면적
 * 45~72%). 화면에는 격자를 보이지 않고 빵 위를 문질러 바른다. 내부의 거친 셀은
 * 면적과 분포를 안정적으로 판정하기 위한 용도다.
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

/** 면적뿐 아니라 최소 3개 행·5개 열에 퍼져야 '고르게' 바른 것으로 본다. */
export function judgeSpread(cellIds: Iterable<number>): Judgment {
  const cells = [...new Set(cellIds)].filter((id) => id >= 0 && id < TOTAL_CELLS);
  const amount = judge(cellsToPercent(cells.length));
  if (amount !== "good") return amount;
  const rows = new Set(cells.map((id) => Math.floor(id / COLS))).size;
  const cols = new Set(cells.map((id) => id % COLS)).size;
  return rows >= 3 && cols >= 5 ? "good" : "low";
}

/** 정답으로 인정되는 칸 수 목록 — 전수 열거로 유일해 구간을 확인한다 */
export const SOLUTION_CELL_COUNTS: readonly number[] = Array.from(
  { length: TOTAL_CELLS + 1 },
  (_, n) => n,
).filter((n) => judge(cellsToPercent(n)) === "good");

export const SOLVE_CELLS = SOLUTION_CELL_COUNTS[0];

/** 고른 분포를 이루는 대표 드래그 경로용 셀. */
export const SOLVE_CELL_IDS = [0, 1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 17] as const;
