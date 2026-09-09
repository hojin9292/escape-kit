/** 요거트 주문 카드 선택 정답 — e2e와 퍼즐이 같은 상수를 사용한다. */
export const TOPPING_CHOICES = ["none", "one-spoon", "covered"] as const;
export type ToppingChoice = (typeof TOPPING_CHOICES)[number];
export const SOLVE_CHOICE: ToppingChoice = "one-spoon";

export function isCorrect(choice: ToppingChoice | null): boolean {
  return choice === SOLVE_CHOICE;
}
