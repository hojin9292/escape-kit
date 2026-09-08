/**
 * microwave-wait 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum TI-003(전자레인지 끝나기, 8~12초). brushing-timer 계열 관찰형(정방향).
 */
export const TICK_MS = 900;
export const GOOD_START = 3;
export const GOOD_END = 6;
export type Judgment = "low" | "good" | "high";
export function judgeAtStep(step: number): Judgment {
  if (step < GOOD_START) return "low";
  if (step <= GOOD_END) return "good";
  return "high";
}
export const SOLVE_STEP = GOOD_START;
