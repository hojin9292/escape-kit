/**
 * wait-shelf-order 정답 상수 — e2e spec은 여기서만 답을 가져온다.
 * 최종 콘솔 — soap-shelf-order와 같은 구조의 서열 퍼즐(gate 없음).
 *
 * 근거 문항(imankeum answer.min~max 그대로, 판정 기준값은 중앙값, 초 단위):
 *   TI-017 세탁기 완료 후   1~8   → 4.5
 *   TI-011 부탁 후 기다리기 4~10  → 7
 *   TI-001 친구 대답 기다리기 4~12 → 8
 *   TI-002 엘리베이터 기다리기 8~20 → 14
 */
export interface ShelfItem {
  id: string;
  name: string;
  scenarioId: string;
  midpoint: number;
}
export const ITEMS: readonly ShelfItem[] = [
  { id: "washer", name: "세탁기 완료 후", scenarioId: "TI-017", midpoint: 4.5 },
  { id: "favor", name: "부탁 후 기다리기", scenarioId: "TI-011", midpoint: 7 },
  { id: "friend-answer", name: "친구 대답 기다리기", scenarioId: "TI-001", midpoint: 8 },
  { id: "elevator", name: "엘리베이터 기다리기", scenarioId: "TI-002", midpoint: 14 },
] as const;
export const CORRECT_ORDER: readonly string[] = [...ITEMS].sort((a, b) => a.midpoint - b.midpoint).map((it) => it.id);
export function isUniqueSolution(): boolean {
  const values = ITEMS.map((it) => it.midpoint);
  return new Set(values).size === values.length;
}
export function judgeOrder(order: readonly string[]): boolean {
  return order.length === CORRECT_ORDER.length && order.every((id, i) => id === CORRECT_ORDER[i]);
}
