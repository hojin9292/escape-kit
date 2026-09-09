import type { PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import { mountRecapBoard } from "../_shared/recap-board";
import manifestJson from "./manifest.json";

const manifest = manifestJson as PuzzleManifest;
export const distanceShelfOrder: PuzzleModule = {
  manifest,
  mount: (api) => mountRecapBoard(api, {
    className: "so-recap-root", testIdPrefix: "so-shelf", solveTestId: manifest.testIds.solveCheck,
    doneText: "함께 있을 때의 네 가지 배려를 모두 확인했어요!",
    cards: [
      { id: "elevator-distance", icon: "↔️", name: "엘리베이터 거리", recap: "서로 편한 간격" },
      { id: "shoulder-tap", icon: "💬", name: "좁은 길 부탁하기", recap: "먼저 말하고 기다리기" },
      { id: "approach-friend", icon: "👥", name: "친구에게 다가가기", recap: "시야를 가리지 않는 거리" },
      { id: "bag-space", icon: "🎒", name: "버스 가방 자리", recap: "자리와 통로 비우기" },
    ],
  }),
};
