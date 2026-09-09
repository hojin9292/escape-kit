import type { PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import { mountRecapBoard } from "../_shared/recap-board";
import manifestJson from "./manifest.json";

const manifest = manifestJson as PuzzleManifest;
export const forceShelfOrder: PuzzleModule = {
  manifest,
  mount: (api) => mountRecapBoard(api, {
    className: "ob-recap-root", testIdPrefix: "ob-shelf", solveTestId: manifest.testIds.solveCheck,
    doneText: "물건을 다룰 때의 네 가지를 모두 확인했어요!",
    cards: [
      { id: "pencil-grip", asset: "tool-pencil-grip", name: "연필 잡기", recap: "흔들리지 않을 만큼" },
      { id: "faucet-turn", asset: "tool-faucet-turn", name: "수도꼭지", recap: "물이 알맞게 나올 만큼" },
      { id: "book-stack", asset: "tool-book-stack", name: "책 쌓기", recap: "넘어지지 않을 만큼" },
      { id: "glue-spread", asset: "tool-glue-spread", name: "풀 바르기", recap: "모서리에 조금씩" },
    ],
  }),
};
