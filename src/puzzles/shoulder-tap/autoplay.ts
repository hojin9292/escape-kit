/**
 * shoulder-tap 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 근거: imankeum SO-010(친구 어깨 톡톡). 원본은 연속값(pressure_press, 18~38)인데
 * 이 방에서 처음 쓰는 **단계 선택** 조작으로 옮긴다 — 사람 몸에 가하는 힘은 "쌓아
 * 올리는" 은유가 부적절해서(계속 두드리는 꼴이 된다), 1~5단계 중 하나를 한 번에
 * 고르는 편이 실제 동작(톡톡 두드리기)과 더 가깝다(curriculum-map.md 예외 표 참조).
 */
export const LEVELS: readonly number[] = [10, 28, 45, 65, 85];
export const GOOD_MIN = 18;
export const GOOD_MAX = 38;
export type Judgment = "low" | "good" | "high";
export function judge(value: number): Judgment {
  if (value < GOOD_MIN) return "low";
  if (value > GOOD_MAX) return "high";
  return "good";
}
export const SOLUTION_LEVELS: readonly number[] = LEVELS.map((_, i) => i).filter((i) => judge(LEVELS[i]) === "good");
export const SOLVE_LEVEL = SOLUTION_LEVELS[0];
