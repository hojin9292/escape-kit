# 「말하고 듣는 방」(말하고 듣기) — 방 설계서

> `docs/puzzles/room1-overview.md`(1번 방)의 절 구성을 따른다.

방 = `communication-room`. hygiene-room·food-room과 같은 뼈대(자유 순서 퍼즐 4개 →
봉인된 진열대 코너 → 서열 콘솔). 배경 아트 없음(뼈대 단계).

## 방 구조

```
입장 (spawn) ─ P1 목소리 크기 / P2 선생님 부르기 / P3 질문 후 기다리기 / P4 내 이야기 길이
목소리 진열대 코너 [sealed shelf-corner, opensWhen: 4개 code:*-solved 전부]
  ─ 최종 콘솔 voice-shelf-order(서열 퍼즐, gate 없음) → door:communication-open → 출구
```

## 정보 배정표

| 퍼즐 | 근거 문항 | 조작 | 판정 핵심 | 보상(이벤트) |
|---|---|---|---|---|
| P1 voice-volume | CO-003 | 탭으로 크게/작게(1번 방 toothpaste-squeeze 계열) | 목소리 크기 구간 | `code:voice-solved` |
| P2 call-name | CO-007 | 되돌리기 없는 횟수 세기(1번 방 hand-sanitizer-pump 계열) | 1~2회 | `code:call-solved` |
| P3 wait-answer | CO-008 | 관찰 후 단발 입력(정방향, brushing-timer 계열) | 기다림 스텝 구간 | `code:wait-solved` |
| P4 story-turn | CO-014 | 관찰 후 단발 입력(역방향, yogurt-topping 계열) | 카드 스텝 구간 | `code:story-solved` |
| 최종 voice-shelf-order | CO-016·005·013·002 | 탭으로 순서 배치 | 정답 순열 유일 | `door:communication-open` |

이미 검증된 조작 어휘를 다른 상황(장소·사람)에 재사용한다 — 매 방 새 조작을
발명하지 않고 같은 조작을 다른 맥락에 적용하는 것 자체가 일반화 학습이다.

## 최종 `voice-shelf-order`

- 4개 퍼즐을 모두 풀면 진열대 봉인이 걷히고 열린다.
- 장소 카드 4개(공연장·버스·식당·운동장)를 작은 목소리부터 큰 목소리 순서로 놓는다.
- 정답 순서(중앙값 오름차순): 공연장(15) → 버스(31) → 식당(49) → 운동장(72.5).
