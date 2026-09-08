/**
 * 「깨끗한 방」 — 몸과 주변을 깨끗이 하기.
 *
 * 배경 아트 없음(뼈대 단계) — 기본 타일 바닥 위에 스프라이트 없는 핫스팟으로 구성.
 * 구조: 4개 청소 퍼즐(순서 자유, 봉인 밖) → 전부 풀면 정리대 코너 봉인이 걷힌다 →
 * 정리대의 서열 퍼즐(soap-shelf-order)이 `door:hygiene-open`을 발화 → 출구 개방.
 *
 * docs/curriculum-map.md·docs/puzzles/room1-overview.md 참조.
 */
import type { GameMap } from "./types";

export const hygieneRoom: GameMap = {
  id: "hygiene-room",
  title: "깨끗한 방",
  icon: "🫧",
  cols: 14,
  rows: 14,
  spawn: [2, 7],
  background: { sprite: "room-hygiene", scale: 1.485, scaleY: 1.246, offsetX: -930, offsetY: -540 },
  blocks: [
    { x0: -1, y0: -1, x1: 14, y1: 0.9 }, // 북쪽 벽 띠
    { x0: -1, y0: -1, x1: 0.9, y1: 14 }, // 서쪽 벽 띠
  ],
  // 정리대 코너 — 4개 퍼즐을 전부 풀어야 열린다
  sealed: [
    {
      id: "shelf-corner",
      area: [{ x0: 5.5, y0: 9.5, x1: 12.5, y1: 13.5 }],
      opensWhen: [
        "code:tooth-solved",
        "code:sani-solved",
        "code:brush-solved",
        "code:paper-solved",
      ],
    },
  ],
  objects: [
    // ── 청소 퍼즐 4개 (순서 자유) ──────────────────────
    {
      id: "toothpaste-squeeze",
      name: "치약과 칫솔",
      icon: "🪥",
      tile: [4, 3],
      range: 1.6,
      puzzleId: "toothpaste-squeeze",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "hand-sanitizer-pump",
      name: "손 소독제",
      icon: "🧴",
      tile: [11, 3],
      range: 1.6,
      puzzleId: "hand-sanitizer-pump",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "brushing-timer",
      name: "양치대",
      icon: "⏱️",
      tile: [4, 6.5],
      range: 1.6,
      puzzleId: "brushing-timer",
      interactAnchor: "#sys-console-locked",
    },
    {
      id: "toilet-paper-pull",
      name: "휴지걸이",
      icon: "🧻",
      tile: [11, 6.5],
      range: 1.6,
      puzzleId: "toilet-paper-pull",
      interactAnchor: "#sys-console-locked",
    },
    // ── 정리대 코너 (봉인 안) ───────────────────────────
    {
      id: "soap-shelf-order",
      name: "정리대",
      icon: "↕️",
      tile: [9, 11.5],
      range: 1.8,
      puzzleId: "soap-shelf-order",
      interactAnchor: "#hy-shelf-sealed",
    },
    // ── 출구 — 「먹고 마시는 방」으로 연결 ───────────────
    {
      id: "exit-door",
      name: "교실 문 — 다음 방으로",
      icon: "🚪",
      tile: [7, 1],
      range: 1.6,
      interactAnchor: "#sys-door-locked",
      door: { requiresEvent: "door:hygiene-open", toMap: "food-room", spawn: [2, 7] },
    },
    // ── 연구노트 5개 ────────────────────────────────────
    { id: "note-01", name: "쪽지", sprite: "note", tile: [3, 1.5], range: 1.2, noteId: "note-01" },
    { id: "note-02", name: "쪽지", sprite: "note", tile: [12, 1.5], range: 1.2, noteId: "note-02" },
    { id: "note-03", name: "쪽지", sprite: "note", tile: [2.5, 8], range: 1.2, noteId: "note-03" },
    { id: "note-04", name: "쪽지", sprite: "note", tile: [12.5, 8], range: 1.2, noteId: "note-04" },
    { id: "note-05", name: "쪽지", sprite: "note", tile: [10.5, 12.5], range: 1.2, noteId: "note-05" },
    // ── 수색 지점 2곳 ───────────────────────────────────
    {
      id: "s-hy-shelf-hint",
      name: "메모판",
      tile: [7.5, 12.8],
      range: 1.6,
      search: { anchor: "#search-hy-shelf-hint" },
    },
    {
      id: "s-hy-mirror",
      name: "세면대 거울",
      tile: [2, 4.5],
      range: 1.6,
      search: { anchor: "#search-hy-mirror" },
    },
  ],
};
