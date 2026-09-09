import { isRecapComplete as check } from "../_shared/recap";
export const RECAP_IDS = ["microwave-wait", "homework-check", "crosswalk-signal", "friend-turn-wait"] as const;
export const isRecapComplete = (selected: readonly string[]): boolean => check(selected, RECAP_IDS);
