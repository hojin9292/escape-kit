/**
 * 게임 정체성 — **새 교과로 갈아탈 때 가장 먼저 고치는 파일.**
 * 세계관 문자열이 엔진과 main에 흩어져 있으면 교사가 engine/을 열어야 한다.
 * 여기 없는 것은 `index.html`의 <title>·og 메타뿐이다 (빌드 전 정적 HTML이라 못 닿는다).
 */

/** 타이틀 화면 — 작은 시리즈명 + 큰 한글 부제 */
export const TITLE_SUB = "딱! 이만큼";
export const TITLE_MAIN = "깨끗한 방 탈출";

/** 시작 버튼 (저장된 진행이 있으면 '처음부터'가 대신 나온다) */
export const START_LABEL = "시작하기";

/** 캐릭터 선택 화면 안내문 */
export const CHAR_SELECT_LABEL = "누구랑 함께 할까?";

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
export const ENDING_MAIN = "깨끗한 방 탈출 성공!";
export const ENDING_NOTES_COMPLETE = "이 방의 쪽지를 전부 읽었어요. 짝꿍이 남긴 이야기를 다 알게 됐어요.";
export const ENDING_NOTES_INCOMPLETE = "…방 안 어딘가에 아직 읽지 않은 쪽지가 남아 있어요.";

/**
 * localStorage 저장 키. **다른 게임과 반드시 다르게 둘 것** —
 * 같은 키를 쓰면 브라우저에 남은 남의 진행 상황을 읽어 이상하게 재개된다.
 */
export const SAVE_KEY = "ttak-imankeum:hygiene-room:progress:v1";
