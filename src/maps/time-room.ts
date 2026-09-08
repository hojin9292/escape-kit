/**
 * 「시간과 횟수 방」 — 시간과 횟수. 6방 계획의 **마지막 방**.
 * 앞 방들과 같은 뼈대이되, 출구가 게임 전체의 엔딩이다(door.ending=true).
 * docs/curriculum-map.md·docs/puzzles/room6-overview.md 참조.
 */
import type { GameMap } from "./types";

export const timeRoom: GameMap = {
  id: "time-room",
  title: "시간과 횟수 방",
  icon: "⏰",
  cols: 14,
  rows: 14,
  spawn: [2, 7],
  background: { sprite: "room-time", scale: 1.485, scaleY: 1.246, offsetX: -930, offsetY: -540 },
  blocks: [
    { x0: -1, y0: -1, x1: 14, y1: 0.9 },
    { x0: -1, y0: -1, x1: 0.9, y1: 14 },
  ],
  // 마지막 방 전용 엔딩 대사 — 안 주면 엔진 기본값(#epilogue-*)이 재생되는데,
  // 기본값은 "다음 방은 나도 아직 준비 못 했어"라 마지막 방에는 맞지 않는다.
  epilogue: {
    open: "#epilogue-final-open",
    notesComplete: "#epilogue-final-notes-complete",
    notesIncomplete: "#epilogue-final-notes-incomplete",
  },
  sealed: [
    {
      id: "shelf-corner",
      area: [{ x0: 5.5, y0: 9.5, x1: 12.5, y1: 13.5 }],
      opensWhen: [
        "code:microwave-solved",
        "code:homework-solved",
        "code:crosswalk-solved",
        "code:friend-solved",
      ],
    },
  ],
  objects: [
    {
      id: "microwave-wait",
      name: "전자레인지",
      icon: "📟",
      tile: [4, 3],
      range: 1.6,
      puzzleId: "microwave-wait",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "homework-check",
      name: "숙제",
      icon: "✅",
      tile: [11, 3],
      range: 1.6,
      puzzleId: "homework-check",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "crosswalk-signal",
      name: "횡단보도",
      icon: "🚦",
      tile: [4, 6.5],
      range: 1.6,
      puzzleId: "crosswalk-signal",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "friend-turn-wait",
      name: "이야기하는 친구",
      icon: "💬",
      tile: [11, 6.5],
      range: 1.6,
      puzzleId: "friend-turn-wait",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "wait-shelf-order",
      name: "기다림 진열대",
      icon: "↕️",
      tile: [9, 11.5],
      range: 1.8,
      puzzleId: "wait-shelf-order",
      interactAnchor: "#ti-shelf-sealed",
    },
    {
      id: "exit-door",
      name: "교실 문 — 출구",
      icon: "🚪",
      tile: [7, 1],
      range: 1.6,
      interactAnchor: "#sys-door-locked",
      door: { requiresEvent: "door:time-open", ending: true },
    },
    { id: "note-26", name: "쪽지", sprite: "note", tile: [3, 1.5], range: 1.2, noteId: "note-26" },
    { id: "note-27", name: "쪽지", sprite: "note", tile: [12, 1.5], range: 1.2, noteId: "note-27" },
    { id: "note-28", name: "쪽지", sprite: "note", tile: [2.5, 8], range: 1.2, noteId: "note-28" },
    { id: "note-29", name: "쪽지", sprite: "note", tile: [12.5, 8], range: 1.2, noteId: "note-29" },
    { id: "note-30", name: "쪽지", sprite: "note", tile: [10.5, 12.5], range: 1.2, noteId: "note-30" },
    {
      id: "s-ti-shelf-hint",
      name: "메모판",
      tile: [7.5, 12.8],
      range: 1.6,
      search: { anchor: "#search-ti-shelf-hint" },
    },
    {
      id: "s-ti-board",
      name: "게시판",
      tile: [2, 4.5],
      range: 1.6,
      search: { anchor: "#search-ti-board" },
    },
  ],
};
