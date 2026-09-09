# 「시간과 횟수 방」(시간과 횟수) — 방 설계서 (마지막 방)

방 = `time-room`. 앞 방들과 같은 뼈대이되, 6방 계획의 **마지막 방**이라 출구가
`door: { ending: true }`이고 전용 엔딩 대사(`GameMap.epilogue` → `#epilogue-final-*`)를
쓴다. 배경 아트 없음(뼈대 단계).

## 방 구조

```
입장 (spawn) ─ P1 전자레인지 / P2 숙제 확인 / P3 횡단보도 / P4 친구 말 끝나기
기다림 진열대 코너 [sealed shelf-corner, opensWhen: 4개 code:*-solved 전부]
  ─ 최종 콘솔 wait-shelf-order(복습 보드, gate 없음) → door:time-open → 출구(엔딩)
```

## 정보 배정표

| 퍼즐 | 근거 문항 | 조작 | 판정 핵심 | 보상(이벤트) |
|---|---|---|---|---|
| P1 microwave-wait | TI-003 | 관찰형(정방향, brushing-timer 계열) | 기다림 스텝 구간 | `code:microwave-solved` |
| P2 homework-check | TI-013 | 되돌리기 없는 횟수 세기 | 1~2회 | `code:homework-solved` |
| P3 crosswalk-signal | TI-014 | 관찰형(정방향, 안전 특화) | 신호 스텝 구간 | `code:crosswalk-solved` |
| P4 friend-turn-wait | TI-018 | 관찰형(정방향) | 기다림 스텝 구간 | `code:friend-solved` |
| 최종 wait-shelf-order | TI-003·013·014·018 | 활동 카드 확인(순서 없음) | 네 장 모두 확인 | `door:time-open`(게임 전체 출구) |

설계 방침: 이 방은 원래 문항 대부분이 "얼마나 기다릴까" 판단이라 퍼즐 넷 중
셋이 관찰형에 몰린다 — 조작 다양성 원칙 위반이 아니라 "시간과 횟수" 영역의
본질이다(curriculum-map.md 예외 표 참조). `crosswalk-signal`은 `answer.unit`이
`"event"`인 특수 문항을 신호등 관찰형으로 이산화한 것.

## 최종 `wait-shelf-order` — 게임 전체의 마지막 자물쇠

- 4개 퍼즐을 모두 풀면 진열대 봉인이 걷히고 열린다.
- 앞에서 연습한 네 활동 카드를 어떤 순서로든 눌러 모두 확인한다. 오답은 없다.
- 이 퍼즐의 `reward.event`(`door:time-open`)가 게임 전체의 출구를 연다 — 마지막
  방이므로 `door.ending: true`.
