/**
 * microwave-wait 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 근거: imankeum TI-003(전자레인지 끝나기). brushing-timer 계열 관찰형(정방향).
 * 화면 스텝은 실제 초가 아니라 '가열 중 → 완료음 → 포장지의 뜸 들이기 완료' 단계다.
 * 완료 뒤 늦었다고 실패시키지 않는다. 제품에 따라 뜸 들이기 시간이 안전과 균일 가열에
 * 필요할 수 있으므로, 포장지 안내 시간이 지난 뒤에는 언제 눌러도 정답이다.
 */
export const TICK_MS = 900;
export const BEEP_STEP = 3;
export const GOOD_START = 4;
export type Judgment = "low" | "good";
export function judgeAtStep(step: number): Judgment {
  if (step < GOOD_START) return "low";
  return "good";
}
export const SOLVE_STEP = GOOD_START;
