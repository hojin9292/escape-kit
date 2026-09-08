/**
 * friend-turn-wait 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum TI-018(친구 말 끝나기, 5~12초). microwave-wait와 같은 관찰형(정방향)
 * 이지만 좋은 구간의 폭을 다르게 두어 이 방 안에서도 서로 다른 느낌을 준다.
 */
export const TICK_MS = 900;
export const GOOD_START = 2;
export const GOOD_END = 5;
export type Judgment = "low" | "good" | "high";
export function judgeAtStep(step: number): Judgment {
  if (step < GOOD_START) return "low";
  if (step <= GOOD_END) return "good";
  return "high";
}
export const SOLVE_STEP = GOOD_START;
