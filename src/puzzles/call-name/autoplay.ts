/**
 * call-name 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum CO-007(선생님 이름 부르기). 정답 구간은 원본 그대로(1~2회).
 * hand-sanitizer-pump와 같은 "되돌리기 없는 횟수 세기" 구조.
 */
export const MAX_CALLS = 4;
export const GOOD_MIN = 1;
export const GOOD_MAX = 2;
export type Judgment = "low" | "good" | "high";
export function judge(count: number): Judgment {
  if (count < GOOD_MIN) return "low";
  if (count > GOOD_MAX) return "high";
  return "good";
}
export const SOLUTION_COUNTS: readonly number[] = Array.from({ length: MAX_CALLS + 1 }, (_, n) => n).filter(
  (n) => judge(n) === "good",
);
export const SOLVE_COUNT = SOLUTION_COUNTS[0];
