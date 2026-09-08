/**
 * 「함께 지내는 방」 — 함께 지내기(사회적 거리·관계).
 * 앞 방들과 같은 뼈대. 배경 아트 없음(뼈대 단계).
 * docs/curriculum-map.md·docs/puzzles/room4-overview.md 참조.
 */
import type { GameMap } from "./types";

export const socialRoom: GameMap = {
  id: "social-room",
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
      opensWhen: [
        "code:elevator-solved",
        "code:tap-solved",
        "code:approach-solved",
        "code:bag-solved",
      ],
    },
  ],
  objects: [
    {
      id: "elevator-distance",
      name: "엘리베이터",
      tile: [4, 3],
      range: 1.6,
      puzzleId: "elevator-distance",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "shoulder-tap",
      name: "짝꿍",
      tile: [11, 3],
      range: 1.6,
      puzzleId: "shoulder-tap",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "approach-friend",
      name: "책 읽는 친구",
      tile: [4, 6.5],
      range: 1.6,
      puzzleId: "approach-friend",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "bag-space",
      name: "버스 좌석",
      tile: [11, 6.5],
      range: 1.6,
      puzzleId: "bag-space",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "distance-shelf-order",
      name: "거리 진열대",
      tile: [9, 11.5],
      range: 1.8,
      puzzleId: "distance-shelf-order",
      interactAnchor: "#so-shelf-sealed",
    },
    {
      id: "exit-door",
      name: "교실 문 — 다음 방으로",
      tile: [7, 1],
      range: 1.6,
      interactAnchor: "#sys-door-locked",
      door: { requiresEvent: "door:social-open", ending: true },
    },
    { id: "note-16", name: "쪽지", sprite: "note", tile: [3, 1.5], range: 1.2, noteId: "note-16" },
    { id: "note-17", name: "쪽지", sprite: "note", tile: [12, 1.5], range: 1.2, noteId: "note-17" },
    { id: "note-18", name: "쪽지", sprite: "note", tile: [2.5, 8], range: 1.2, noteId: "note-18" },
    { id: "note-19", name: "쪽지", sprite: "note", tile: [12.5, 8], range: 1.2, noteId: "note-19" },
    { id: "note-20", name: "쪽지", sprite: "note", tile: [10.5, 12.5], range: 1.2, noteId: "note-20" },
    {
      id: "s-so-shelf-hint",
      name: "메모판",
      tile: [7.5, 12.8],
      range: 1.6,
      search: { anchor: "#search-so-shelf-hint" },
    },
    {
      id: "s-so-board",
      name: "게시판",
      tile: [2, 4.5],
      range: 1.6,
      search: { anchor: "#search-so-board" },
    },
  ],
};
