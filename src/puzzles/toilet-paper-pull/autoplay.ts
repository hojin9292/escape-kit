/**
 * toilet-paper-pull 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 근거: imankeum HY-005(화장실 휴지). 정답 구간은 원본 그대로(min 30, max 55 —
 * normalized 0~100). toothpaste-squeeze와 같은 "이산 탭 + 되돌리기" 조작이지만
 * 그림은 짜기가 아니라 당기기(길이)라 조작 감각이 겹치지 않는다.
 */

export const STEP_UNIT = 10;
export const MAX_STEPS = 8;
export const GOOD_MIN = 30;
export const GOOD_MAX = 55;

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
