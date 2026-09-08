/**
 * 「말하고 듣는 방」 — 말하고 듣기.
 * hygiene-room·food-room과 같은 뼈대. 배경 아트 없음(뼈대 단계).
 * docs/curriculum-map.md·docs/puzzles/room3-overview.md 참조.
 */
import type { GameMap } from "./types";

export const communicationRoom: GameMap = {
  id: "communication-room",
  title: "말하고 듣는 방",
  icon: "💬",
  cols: 14,
  rows: 14,
  spawn: [2, 7],
  background: { sprite: "room-communication", scale: 1.485, scaleY: 1.246, offsetX: -930, offsetY: -540 },
  blocks: [
    { x0: -1, y0: -1, x1: 14, y1: 0.9 },
    { x0: -1, y0: -1, x1: 0.9, y1: 14 },
  ],
  sealed: [
    {
      id: "shelf-corner",
      area: [{ x0: 5.5, y0: 9.5, x1: 12.5, y1: 13.5 }],
      opensWhen: ["code:voice-solved", "code:call-solved", "code:wait-solved", "code:story-solved"],
    },
  ],
  objects: [
    {
      id: "voice-volume",
      name: "짝꿍",
      icon: "🔊",
      tile: [4, 3],
      range: 1.6,
      puzzleId: "voice-volume",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "call-name",
      name: "선생님",
      icon: "🙋",
      tile: [11, 3],
      range: 1.6,
      puzzleId: "call-name",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "wait-answer",
      name: "질문 상자",
      icon: "⏳",
      tile: [4, 6.5],
      range: 1.6,
      puzzleId: "wait-answer",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "story-turn",
      name: "이야기 의자",
      icon: "🗣️",
      tile: [11, 6.5],
      range: 1.6,
      puzzleId: "story-turn",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "voice-shelf-order",
      name: "목소리 진열대",
      icon: "↕️",
      tile: [9, 11.5],
      range: 1.8,
      puzzleId: "voice-shelf-order",
      interactAnchor: "#co-shelf-sealed",
    },
    {
      id: "exit-door",
      name: "교실 문 — 다음 방으로",
      icon: "🚪",
      tile: [7, 1],
      range: 1.6,
      interactAnchor: "#sys-door-locked",
      door: { requiresEvent: "door:communication-open", toMap: "social-room", spawn: [2, 7] },
    },
    { id: "note-11", name: "쪽지", sprite: "note", tile: [3, 1.5], range: 1.2, noteId: "note-11" },
    { id: "note-12", name: "쪽지", sprite: "note", tile: [12, 1.5], range: 1.2, noteId: "note-12" },
    { id: "note-13", name: "쪽지", sprite: "note", tile: [2.5, 8], range: 1.2, noteId: "note-13" },
    { id: "note-14", name: "쪽지", sprite: "note", tile: [12.5, 8], range: 1.2, noteId: "note-14" },
    { id: "note-15", name: "쪽지", sprite: "note", tile: [10.5, 12.5], range: 1.2, noteId: "note-15" },
    {
      id: "s-co-shelf-hint",
      name: "메모판",
      tile: [7.5, 12.8],
      range: 1.6,
      search: { anchor: "#search-co-shelf-hint" },
    },
    {
      id: "s-co-board",
      name: "게시판",
      tile: [2, 4.5],
      range: 1.6,
      search: { anchor: "#search-co-board" },
    },
  ],
};
