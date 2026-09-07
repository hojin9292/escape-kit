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

// 배열 순서 = 저널의 원리 카드 나열 순서. 관례상 방 안 배치 동선 순서 + 콘솔은 마지막.
export const puzzles: PuzzleModule[] = [
  toothpasteSqueeze,
  handSanitizerPump,
  brushingTimer,
  toiletPaperPull,
  soapShelfOrder,
];

export function findPuzzle(id: string): PuzzleModule | undefined {
  return puzzles.find((p) => p.manifest.id === id);
}
