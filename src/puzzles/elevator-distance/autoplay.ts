/**
 * elevator-distance 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum SO-003(엘리베이터 안 거리). 정답 구간은 원본 그대로(24~48).
 * toothpaste-squeeze와 같은 "이산 탭 + 되돌리기" 구조.
 */
export const STEP_UNIT = 8;
export const MAX_STEPS = 12;
export const GOOD_MIN = 24;
export const GOOD_MAX = 48;
export type Judgment = "low" | "good" | "high";
export function stepToValue(step: number): number {
  return Math.max(0, Math.min(MAX_STEPS, step)) * STEP_UNIT;
}
export function judge(value: number): Judgment {
  if (value < GOOD_MIN) return "low";
  if (value > GOOD_MAX) return "high";
  return "good";
}
export const SOLUTION_STEPS: readonly number[] = Array.from({ length: MAX_STEPS + 1 }, (_, s) => s).filter(
  (s) => judge(stepToValue(s)) === "good",
);
export const SOLVE_STEP = SOLUTION_STEPS[0];
