/**
 * ice-drop 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 근거: 이번 주문 카드의 2~3개. 조작은 순수
 * 카운트(hand-sanitizer-pump와 같은 계열 — 넣은 얼음은 도로 못 뺀다는 자연스러운
 * 제약을 그대로 둔다).
 */

export const MAX_ICE = 7;
export const GOOD_MIN = 2;
export const GOOD_MAX = 3;

export type Judgment = "low" | "good" | "high";

export function judge(count: number): Judgment {
  if (count < GOOD_MIN) return "low";
  if (count > GOOD_MAX) return "high";
  return "good";
}

export const SOLUTION_COUNTS: readonly number[] = Array.from(
  { length: MAX_ICE + 1 },
  (_, n) => n,
).filter((n) => judge(n) === "good");

export const SOLVE_COUNT = SOLUTION_COUNTS[0];
