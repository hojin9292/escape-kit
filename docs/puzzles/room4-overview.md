# 「함께 지내는 방」(함께 지내기) — 방 설계서

방 = `social-room`. 앞 방들과 같은 뼈대(자유 순서 퍼즐 4개 → 봉인된 진열대 코너 →
서열 콘솔). 배경 아트 없음(뼈대 단계).

## 방 구조

```
입장 (spawn) ─ P1 엘리베이터 거리 / P2 어깨 톡톡 / P3 다가가기 / P4 가방 자리
거리 진열대 코너 [sealed shelf-corner, opensWhen: 4개 code:*-solved 전부]
  ─ 최종 콘솔 distance-shelf-order(서열 퍼즐, gate 없음) → door:social-open → 출구
```

## 정보 배정표

| 퍼즐 | 근거 문항 | 조작 | 판정 핵심 | 보상(이벤트) |
|---|---|---|---|---|
| P1 elevator-distance | SO-003 | 탭으로 가까이/멀리(이산+되돌리기) | 거리 구간(low=너무 가까움) | `code:elevator-solved` |
| P2 shoulder-tap | SO-010 | **단계 선택**(신규 — 1~5단계 중 하나) | 세기 구간 | `code:tap-solved` |
| P3 approach-friend | SO-014 | 자동 접근 관찰형(brushing-timer 계열, 방향 반전) | 거리 구간 | `code:approach-solved` |
| P4 bag-space | SO-015 | 탭으로 올리기/줄이기(이산+되돌리기) | 공간 구간 | `code:bag-solved` |
| 최종 distance-shelf-order | SO-004·002·001·005 | 탭으로 순서 배치 | 정답 순열 유일 | `door:social-open` |

**주의(값 의미 반전)**: 거리 계열 문항은 "값이 작다=가깝다"이므로 `low` 판정이
"너무 가까움", `high` 판정이 "너무 멂"이다 — 금액·개수 계열(치약·물 등)과 low/high의
체감 방향이 반대다. imankeum 원본의 `feedback.tooLow/tooHigh` 문구는 계열마다
방향이 다르게 쓰여 있어(예: SO-001은 tooLow 텍스트가 "가까이 가도 된다"인데 실제
outcome은 tooLow일 때 상대가 물러나는 모습 — 즉 tooLow=너무 가까움) 그대로 베끼면
헷갈리므로, 이 방의 대사는 원본 `outcome` 서술을 근거로 방향을 다시 확인해 썼다.

## 최종 `distance-shelf-order`

- 4개 퍼즐을 모두 풀면 진열대 봉인이 걷히고 열린다.
- 상황 카드 4개(사진 찍기·급식 줄·친구와 이야기·모르는 사람 옆)를 가까운 거리부터
  먼 거리 순서로 놓는다.
- 정답 순서(중앙값 오름차순): 사진 찍기(29) → 급식 줄(40) → 친구와 이야기(49) →
  모르는 사람 옆(64).
