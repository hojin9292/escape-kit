import { isRecapComplete as check } from "../_shared/recap";
export const RECAP_IDS = ["toothpaste-squeeze", "hand-sanitizer-pump", "brushing-timer", "toilet-paper-pull"] as const;
export const isRecapComplete = (selected: readonly string[]): boolean => check(selected, RECAP_IDS);
