/**
 * brushing-timer 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 근거: imankeum HY-009(양치하는 시간). 원본은 "장면이 진행되는 동안 적절한 순간에
 * 버튼을 누르는" 무오류 관찰 과제인데, 반응속도가 섞이지 않도록 여기서는 **스텝**으로
 * 이산화한다 — 화면의 4부위(앞니·왼쪽 어금니·오른쪽 어금니·안쪽)가 TICK_MS 간격으로
 * 하나씩 순서대로 밝아지고, 스텝 수만으로 판정이 결정된다(curriculum-map.md 예외 표 참조).
 *
 * step 0~3: 네 부위가 처음 한 번씩 밝아지는 중 — 아직 다 못 봤다(LOW).
 * step 3~6: 방금 넷을 다 봤거나, 그 뒤로 앞쪽 부위가 한 번 더 밝아지는 여유 구간(GOOD).
 * step 7~ : 안쪽까지 두 번째로 밝아짐 — 이미 다 봤는데 계속 지켜본 것(HIGH).
 */

export const ZONE_NAMES: readonly string[] = ["앞니", "왼쪽 어금니", "오른쪽 어금니", "안쪽"] as const;
export const TICK_MS = 900;

export const GOOD_START = 3;
export const GOOD_END = 6;

export type Judgment = "low" | "good" | "high";

/** 현재 밝아진 부위 인덱스 (0~3 순환) */
export function zoneAtStep(step: number): number {
  return step % ZONE_NAMES.length;
}

export function judgeAtStep(step: number): Judgment {
  if (step < GOOD_START) return "low";
  if (step <= GOOD_END) return "good";
  return "high";
}

/** e2e·개발용 대표 정답 스텝 */
export const SOLVE_STEP = GOOD_START;
