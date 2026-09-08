/**
 * approach-friend 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 근거: imankeum SO-014(책 보는 친구에게 다가가기). 원본은 학생이 직접 거리를
 * 조절하는 문항인데, 이 퍼즐은 brushing-timer 계열 관찰형을 "거리"에 적용한
 * 변형이다 — 캐릭터가 자동으로 다가가고, 알맞은 거리일 때 [말 걸기!]를 누른다.
 *
 * 방향이 다른 관찰형과 반대다: 스텝이 늘수록 "다가가는" 것이므로 거리가 줄어든다.
 * 그래서 이르면(너무 멀면) high, 늦으면(너무 가까우면) low로 판정한다 —
 * elevator-distance와 같은 "low=너무 가까움, high=너무 멂" 값 의미를 그대로 따른다.
 */
export const TICK_MS = 900;
export const HIGH_END = 1; // 0~1스텝: 아직 너무 멀다
export const GOOD_END = 4; // 2~4스텝: 알맞은 거리
export type Judgment = "low" | "good" | "high";
export function judgeAtStep(step: number): Judgment {
  if (step <= HIGH_END) return "high";
  if (step <= GOOD_END) return "good";
  return "low";
}
export const SOLVE_STEP = HIGH_END + 1;
