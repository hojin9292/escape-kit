# 「물건 쓰는 방」(물건 사용하기) — 방 설계서

방 = `objects-room`. 앞 방들과 같은 뼈대. 배경 아트 없음(뼈대 단계).

## 방 구조

```
입장 (spawn) ─ P1 연필 잡기 / P2 수도꼭지 / P3 책 쌓기 / P4 풀칠
힘 진열대 코너 [sealed shelf-corner, opensWhen: 4개 code:*-solved 전부]
  ─ 최종 콘솔 force-shelf-order(복습 보드, gate 없음) → door:objects-open → 출구
```

## 정보 배정표

| 퍼즐 | 근거 문항 | 조작 | 판정 핵심 | 보상(이벤트) |
|---|---|---|---|---|
| P1 pencil-grip | OB-001 | 단계 선택(shoulder-tap 계열) | 힘 구간 | `code:pencil-solved` |
| P2 faucet-turn | OB-004 | 이산 탭+되돌리기 | 5초 동안 받은 물 0.3~0.5L | `code:faucet-solved` |
| P3 book-stack | OB-019 | 이산 탭+되돌리기(1권 단위) | 권수 구간 | `code:book-solved` |
| P4 glue-spread | OB-011 | 종이 위를 직접 문질러 바르기 | 네 귀퉁이·가운데 확인 | `code:glue-solved` |
| 최종 force-shelf-order | OB-001·004·019·011 | 활동 카드 확인(순서 없음) | 네 장 모두 확인 | `door:objects-open` |

## 최종 `force-shelf-order`

- 4개 퍼즐을 모두 풀면 진열대 봉인이 걷히고 열린다.
- 앞에서 연습한 네 활동 카드를 어떤 순서로든 눌러 모두 확인한다. 오답은 없다.
