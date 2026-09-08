/**
 * pencil-grip 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum OB-001(연필 잡는 힘). shoulder-tap과 같은 **단계 선택** 조작.
 */
export const LEVELS: readonly number[] = [15, 40, 55, 70, 90];
export const GOOD_MIN = 28;
export const GOOD_MAX = 52;
export type Judgment = "low" | "good" | "high";
export function judge(value: number): Judgment {
  if (value < GOOD_MIN) return "low";
  if (value > GOOD_MAX) return "high";
  return "good";
}
export const SOLUTION_LEVELS: readonly number[] = LEVELS.map((_, i) => i).filter((i) => judge(LEVELS[i]) === "good");
export const SOLVE_LEVEL = SOLUTION_LEVELS[0];
