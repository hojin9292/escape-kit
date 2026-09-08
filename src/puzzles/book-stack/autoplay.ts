/**
 * book-stack 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum OB-019(책 쌓기). 정답 구간은 원본 그대로(3~6권).
 * toothpaste-squeeze와 같은 "이산 탭 + 되돌리기" 구조 — 단위가 1권씩이라 STEP_UNIT=1.
 */
export const MAX_STEPS = 9;
export const GOOD_MIN = 3;
export const GOOD_MAX = 6;
export type Judgment = "low" | "good" | "high";
export function judge(count: number): Judgment {
  if (count < GOOD_MIN) return "low";
  if (count > GOOD_MAX) return "high";
  return "good";
}
export const SOLUTION_STEPS: readonly number[] = Array.from({ length: MAX_STEPS + 1 }, (_, s) => s).filter(
  (s) => judge(s) === "good",
);
export const SOLVE_STEP = SOLUTION_STEPS[0];
