/**
 * 게임 정체성 — **새 교과로 갈아탈 때 가장 먼저 고치는 파일.**
 * 세계관 문자열이 엔진과 main에 흩어져 있으면 교사가 engine/을 열어야 한다.
 * 여기 없는 것은 `index.html`의 <title>·og 메타뿐이다 (빌드 전 정적 HTML이라 못 닿는다).
 */

/** 타이틀 화면 — 작은 시리즈명 + 큰 한글 부제 */
export const TITLE_SUB = "딱! 이만큼";
export const TITLE_MAIN = "생활연구소 대탈출";

/** 타이틀 설명 — 학습 범위와 분량을 첫 화면에서 바로 알 수 있게 한다. */
export const TITLE_TAGLINE = "생활 속 ‘알맞은 만큼’을 찾아 여섯 개의 방을 탈출해요";
export const TITLE_FEATURES = [
  ["6", "생활 주제"],
  ["30", "판단 미션"],
  ["자동", "진행 저장"],
] as const;

/** 시작 버튼 (저장된 진행이 있으면 '처음부터'가 대신 나온다) */
export const START_LABEL = "시작하기";

/** 주인공 소개 화면 안내문 */
export const CHAR_SELECT_LABEL = "호진티와 함께 출발해요!";

/** 타이틀 하단 제작자 표기 */
export const CREDIT = "만든 사람: 딱! 이만큼";

/** 문의하기 — 메일 폴백 주소와 분류. 두 번째 항목이 교과 질문 자리다. */
export const CONTACT_EMAIL = "teacher@example.com";
export const CONTACT_CATEGORIES = [
  "새로운 방 아이디어 제안",
  "버그 제보",
  "생활 습관 질문",
  "기타 의견",
] as const;

/** 엔딩 화면 */
export const ENDING_SUB = TITLE_SUB;
export const ENDING_MAIN = "생활연구소 탈출 성공!";
export const ENDING_NOTES_COMPLETE = "마지막 방의 쪽지를 전부 읽고 ‘알맞은 만큼’의 비밀을 찾았어요.";
export const ENDING_NOTES_INCOMPLETE = "탈출에는 성공했어요. 마지막 방에 아직 읽지 않은 쪽지가 있어요.";

/**
 * localStorage 저장 키. **다른 게임과 반드시 다르게 둘 것** —
 * 같은 키를 쓰면 브라우저에 남은 남의 진행 상황을 읽어 이상하게 재개된다.
 */
export const SAVE_KEY = "ttak-imankeum:hygiene-room:progress:v1";
