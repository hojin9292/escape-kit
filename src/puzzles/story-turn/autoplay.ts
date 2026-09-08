/**
 * story-turn 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum CO-014(내 이야기 길이, stack_quantity 1~3). yogurt-topping과 같은
 * "자동으로 쌓이는 것을 지켜보다 너무 많아지기 전에 멈추는" 관찰형(역방향).
 */
export const TICK_MS = 900;
export const GOOD_MIN = 1;
export const GOOD_MAX = 3;
export type Judgment = "low" | "good" | "high";
export function judgeAtStep(step: number): Judgment {
  if (step < GOOD_MIN) return "low";
  if (step > GOOD_MAX) return "high";
  return "good";
}
export const SOLVE_STEP = GOOD_MIN;
