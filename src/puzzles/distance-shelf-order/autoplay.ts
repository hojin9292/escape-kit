/**
 * distance-shelf-order 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 최종 콘솔 — soap-shelf-order와 같은 구조의 서열 퍼즐(gate 없음).
 *
 * 근거 문항(imankeum answer.min~max 그대로, 판정 기준값은 중앙값):
 *   SO-004 함께 사진 찍기      18~40 → 29
 *   SO-002 급식실 줄 서기      28~52 → 40
 *   SO-001 친구와 이야기 거리  38~60 → 49
 *   SO-005 버스정류장 모르는 사람 50~78 → 64
 */
export interface ShelfItem {
  id: string;
  name: string;
  scenarioId: string;
  midpoint: number;
}
export const ITEMS: readonly ShelfItem[] = [
  { id: "photo", name: "함께 사진 찍기", scenarioId: "SO-004", midpoint: 29 },
  { id: "lunch-line", name: "급식실 줄 서기", scenarioId: "SO-002", midpoint: 40 },
  { id: "chat", name: "친구와 이야기", scenarioId: "SO-001", midpoint: 49 },
  { id: "stranger", name: "모르는 사람 옆", scenarioId: "SO-005", midpoint: 64 },
] as const;
export const CORRECT_ORDER: readonly string[] = [...ITEMS].sort((a, b) => a.midpoint - b.midpoint).map((it) => it.id);
export function isUniqueSolution(): boolean {
  const values = ITEMS.map((it) => it.midpoint);
  return new Set(values).size === values.length;
}
export function judgeOrder(order: readonly string[]): boolean {
  return order.length === CORRECT_ORDER.length && order.every((id, i) => id === CORRECT_ORDER[i]);
}
