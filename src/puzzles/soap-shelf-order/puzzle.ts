import type { PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import { mountRecapBoard } from "../_shared/recap-board";
import manifestJson from "./manifest.json";

const manifest = manifestJson as PuzzleManifest;
export const soapShelfOrder: PuzzleModule = {
  manifest,
  mount: (api) => mountRecapBoard(api, {
    className: "hy-recap-root", testIdPrefix: "shelf", solveTestId: manifest.testIds.solveCheck,
    doneText: "네 가지를 모두 기억했어요! 문이 열렸어요.",
    cards: [
      { id: "toothpaste-squeeze", icon: "🪥", name: "치약 짜기", recap: "완두콩 한 알만큼" },
      { id: "hand-sanitizer-pump", icon: "🧴", name: "손 소독제", recap: "손바닥에 한 번" },
      { id: "brushing-timer", icon: "⏱️", name: "양치 시간", recap: "구역을 나누어 천천히" },
      { id: "toilet-paper-pull", icon: "🧻", name: "휴지 사용", recap: "필요한 만큼만" },
    ],
  }),
};
