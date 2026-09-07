/**
 * soap-shelf-order 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 최종 콘솔(정리대) — 키패드가 아니라 **서열 퍼즐**이다. 네 물건 모두 "짜서 쓰는 양"
 * 계열(imankeum squeeze_amount)이라 조작은 하나로 겹치지만, 그게 이 퍼즐의 개념이다:
 * 같은 손동작(짜기)인데도 무엇을 씻느냐에 따라 알맞은 양이 다르다는 일반화.
 *
 * 근거 문항(imankeum answer.min~max 그대로, 판정 기준값은 중앙값):
 *   HY-019 컵 하나 설거지  15~32 → 23.5
 *   HY-007 손 로션         20~42 → 31
 *   HY-001 칫솔 위 치약    28~45 → 36.5
 *   HY-003 샴푸 사용량     30~52 → 41.5
 * 네 중앙값이 전부 다르므로 정답 순열은 유일하다(4! = 24개 중 1개, 순수 함수로 검산 가능).
 */

export interface ShelfItem {
  id: string;
  name: string;
  /** imankeum 문항 id (근거) */
  scenarioId: string;
  /** answer.min~max의 중앙값 — 오름차순 정렬 기준 */
  midpoint: number;
}

export const ITEMS: readonly ShelfItem[] = [
  { id: "dish-soap", name: "설거지 세제", scenarioId: "HY-019", midpoint: 23.5 },
  { id: "lotion", name: "손 로션", scenarioId: "HY-007", midpoint: 31 },
  { id: "toothpaste", name: "치약", scenarioId: "HY-001", midpoint: 36.5 },
  { id: "shampoo", name: "샴푸", scenarioId: "HY-003", midpoint: 41.5 },
] as const;

/** 정답 순서 — 적게 쓰는 것부터 많이 쓰는 것 순 (오름차순) */
export const CORRECT_ORDER: readonly string[] = [...ITEMS]
  .sort((a, b) => a.midpoint - b.midpoint)
  .map((it) => it.id);

/** 정답이 유일한지 검산 — 중앙값이 전부 달라야 순서가 하나로 정해진다 */
export function isUniqueSolution(): boolean {
  const values = ITEMS.map((it) => it.midpoint);
  return new Set(values).size === values.length;
}

export function judgeOrder(order: readonly string[]): boolean {
  return (
    order.length === CORRECT_ORDER.length && order.every((id, i) => id === CORRECT_ORDER[i])
  );
}
