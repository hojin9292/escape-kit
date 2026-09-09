import type { PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import { mountRecapBoard } from "../_shared/recap-board";
import manifestJson from "./manifest.json";

const manifest = manifestJson as PuzzleManifest;
export const pourShelfOrder: PuzzleModule = {
  manifest,
  mount: (api) => mountRecapBoard(api, {
    className: "fo-recap-root", testIdPrefix: "fo-shelf", solveTestId: manifest.testIds.solveCheck,
    doneText: "먹고 마실 때의 네 가지를 모두 확인했어요!",
    cards: [
      { id: "water-pour", icon: "🥛", name: "물 따르기", recap: "컵의 안전선까지" },
      { id: "ice-drop", icon: "🧊", name: "얼음 주문", recap: "주문표의 두세 개" },
      { id: "jam-spread", icon: "🍞", name: "잼 바르기", recap: "빵이 비치게 얇고 고르게" },
      { id: "yogurt-topping", icon: "🥣", name: "요거트 주문", recap: "토핑 한 숟가락" },
    ],
  }),
};
