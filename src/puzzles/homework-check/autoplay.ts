/** 숙제 제출 전 확인할 두 항목. */
export const CHECK_IDS = ["name", "blank"] as const;
export type CheckId = (typeof CHECK_IDS)[number];
export function isComplete(checked: readonly CheckId[]): boolean {
  return CHECK_IDS.every((id) => checked.includes(id));
}
