/**
 * 퍼즐 등록부. add-puzzle 절차(puzzle-builder)가 여기 등록한다.
 * 여기 없는 퍼즐은 로드되지 않는다 — 맵의 `puzzleId`가 만족되지 않으면
 * 그 오브젝트는 `interactAnchor` 대사만 띄운다.
 */
import type { PuzzleModule } from "./engine/puzzle-host/types";
import { toothpasteSqueeze } from "./puzzles/toothpaste-squeeze/puzzle";
import { handSanitizerPump } from "./puzzles/hand-sanitizer-pump/puzzle";
import { brushingTimer } from "./puzzles/brushing-timer/puzzle";
import { toiletPaperPull } from "./puzzles/toilet-paper-pull/puzzle";
import { soapShelfOrder } from "./puzzles/soap-shelf-order/puzzle";
import { waterPour } from "./puzzles/water-pour/puzzle";
import { iceDrop } from "./puzzles/ice-drop/puzzle";
import { jamSpread } from "./puzzles/jam-spread/puzzle";
import { yogurtTopping } from "./puzzles/yogurt-topping/puzzle";
import { pourShelfOrder } from "./puzzles/pour-shelf-order/puzzle";
import { voiceVolume } from "./puzzles/voice-volume/puzzle";
import { callName } from "./puzzles/call-name/puzzle";
import { waitAnswer } from "./puzzles/wait-answer/puzzle";
import { storyTurn } from "./puzzles/story-turn/puzzle";
import { voiceShelfOrder } from "./puzzles/voice-shelf-order/puzzle";
import { elevatorDistance } from "./puzzles/elevator-distance/puzzle";
import { shoulderTap } from "./puzzles/shoulder-tap/puzzle";
import { approachFriend } from "./puzzles/approach-friend/puzzle";
import { bagSpace } from "./puzzles/bag-space/puzzle";
import { distanceShelfOrder } from "./puzzles/distance-shelf-order/puzzle";
import { pencilGrip } from "./puzzles/pencil-grip/puzzle";
import { faucetTurn } from "./puzzles/faucet-turn/puzzle";
import { bookStack } from "./puzzles/book-stack/puzzle";
import { glueSpread } from "./puzzles/glue-spread/puzzle";
import { forceShelfOrder } from "./puzzles/force-shelf-order/puzzle";
import { microwaveWait } from "./puzzles/microwave-wait/puzzle";
import { homeworkCheck } from "./puzzles/homework-check/puzzle";
import { crosswalkSignal } from "./puzzles/crosswalk-signal/puzzle";
import { friendTurnWait } from "./puzzles/friend-turn-wait/puzzle";
import { waitShelfOrder } from "./puzzles/wait-shelf-order/puzzle";

// 배열 순서 = 저널의 원리 카드 나열 순서. 관례상 방 안 배치 동선 순서 + 콘솔은 마지막,
// 방 순서(hygiene → food → communication → social → objects → time)대로 이어 붙인다.
export const puzzles: PuzzleModule[] = [
  toothpasteSqueeze,
  handSanitizerPump,
  brushingTimer,
  toiletPaperPull,
  soapShelfOrder,
  waterPour,
  iceDrop,
  jamSpread,
  yogurtTopping,
  pourShelfOrder,
  voiceVolume,
  callName,
  waitAnswer,
  storyTurn,
  voiceShelfOrder,
  elevatorDistance,
  shoulderTap,
  approachFriend,
  bagSpace,
  distanceShelfOrder,
  pencilGrip,
  faucetTurn,
  bookStack,
  glueSpread,
  forceShelfOrder,
  microwaveWait,
  homeworkCheck,
  crosswalkSignal,
  friendTurnWait,
  waitShelfOrder,
];

export function findPuzzle(id: string): PuzzleModule | undefined {
  return puzzles.find((p) => p.manifest.id === id);
}
