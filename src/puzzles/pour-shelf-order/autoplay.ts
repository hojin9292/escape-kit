import { isRecapComplete as check } from "../_shared/recap";
export const RECAP_IDS = ["water-pour", "ice-drop", "jam-spread", "yogurt-topping"] as const;
export const isRecapComplete = (selected: readonly string[]): boolean => check(selected, RECAP_IDS);
