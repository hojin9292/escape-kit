import { isRecapComplete as check } from "../_shared/recap";
export const RECAP_IDS = ["elevator-distance", "shoulder-tap", "approach-friend", "bag-space"] as const;
export const isRecapComplete = (selected: readonly string[]): boolean => check(selected, RECAP_IDS);
