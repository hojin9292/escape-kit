import type { PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import { mountRecapBoard } from "../_shared/recap-board";
import manifestJson from "./manifest.json";

const manifest = manifestJson as PuzzleManifest;
export const waitShelfOrder: PuzzleModule = {
  manifest,
  mount: (api) => mountRecapBoard(api, {
    className: "ti-recap-root", testIdPrefix: "ti-shelf", solveTestId: manifest.testIds.solveCheck,
    doneText: "기다려야 할 때의 네 가지를 모두 확인했어요!",
    cards: [
      { id: "microwave-wait", icon: "🔔", name: "전자레인지", recap: "알림이 울릴 때까지" },
      { id: "homework-check", icon: "✅", name: "숙제 확인", recap: "한 번 차분히" },
      { id: "crosswalk-signal", icon: "🚦", name: "횡단보도", recap: "초록불을 확인하고" },
      { id: "friend-turn-wait", icon: "🤝", name: "친구 차례", recap: "내 차례까지 기다리기" },
    ],
  }),
};
