import { isRecapComplete as check } from "../_shared/recap";
export const RECAP_IDS = ["pencil-grip", "faucet-turn", "book-stack", "glue-spread"] as const;
export const isRecapComplete = (selected: readonly string[]): boolean => check(selected, RECAP_IDS);
