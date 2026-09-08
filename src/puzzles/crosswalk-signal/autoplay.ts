/**
 * crosswalk-signal 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 근거: imankeum TI-014(횡단보도 신호). 원본은 `answer.unit`이 `"event"`(문자열
 * `"greenSignal"`)라 다른 문항처럼 숫자 구간이 없다 — 신호등이 자동으로 바뀌는
 * 관찰형으로 이산화한다: 빨간불 구간(low) → 초록불+차 멈춤 구간(good) →
 * 깜빡임 이후(high, 위험).
 */
export const TICK_MS = 900;
export const GOOD_START = 3;
export const GOOD_END = 5;
export type Judgment = "low" | "good" | "high";
export type Light = "red" | "green" | "flashing";
export function judgeAtStep(step: number): Judgment {
  if (step < GOOD_START) return "low";
  if (step <= GOOD_END) return "good";
  return "high";
}
export function lightAtStep(step: number): Light {
  if (step < GOOD_START) return "red";
  if (step <= GOOD_END) return "green";
  return "flashing";
}
export const SOLVE_STEP = GOOD_START;
