# 개발 이력

`audit-room`·`relayout-room` 스킬이 마무리 단계에서 여기에 기록한다.
**찾은 것뿐 아니라 "확인했는데 문제 없던 것"까지** 적는다 — 다음 점검의 범위가 된다.

## 2026-09-07 — 「깨끗한 방」(hygiene-room) 완성 + audit-room 점검

전 퍼즐(치약 짜기·손 소독제 펌프·양치 시간·화장실 휴지·정리대 서열)을 만든 뒤
`audit-room` 절차대로 점검했다.

**찾아서 고친 것**
- `docs/story.md`에 `#hy-shelf-prompt` 앵커가 정의돼 있었지만 실제로는 참조하는 곳이
  없었다(정리대 안내문은 다른 퍼즐들처럼 puzzle.ts에 고정 문자열로 둠 — 일관된 패턴).
  죽은 앵커라 삭제.
- `hand-sanitizer-pump`는 원래 "되돌리기 없음"으로 설계했는데, 그러면 최대 펌프 수를
  넘긴 순간(too high) 퍼즐이 영영 안 풀리는 막다른 길이었다. 오답 확정 시 웅덩이를
  0으로 되돌려 재도전할 수 있게 고쳤다(펌프 자체의 되돌리기 불가는 유지 — "손을
  헹구고 새로 시작"으로 자연스럽게 설명 가능).

**확인했는데 문제 없던 것**
- 매니페스트 4개의 `principle`·`hints`가 전부 근거 문항(HY-001/004/009/005)의
  benchmark·outcome 텍스트와 어긋나지 않는다.
- 힌트 마지막 단계가 정답에 근접하는 것은 설계대로다(PuzzleManifest 계약과 일치) —
  오답 유인값을 가리키는 힌트는 없었다.
- `soap-shelf-order`의 정답 순서(세제→로션→치약→샴푸)는 curriculum-map.md의 서술과
  일치하고, 화면에 뒤섞여 나오는 순서(DISPLAY_ORDER)는 정답의 정확한 역순이라 "이미
  정렬된 채로 보여서 그대로 옮기면 통과"하는 사고가 없다.
- 4! = 24개 순열 전수 검사로 정답이 정확히 1개뿐임을 자동 테스트로 확인(전 순열
  유일해 검산 — `tests/e2e/hygiene-room.spec.ts`).
- `puzzle-layout.spec.ts`(전 퍼즐 공용 오버플로·제목 줄바꿈 검사)가 5개 퍼즐 모두
  통과 — 가로 스크롤 없음, 세로 오버플로 없음(그래서 "더 있음" 안내 테스트는
  정상적으로 스킵됨).
- `bash scripts/verify.sh full` — story/anchors/layout/reach/typecheck/build/assets/
  e2e(desktop+mobile 18개, flaky 0) 전부 그린.

**의도적으로 남겨 둔 것 (다음 작업)**
- **배경 아트 없음.** `/gen-image-asset`가 쓰는 이미지 생성기가 이 세션 도구에 없어
  실행할 수 없었다 — 방은 기본 타일 바닥 위에 SVG 핫스팟만으로 구성돼 있다.
  플레이는 완전히 가능하지만(스크린샷으로 확인) 방탈출 특유의 몰입감은 배경 아트가
  붙어야 완성된다. 다음 세션에서 이미지 생성 도구가 있는 환경으로 이어가야 한다.

**추가로 실플레이한 것**
- 연구노트 5개·수색 지점 2개를 전수 수집해 텍스트까지 확인. `note-05`·
  `s-hy-shelf-hint`는 정리대 코너 안이라 봉인이 열리기 전엔 상호작용 라벨 자체가
  뜨지 않는데, 이는 버그가 아니라 sealed 구역의 정상 동작이다(4개 청소를 풀어
  봉인이 걷힌 뒤 재확인해 정상 수집됨을 확인). 방 완주 자체는 노트 수집과 무관하게
  통과하도록 설계돼 있다(README의 "수색은 지름길이지 게이트가 아니다" 원칙).

## 2026-09-08 — 「먹고 마시는 방」(food-room) 완성 + 방 연결

hygiene-room과 같은 뼈대로 2번 방을 만들고, hygiene-room의 출구를 food-room으로 연결했다.

**새로 도입한 조작**
- `jam-spread`: 1번 방에 없던 **넓이-격자 탭**(6×4 칸을 하나씩 켜고 끄기) — imankeum의
  `spread_area`(드래그로 문지르기) 개념을 이산 조작으로 옮긴 것.
- `yogurt-topping`: brushing-timer와 짝을 이루는 **관찰 후 단발 입력**이지만 방향이
  반대다 — "다 밝혀질 때까지 기다린다"가 아니라 "다 덮이기 전에 멈춘다".

**찾아서 고친 것 (모두 audit 중이 아니라 e2e 작성 중 실제로 재현됨)**
- `ice-drop`도 hand-sanitizer-pump와 같은 "되돌리기 없음" 설계라 too-high를 넘기면
  막다른 길이었다 — 같은 방식(오답 확정 시 컵을 비움)으로 미리 고쳐서 커밋했다.
- `yogurt-topping`도 같은 이유로 too-high(완전히 덮임) 이후 되돌아오지 않는 문제가
  있어 스텝을 0으로 리셋하도록 미리 고쳤다.
- `enterFoodRoom` e2e 헬퍼가 `__qe.warp`로 food-room에 들어간 뒤 방 입장 대사
  (`#fo-room-intro`)를 닫지 않은 채 바로 이동을 시도해 데스크톱(키보드 이동)에서만
  실패했다 — 대사가 떠 있는 동안 이동이 막히는데 모바일(드래그 이동)은 우연히
  타이밍이 달라 통과했었다. `enterFoodRoom`에 `dismissDialogues` 호출을 추가해 해결.
- (디버그 과정의 오해였고 실제 버그는 아니었던 것) 임시 스크립트로 yogurt-topping의
  타이밍을 재는 동안 "스텝이 예상보다 빨리 진행된다"는 현상을 봤는데, 원인은 게임
  코드가 아니라 임시 스크립트가 `dismissDialogues`류 폴링 루프를 puzzle 오픈 **직후**
  호출해 마지막 대사가 없어질 때까지 기다리는 타임아웃(약 2초)을 그대로 낭비한
  것이었다 — 그 사이에도 토핑 스텝은 계속 진행된다. 실제 `openStation` 헬퍼(단발
  확인만 함)를 쓰면 이 문제가 없다는 걸 확인하고 정식 스펙은 처음부터 그 헬퍼로 작성.

**확인했는데 문제 없던 것**
- 4! = 24개 순열 전수 검사로 pour-shelf-order 정답이 유일함을 재확인.
- `puzzle-layout.spec.ts`가 새 퍼즐 5개(water-pour·ice-drop·jam-spread·yogurt-topping·
  pour-shelf-order)까지 포함해 전부 통과 — 가로 스크롤 없음, 세로 오버플로 없음.
- hygiene-room의 출구 문을 `ending:true`에서 `{toMap:"food-room", spawn:[2,7]}`로
  바꾼 뒤 실제로 걸어서 통과하는 것까지 e2e로 확인(hygiene-room.spec.ts 마지막 단계).
- `bash scripts/verify.sh full` — 두 방 모두(story/anchors/layout/reach/typecheck/
  build/assets/e2e 28개, flaky 0) 그린.

**의도적으로 남겨 둔 것**: 배경 아트 없음(1번 방과 같은 사정 — 이미지 생성 도구가
이 세션에 없음).
