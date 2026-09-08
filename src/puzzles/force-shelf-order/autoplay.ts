/**
 * force-shelf-order 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 최종 콘솔 — soap-shelf-order와 같은 구조의 서열 퍼즐(gate 없음).
 *
 * 근거 문항(imankeum answer.min~max 그대로, 판정 기준값은 중앙값):
 *   OB-005 태블릿 터치  8~25  → 16.5
 *   OB-013 스티커 누르기 18~40 → 29
 *   OB-001 연필 잡기    28~52 → 40
 *   OB-009 과자 봉지 열기 42~68 → 55
 */
export interface ShelfItem {
  id: string;
  name: string;
  scenarioId: string;
  midpoint: number;
}
export const ITEMS: readonly ShelfItem[] = [
  { id: "tablet", name: "태블릿 터치", scenarioId: "OB-005", midpoint: 16.5 },
  { id: "sticker", name: "스티커 누르기", scenarioId: "OB-013", midpoint: 29 },
  { id: "pencil", name: "연필 잡기", scenarioId: "OB-001", midpoint: 40 },
  { id: "snack-bag", name: "과자 봉지 열기", scenarioId: "OB-009", midpoint: 55 },
] as const;
export const CORRECT_ORDER: readonly string[] = [...ITEMS].sort((a, b) => a.midpoint - b.midpoint).map((it) => it.id);
export function isUniqueSolution(): boolean {
  const values = ITEMS.map((it) => it.midpoint);
  return new Set(values).size === values.length;
}
export function judgeOrder(order: readonly string[]): boolean {
  return order.length === CORRECT_ORDER.length && order.every((id, i) => id === CORRECT_ORDER[i]);
}
