/**
 * yogurt-topping 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 근거: imankeum FO-017(요거트 토핑). 원본은 "몇 숟가락"(count 1~3)인데, 여기서는
 * brushing-timer와 짝을 이루는 **관찰 후 단발 입력**으로 옮긴다 — 방향은 반대다:
 * brushing-timer는 "다 보일 때까지 기다렸다 누른다"이고, 이건 "사라지기 전에 멈춰야
 * 한다"(curriculum-map.md 예외 표 참조).
 *
 * TICK_MS 간격으로 토핑이 하나씩 자동으로 떨어지고, 그때마다 요거트의 흰 부분이
 * 줄어든다. step=0(아직 하나도 안 떨어짐, 흰 부분 100%)에서 누르면 too low,
 * step이 다 덮은 뒤(흰 부분 0%)면 too high, 그 사이(부분적으로 덮인 상태)가 good.
 */

export const TICK_MS = 900;
/** 토핑 한 번(스텝 하나)마다 줄어드는 흰 부분 퍼센트 */
export const WHITE_DROP_PER_STEP = 25;

export type Judgment = "low" | "good" | "high";

/** 현재 스텝에서 남은 흰 부분(%) — 0 이하로는 내려가지 않는다 */
export function whitePercentAtStep(step: number): number {
  return Math.max(0, 100 - step * WHITE_DROP_PER_STEP);
}

export function judgeAtStep(step: number): Judgment {
  const white = whitePercentAtStep(step);
  if (step <= 0) return "low"; // 아직 토핑을 하나도 안 올림
  if (white <= 0) return "high"; // 완전히 덮임
  return "good";
}

/** e2e·개발용 대표 정답 스텝 */
export const SOLVE_STEP = 1;
