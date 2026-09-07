/**
 * 퍼즐 등록부. add-puzzle 절차(puzzle-builder)가 여기 등록한다.
 * 여기 없는 퍼즐은 로드되지 않는다 — 맵의 `puzzleId`가 만족되지 않으면
 * 그 오브젝트는 `interactAnchor` 대사만 띄운다.
 */
import type { PuzzleModule } from "./engine/puzzle-host/types";
import { toothpasteSqueeze } from "./puzzles/toothpaste-squeeze/puzzle";

export const puzzles: PuzzleModule[] = [toothpasteSqueeze];

export function findPuzzle(id: string): PuzzleModule | undefined {
  return puzzles.find((p) => p.manifest.id === id);
}
