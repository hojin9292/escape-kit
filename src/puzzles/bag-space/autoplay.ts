/** 버스에서 가방 둘 곳 고르기 — 상황 선택 정답 상수. */
export const CHOICES = ["next-seat", "aisle", "between-feet"] as const;
export type Choice = (typeof CHOICES)[number];
export type Judgment = "low" | "good" | "high";
export const SOLVE_CHOICE = 2;
export function judge(choice: Choice): Judgment {
  if (choice === "between-feet") return "good";
  return choice === "next-seat" ? "low" : "high";
}
