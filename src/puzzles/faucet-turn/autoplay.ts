/**
 * faucet-turn 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum OB-004(수도꼭지 열기). 정답 구간은 원본 그대로(28~50).
 * 화면에서는 추상적인 물줄기 길이 대신 **5초 동안 받은 물의 양**으로 바꿔 보여준다.
 * 값 100 = 1L/5초로 두면 정답 스텝 4~6은 0.32~0.48L/5초
 * (= 약 3.8~5.8L/분)이며, 절수형 가정용 세면대 수도의 실제 유량 범위와 맞닿는다.
 */
export const STEP_UNIT = 8;
export const MAX_STEPS = 12;
export const GOOD_MIN = 28;
export const GOOD_MAX = 50;
export type Judgment = "low" | "good" | "high";
export function stepToValue(step: number): number {
  return Math.max(0, Math.min(MAX_STEPS, step)) * STEP_UNIT;
}
/** 같은 수도를 5초 동안 틀어 계량통에 받은 양(L) */
export function litersAtStep(step: number): number {
  return stepToValue(step) / 100;
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
