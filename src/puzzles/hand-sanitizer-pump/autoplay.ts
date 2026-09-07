/**
 * hand-sanitizer-pump 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 근거: imankeum HY-004(손 소독제 펌프). 정답 구간은 원본 그대로(1~2회).
 * 조작은 순수 카운트(펌프는 되돌릴 수 없다는 자연스러운 제약을 그대로 둔다 —
 * toothpaste-squeeze의 "줄이기"와 달리 undo 버튼이 없다).
 */

export const MAX_PUMPS = 4;
export const GOOD_MIN = 1;
export const GOOD_MAX = 2;

export type Judgment = "low" | "good" | "high";

export function judge(count: number): Judgment {
  if (count < GOOD_MIN) return "low";
  if (count > GOOD_MAX) return "high";
  return "good";
}

export const SOLUTION_COUNTS: readonly number[] = Array.from(
  { length: MAX_PUMPS + 1 },
  (_, n) => n,
).filter((n) => judge(n) === "good");

export const SOLVE_COUNT = SOLUTION_COUNTS[0];
