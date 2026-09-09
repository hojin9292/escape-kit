/** 좁은 길에서 부탁하기 — 상황 선택 정답 상수. 기존 ID는 저장 호환을 위해 유지한다. */
export const CHOICES = ["push", "ask-and-wait", "shout"] as const;
export type Choice = (typeof CHOICES)[number];
export type Judgment = "low" | "good" | "high";
export const SOLVE_CHOICE = 1;
export function judge(choice: Choice): Judgment {
  if (choice === "ask-and-wait") return "good";
  return choice === "push" ? "low" : "high";
}
