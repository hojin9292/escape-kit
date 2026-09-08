import type { GameMap } from "./types";
import { hygieneRoom } from "./hygiene-room";
import { foodRoom } from "./food-room";
import { communicationRoom } from "./communication-room";

export const maps: Record<string, GameMap> = {
  [hygieneRoom.id]: hygieneRoom,
  [foodRoom.id]: foodRoom,
  [communicationRoom.id]: communicationRoom,
};

/** 프롤로그 다음에 들어서는 첫 방. 이어하기 저장이 없을 때의 시작 지점이기도 하다. */
export const FIRST_ROOM = hygieneRoom;

/**
 * 방 사슬 — 순서대로 진행되며, 각 방의 unlockEvent가 발화되면 다음 방의 문이 열린다.
 * `__qe.warp`가 이 데이터를 사용한다. 방을 추가할 때 여기와 maps에만 등록하면
 * 엔진 수정이 필요 없다.
 *
 * 사슬 연결 규칙: 새 방이 **플레이 가능해진 뒤에** 앞 방의 출구 문을
 * `{ toMap, spawn }`으로 바꾼다 — 먼저 바꾸면 완성된 방이 미완성 방으로 떨어진다.
 * 마지막 방의 출구는 `door: { ending: true }`로 엔딩을 담당한다.
 */
export const ROOM_CHAIN: { id: string; unlockEvent: string }[] = [
  { id: hygieneRoom.id, unlockEvent: "door:hygiene-open" },
  { id: foodRoom.id, unlockEvent: "door:food-open" },
  { id: communicationRoom.id, unlockEvent: "door:communication-open" },
];

/**
 * 첫 방을 뺀 나머지 방의 입장 대사 앵커 — main.ts의 registerRoomIntros가 map:enter로
 * 재생한다. 첫 방(FIRST_ROOM)은 프롤로그 대사 뒤에 와야 하므로 여기 넣지 않고
 * startPrologue에서 직접 재생한다.
 */
export const ROOM_INTRO_ANCHOR: Record<string, string> = {
  [foodRoom.id]: "#fo-room-intro",
  [communicationRoom.id]: "#co-room-intro",
};
