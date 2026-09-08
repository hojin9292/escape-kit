# 「물건 쓰는 방」(물건 사용하기) — 방 설계서

방 = `objects-room`. 앞 방들과 같은 뼈대. 배경 아트 없음(뼈대 단계).

## 방 구조

```
입장 (spawn) ─ P1 연필 잡기 / P2 수도꼭지 / P3 책 쌓기 / P4 풀칠
힘 진열대 코너 [sealed shelf-corner, opensWhen: 4개 code:*-solved 전부]
  ─ 최종 콘솔 force-shelf-order(서열 퍼즐, gate 없음) → door:objects-open → 출구
```

## 정보 배정표

| 퍼즐 | 근거 문항 | 조작 | 판정 핵심 | 보상(이벤트) |
|---|---|---|---|---|
| P1 pencil-grip | OB-001 | 단계 선택(shoulder-tap 계열) | 힘 구간 | `code:pencil-solved` |
| P2 faucet-turn | OB-004 | 이산 탭+되돌리기 | 정도 구간 | `code:faucet-solved` |
| P3 book-stack | OB-019 | 이산 탭+되돌리기(1권 단위) | 권수 구간 | `code:book-solved` |
| P4 glue-spread | OB-011 | 격자 탭(jam-spread 계열) | 넓이 구간 | `code:glue-solved` |
| 최종 force-shelf-order | OB-005·013·001·009 | 탭으로 순서 배치 | 정답 순열 유일 | `door:objects-open` |

## 최종 `force-shelf-order`

- 4개 퍼즐을 모두 풀면 진열대 봉인이 걷히고 열린다.
- 물건 카드 4개(태블릿·스티커·연필·과자 봉지)를 적은 힘부터 큰 힘 순서로 놓는다.
- 정답 순서(중앙값 오름차순): 태블릿(16.5) → 스티커(29) → 연필(40) → 과자 봉지(55).
