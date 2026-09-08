/**
 * wait-answer 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum CO-008(질문 후 기다리기, 4~12초). brushing-timer와 같은 관찰형이지만
 * 부위 관찰이 아니라 "생각 중" 표시가 사라질 때까지 지켜보는 형태 — 스텝으로 이산화.
 */
export const TICK_MS = 900;
export const GOOD_START = 4;
export const GOOD_END = 9;
export type Judgment = "low" | "good" | "high";
export function judgeAtStep(step: number): Judgment {
  if (step < GOOD_START) return "low";
  if (step <= GOOD_END) return "good";
  return "high";
}
export const SOLVE_STEP = GOOD_START;
