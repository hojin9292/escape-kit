/**
 * pour-shelf-order 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 *
 * 최종 콘솔(식탁 정리대) — soap-shelf-order와 같은 구조의 서열 퍼즐이다(gate 없음).
 *
 * 근거 문항(imankeum answer.min~max 그대로, 판정 기준값은 중앙값):
 *   FO-018 나눠 마시는 주스잔  28~38 → 33
 *   FO-002 시리얼 우유         40~65 → 52.5
 *   FO-001 컵에 물 따르기      55~78 → 66.5
 *   FO-013 외출 물병           75~92 → 83.5
 * 네 중앙값이 전부 다르므로 정답 순열은 유일하다(4! = 24개 중 1개).
 */

export interface ShelfItem {
  id: string;
  name: string;
  scenarioId: string;
  midpoint: number;
}

export const ITEMS: readonly ShelfItem[] = [
  { id: "juice-cup", name: "나눠 마시는 주스잔", scenarioId: "FO-018", midpoint: 33 },
  { id: "cereal-milk", name: "시리얼 우유", scenarioId: "FO-002", midpoint: 52.5 },
  { id: "water-cup", name: "물컵", scenarioId: "FO-001", midpoint: 66.5 },
  { id: "water-bottle", name: "물병", scenarioId: "FO-013", midpoint: 83.5 },
] as const;

export const CORRECT_ORDER: readonly string[] = [...ITEMS]
  .sort((a, b) => a.midpoint - b.midpoint)
  .map((it) => it.id);

export function isUniqueSolution(): boolean {
  const values = ITEMS.map((it) => it.midpoint);
  return new Set(values).size === values.length;
}

export function judgeOrder(order: readonly string[]): boolean {
  return (
    order.length === CORRECT_ORDER.length && order.every((id, i) => id === CORRECT_ORDER[i])
  );
}
