/**
 * 「먹고 마시는 방」 — 먹고 마시기.
 *
 * hygiene-room과 같은 뼈대(4개 자유 순서 퍼즐 → 봉인된 정리대 코너 → 서열 콘솔).
 * 배경 아트 없음(뼈대 단계) — 기본 타일 바닥 위에 스프라이트 없는 핫스팟으로 구성.
 *
 * docs/curriculum-map.md·docs/puzzles/room2-overview.md 참조.
 */
import type { GameMap } from "./types";

export const foodRoom: GameMap = {
  id: "food-room",
  cols: 14,
  rows: 14,
  spawn: [2, 7],
  blocks: [
    { x0: -1, y0: -1, x1: 14, y1: 0.9 }, // 북쪽 벽 띠
    { x0: -1, y0: -1, x1: 0.9, y1: 14 }, // 서쪽 벽 띠
  ],
  // 식탁 정리대 코너 — 4개 퍼즐을 전부 풀어야 열린다
  sealed: [
    {
      id: "shelf-corner",
      area: [{ x0: 5.5, y0: 9.5, x1: 12.5, y1: 13.5 }],
      opensWhen: [
        "code:water-solved",
        "code:ice-solved",
        "code:jam-solved",
        "code:topping-solved",
      ],
    },
  ],
  objects: [
    // ── 식사 준비 퍼즐 4개 (순서 자유) ─────────────────
    {
      id: "water-pour",
      name: "컵과 물병",
      tile: [4, 3],
      range: 1.6,
      puzzleId: "water-pour",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "ice-drop",
      name: "얼음통",
      tile: [11, 3],
      range: 1.6,
      puzzleId: "ice-drop",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "jam-spread",
      name: "식빵과 잼",
      tile: [4, 6.5],
      range: 1.6,
      puzzleId: "jam-spread",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "yogurt-topping",
      name: "요거트",
      tile: [11, 6.5],
      range: 1.6,
      puzzleId: "yogurt-topping",
      interactAnchor: "#sys-console-locked",
    },
    // ── 식탁 정리대 코너 (봉인 안) ──────────────────────
    {
      id: "pour-shelf-order",
      name: "식탁 정리대",
      tile: [9, 11.5],
      range: 1.8,
      puzzleId: "pour-shelf-order",
      interactAnchor: "#fo-shelf-sealed",
    },
    // ── 출구 — 「말하고 듣는 방」으로 연결 ───────────────
    {
      id: "exit-door",
      name: "급식실 문 — 다음 방으로",
      tile: [7, 1],
      range: 1.6,
      interactAnchor: "#sys-door-locked",
      door: { requiresEvent: "door:food-open", toMap: "communication-room", spawn: [2, 7] },
    },
    // ── 연구노트 5개 ────────────────────────────────────
    { id: "note-06", name: "쪽지", sprite: "note", tile: [3, 1.5], range: 1.2, noteId: "note-06" },
    { id: "note-07", name: "쪽지", sprite: "note", tile: [12, 1.5], range: 1.2, noteId: "note-07" },
    { id: "note-08", name: "쪽지", sprite: "note", tile: [2.5, 8], range: 1.2, noteId: "note-08" },
    { id: "note-09", name: "쪽지", sprite: "note", tile: [12.5, 8], range: 1.2, noteId: "note-09" },
    { id: "note-10", name: "쪽지", sprite: "note", tile: [10.5, 12.5], range: 1.2, noteId: "note-10" },
    // ── 수색 지점 2곳 ───────────────────────────────────
    {
      id: "s-fo-shelf-hint",
      name: "메모판",
      tile: [7.5, 12.8],
      range: 1.6,
      search: { anchor: "#search-fo-shelf-hint" },
    },
    {
      id: "s-fo-table",
      name: "식탁",
      tile: [2, 4.5],
      range: 1.6,
      search: { anchor: "#search-fo-table" },
    },
  ],
};
