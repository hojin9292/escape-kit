import type { PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import { mountRecapBoard } from "../_shared/recap-board";
import manifestJson from "./manifest.json";

const manifest = manifestJson as PuzzleManifest;
export const voiceShelfOrder: PuzzleModule = {
  manifest,
  mount: (api) => mountRecapBoard(api, {
    className: "co-recap-root", testIdPrefix: "co-shelf", solveTestId: manifest.testIds.solveCheck,
    doneText: "대화할 때의 네 가지를 모두 확인했어요!",
    cards: [
      { id: "voice-volume", icon: "🔊", name: "도서관 목소리", recap: "바로 옆 친구에게 작게" },
      { id: "call-name", icon: "🙋", name: "이름 부르기", recap: "한두 번 부르고 기다리기" },
      { id: "wait-answer", icon: "⏳", name: "대답 기다리기", recap: "상대가 나를 보면 듣기" },
      { id: "story-turn", icon: "💬", name: "차례 지키기", recap: "말하고 들어 주기" },
    ],
  }),
};
