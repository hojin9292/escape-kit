/**
 * voice-shelf-order 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 최종 콘솔 — soap-shelf-order와 같은 구조의 서열 퍼즐(gate 없음).
 *
 * 근거 문항(imankeum answer.min~max 그대로, 판정 기준값은 중앙값):
 *   CO-016 공연 관람 중 말하기  8~22  → 15
 *   CO-005 버스 안 대화         20~42 → 31
 *   CO-013 식당에서 주문        38~60 → 49
 *   CO-002 운동장 목소리        60~85 → 72.5
 */
export interface ShelfItem {
  id: string;
  name: string;
  scenarioId: string;
  midpoint: number;
}
export const ITEMS: readonly ShelfItem[] = [
  { id: "theater", name: "공연 관람 중", scenarioId: "CO-016", midpoint: 15 },
  { id: "bus", name: "버스 안 대화", scenarioId: "CO-005", midpoint: 31 },
  { id: "restaurant", name: "식당 주문", scenarioId: "CO-013", midpoint: 49 },
  { id: "playground", name: "운동장에서 부르기", scenarioId: "CO-002", midpoint: 72.5 },
] as const;
export const CORRECT_ORDER: readonly string[] = [...ITEMS].sort((a, b) => a.midpoint - b.midpoint).map((it) => it.id);
export function isUniqueSolution(): boolean {
  const values = ITEMS.map((it) => it.midpoint);
  return new Set(values).size === values.length;
}
export function judgeOrder(order: readonly string[]): boolean {
  return order.length === CORRECT_ORDER.length && order.every((id, i) => id === CORRECT_ORDER[i]);
}
