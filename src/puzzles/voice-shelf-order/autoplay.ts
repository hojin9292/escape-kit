import { isRecapComplete as check } from "../_shared/recap";
export const RECAP_IDS = ["voice-volume", "call-name", "wait-answer", "story-turn"] as const;
export const isRecapComplete = (selected: readonly string[]): boolean => check(selected, RECAP_IDS);
