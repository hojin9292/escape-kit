# 「함께 지내는 방」(함께 지내기) — 방 설계서

방 = `social-room`. 앞 방들과 같은 뼈대(자유 순서 퍼즐 4개 → 봉인된 진열대 코너 →
서열 콘솔). 배경 아트 없음(뼈대 단계).

## 방 구조

```
입장 (spawn) ─ P1 엘리베이터 거리 / P2 좁은 길 부탁하기 / P3 다가가기 / P4 버스 가방 자리
거리 진열대 코너 [sealed shelf-corner, opensWhen: 4개 code:*-solved 전부]
  ─ 최종 콘솔 distance-shelf-order(복습 보드, gate 없음) → door:social-open → 출구
```

## 정보 배정표

| 퍼즐 | 근거 문항 | 조작 | 판정 핵심 | 보상(이벤트) |
|---|---|---|---|---|
| P1 elevator-distance | SO-003 | 탭으로 가까이/멀리(이산+되돌리기) | 거리 구간(low=너무 가까움) | `code:elevator-solved` |
| P2 shoulder-tap | 재구성 | **상황 카드 선택** | 밀지 않고 말로 부탁한 뒤 기다리기 | `code:tap-solved` |
| P3 approach-friend | SO-014 | 자동 접근 관찰형(brushing-timer 계열, 방향 반전) | 거리 구간 | `code:approach-solved` |
| P4 bag-space | SO-015 재구성 | **놓을 곳 카드 선택** | 좌석·통로를 막지 않는 위치 | `code:bag-solved` |
| 최종 distance-shelf-order | SO-003·010·014·015 | 활동 카드 확인(순서 없음) | 네 장 모두 확인 | `door:social-open` |

**주의(값 의미 반전)**: 거리 계열 문항은 "값이 작다=가깝다"이므로 `low` 판정이
"너무 가까움", `high` 판정이 "너무 멂"이다 — 금액·개수 계열(치약·물 등)과 low/high의
체감 방향이 반대다. imankeum 원본의 `feedback.tooLow/tooHigh` 문구는 계열마다
방향이 다르게 쓰여 있어(예: SO-001은 tooLow 텍스트가 "가까이 가도 된다"인데 실제
outcome은 tooLow일 때 상대가 물러나는 모습 — 즉 tooLow=너무 가까움) 그대로 베끼면
헷갈리므로, 이 방의 대사는 원본 `outcome` 서술을 근거로 방향을 다시 확인해 썼다.

## 최종 `distance-shelf-order`

- 4개 퍼즐을 모두 풀면 진열대 봉인이 걷히고 열린다.
- 앞에서 연습한 네 활동 카드를 어떤 순서로든 눌러 모두 확인한다. 오답은 없다.
