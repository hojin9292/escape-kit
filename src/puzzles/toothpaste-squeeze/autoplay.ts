/**
 * toothpaste-squeeze 정답 상수 — e2e spec은 여기서만 답을 가져온다 (spec에 답 재기입 금지).
 *
 * 근거: 「딱! 이만큼」 imankeum HY-001(치약 사용량). 정답 구간은 원본 문항 그대로
 * (min 28, max 45 — normalized 0~100). 조작은 연속 드래그가 아니라 **이산 탭**으로
 * 옮긴다(방탈출 키트의 모터-세이프 원칙) — 한 번 누를 때마다 STEP_UNIT만큼 짜인다.
 *
 * 수렴 설계: 스텝은 0~MAX_STEPS 정수뿐이라 전수 열거로 유일해 검증이 끝난다.
 * 화면에는 숫자가 아니라 덩어리 크기만 보인다(원본 "숫자 게이지 안 보임" 규약 계승).
 */

/** 한 번 탭할 때 늘어나는 양 (0~100 표시 스케일 기준) */
export const STEP_UNIT = 8;
/** 짤 수 있는 최대 스텝 수 */
export const MAX_STEPS = 12;
/** 정답 구간 (HY-001 원본 그대로) */
export const GOOD_MIN = 28;
export const GOOD_MAX = 45;

export type Judgment = "low" | "good" | "high";

/** 스텝 수 → 표시 크기 (0~100) */
export function stepToValue(step: number): number {
  return Math.max(0, Math.min(MAX_STEPS, step)) * STEP_UNIT;
}

/** 표시 크기 → 판정 */
export function judge(value: number): Judgment {
  if (value < GOOD_MIN) return "low";
  if (value > GOOD_MAX) return "high";
  return "good";
}

/** 정답으로 인정되는 스텝 목록 (전수 열거 — 유일해가 아니라 "구간"이지만 유한하고 결정적) */
export const SOLUTION_STEPS: readonly number[] = Array.from({ length: MAX_STEPS + 1 }, (_, s) => s).filter(
  (s) => judge(stepToValue(s)) === "good"
);

/** e2e·개발용 대표 정답 스텝 (SOLUTION_STEPS 중 하나) */
export const SOLVE_STEP = SOLUTION_STEPS[0];
