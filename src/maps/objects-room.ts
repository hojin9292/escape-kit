/**
 * 「물건 쓰는 방」 — 물건 사용하기.
 * 앞 방들과 같은 뼈대. 배경 아트 없음(뼈대 단계).
 * docs/curriculum-map.md·docs/puzzles/room5-overview.md 참조.
 */
import type { GameMap } from "./types";

export const objectsRoom: GameMap = {
  id: "objects-room",
  cols: 14,
  rows: 14,
  spawn: [2, 7],
  blocks: [
    { x0: -1, y0: -1, x1: 14, y1: 0.9 },
    { x0: -1, y0: -1, x1: 0.9, y1: 14 },
  ],
  sealed: [
    {
      id: "shelf-corner",
      area: [{ x0: 5.5, y0: 9.5, x1: 12.5, y1: 13.5 }],
      opensWhen: ["code:pencil-solved", "code:faucet-solved", "code:book-solved", "code:glue-solved"],
    },
  ],
  objects: [
    {
      id: "pencil-grip",
      name: "연필",
      tile: [4, 3],
      range: 1.6,
      puzzleId: "pencil-grip",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "faucet-turn",
      name: "수도꼭지",
      tile: [11, 3],
      range: 1.6,
      puzzleId: "faucet-turn",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "book-stack",
      name: "책상",
      tile: [4, 6.5],
      range: 1.6,
      puzzleId: "book-stack",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "glue-spread",
      name: "풀과 종이",
      tile: [11, 6.5],
      range: 1.6,
      puzzleId: "glue-spread",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "force-shelf-order",
      name: "힘 진열대",
      tile: [9, 11.5],
      range: 1.8,
      puzzleId: "force-shelf-order",
      interactAnchor: "#ob-shelf-sealed",
    },
    {
      id: "exit-door",
      name: "교실 문 — 다음 방으로",
      tile: [7, 1],
      range: 1.6,
      interactAnchor: "#sys-door-locked",
      door: { requiresEvent: "door:objects-open", ending: true },
    },
    { id: "note-21", name: "쪽지", sprite: "note", tile: [3, 1.5], range: 1.2, noteId: "note-21" },
    { id: "note-22", name: "쪽지", sprite: "note", tile: [12, 1.5], range: 1.2, noteId: "note-22" },
    { id: "note-23", name: "쪽지", sprite: "note", tile: [2.5, 8], range: 1.2, noteId: "note-23" },
    { id: "note-24", name: "쪽지", sprite: "note", tile: [12.5, 8], range: 1.2, noteId: "note-24" },
    { id: "note-25", name: "쪽지", sprite: "note", tile: [10.5, 12.5], range: 1.2, noteId: "note-25" },
    {
      id: "s-ob-shelf-hint",
      name: "메모판",
      tile: [7.5, 12.8],
      range: 1.6,
      search: { anchor: "#search-ob-shelf-hint" },
    },
    {
      id: "s-ob-board",
      name: "게시판",
      tile: [2, 4.5],
      range: 1.6,
      search: { anchor: "#search-ob-board" },
    },
  ],
};
