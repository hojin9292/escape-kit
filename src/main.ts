import "./style.css";
import tokens from "../design-tokens.json";
import { showDialogue } from "./engine/narrative/dialogue";
import { bus } from "./engine/events/EventBus";
import { Game } from "./engine/core/Game";
import { maps, FIRST_ROOM, ROOM_INTRO_ANCHOR } from "./maps";
import { loadProgress, hasProgress, clearProgress, saveProgress } from "./engine/core/save";
import { Sfx } from "./engine/audio/sfx";
import { Ambience } from "./engine/audio/ambience";
import type { GameMap } from "./maps/types";
import {
  TITLE_SUB,
  TITLE_MAIN,
  TITLE_TAGLINE,
  TITLE_FEATURES,
  START_LABEL,
  CHAR_SELECT_LABEL,
  CREDIT,
} from "./config";

const BASE = import.meta.env.BASE_URL;

/** design-tokens.json → :root CSS 변수 주입 (색·치수 단일 소스) */
function applyTokens(): void {
  const root = document.documentElement.style;
  for (const [name, value] of Object.entries(tokens.color)) {
    root.setProperty(`--color-${name}`, value);
  }
  root.setProperty("--stroke-outline", `${tokens.stroke.outline}px`);
  root.setProperty("--glow-blur", `${tokens.stroke["glow-blur"]}px`);
  root.setProperty("--corner-radius", `${tokens["corner-radius"]}px`);
  root.setProperty("--font-family", tokens.font.family);
  root.setProperty("--font-holo-letter-spacing", tokens.font["holo-letter-spacing"]);
}

function showTitle(app: HTMLElement): void {
  const screen = document.createElement("div");
  screen.className = "title-screen";
  screen.dataset.testid = "title-screen";

  const art = document.createElement("img");
  art.className = "title-art";
  art.src = `${BASE}assets/title-life-lab.png`;
  art.alt = "손 씻기, 식사, 대화, 관계, 물건 사용, 기다림을 연습하는 여섯 생활 연구실";

  const shade = document.createElement("div");
  shade.className = "title-shade";

  const content = document.createElement("main");
  content.className = "title-content";

  const stage = document.createElement("section");
  stage.className = "title-stage";

  const mascot = document.createElement("figure");
  mascot.className = "title-mascot";
  const mascotImg = document.createElement("img");
  mascotImg.src = `${BASE}assets/char-m-se-idle.png`;
  mascotImg.alt = "생활연구소 탐험을 안내하는 호진티";
  const mascotLabel = document.createElement("figcaption");
  mascotLabel.textContent = "생활 탐험 안내자 · HOJIN-T";
  mascot.append(mascotImg, mascotLabel);

  const sub = document.createElement("div");
  sub.className = "title-sub";
  sub.textContent = TITLE_SUB;

  const main = document.createElement("h1");
  main.className = "title-main";
  // 작은 영문 시리즈명 + 큰 한글 부제. 한 방 이름을 부제로 쓰면 방이 늘었을 때
  // 한 방이 전체를 대표하는 꼴이 된다. 브라우저·링크 제목은 index.html이 따로 들고 있다.
  main.textContent = TITLE_MAIN;

  const tagline = document.createElement("p");
  tagline.className = "title-tagline";
  tagline.textContent = TITLE_TAGLINE;

  const features = document.createElement("div");
  features.className = "title-features";
  features.setAttribute("aria-label", "게임 구성");
  for (const [value, label] of TITLE_FEATURES) {
    const chip = document.createElement("div");
    chip.className = "title-feature";
    const strong = document.createElement("strong");
    strong.textContent = value;
    const span = document.createElement("span");
    span.textContent = label;
    chip.append(strong, span);
    features.appendChild(chip);
  }

  const buttons = document.createElement("div");
  buttons.className = "title-buttons";

  // 저장된 진행이 있으면 '이어하기'를 먼저 노출
  if (hasProgress()) {
    const cont = document.createElement("button");
    cont.className = "title-start primary";
    cont.dataset.testid = "continue-button";
    cont.textContent = "이어하기";
    cont.addEventListener("click", () => {
      Sfx.confirm();
      Ambience.start(); // 사용자 제스처 안 — autoplay 정책 안전
      screen.remove();
      void startContinue(app);
    });
    buttons.appendChild(cont);
  }

  const start = document.createElement("button");
  start.className = `title-start ${hasProgress() ? "secondary" : "primary"}`;
  start.dataset.testid = "start-button";
  start.textContent = hasProgress() ? "처음부터" : START_LABEL;
  const beginNewGame = () => {
    Sfx.confirm();
    Ambience.start();
    clearProgress();
    screen.remove();
    void showCharSelect(app).then((character) => {
      saveProgress({ events: [], notes: [], lastMap: FIRST_ROOM.id, character });
      void startPrologue(app);
    });
  };
  start.addEventListener("click", () => {
    if (hasProgress()) showResetConfirm(app, beginNewGame);
    else beginNewGame();
  });
  buttons.appendChild(start);

  const how = document.createElement("button");
  how.type = "button";
  how.className = "title-how";
  how.dataset.testid = "how-button";
  how.textContent = "게임 방법";
  how.addEventListener("click", () => {
    Sfx.select();
    showHowToPlay(app);
  });
  buttons.appendChild(how);

  const footer = document.createElement("div");
  footer.className = "title-footer";
  const credit = document.createElement("div");
  credit.className = "title-credit";
  credit.textContent = CREDIT;
  footer.appendChild(credit);

  content.append(sub, main, tagline, features, buttons);
  stage.append(content, mascot);
  screen.append(art, shade, stage, footer);
  app.appendChild(screen);
}

/** 저장 삭제 전 한 번 더 확인 — 학생의 진행을 실수로 지우지 않는다. */
function showResetConfirm(app: HTMLElement, onConfirm: () => void): void {
  const overlay = document.createElement("div");
  overlay.className = "simple-overlay";
  overlay.dataset.testid = "reset-confirm";
  const panel = document.createElement("div");
  panel.className = "simple-panel";
  panel.setAttribute("role", "alertdialog");
  panel.setAttribute("aria-modal", "true");
  const title = document.createElement("h2");
  title.textContent = "처음부터 시작할까요?";
  const copy = document.createElement("p");
  copy.textContent = "지금까지 찾은 쪽지와 완료한 미션이 모두 지워져요.";
  const actions = document.createElement("div");
  actions.className = "simple-actions";
  const cancel = document.createElement("button");
  cancel.className = "simple-button";
  cancel.textContent = "계속 이어하기";
  const confirm = document.createElement("button");
  confirm.className = "simple-button danger";
  confirm.textContent = "처음부터 시작";
  const close = () => overlay.remove();
  cancel.addEventListener("click", close);
  confirm.addEventListener("click", () => {
    close();
    onConfirm();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  actions.append(cancel, confirm);
  panel.append(title, copy, actions);
  overlay.appendChild(panel);
  app.appendChild(overlay);
  cancel.focus();
}

function showHowToPlay(app: HTMLElement): void {
  const overlay = document.createElement("div");
  overlay.className = "simple-overlay";
  overlay.dataset.testid = "how-overlay";
  const panel = document.createElement("section");
  panel.className = "simple-panel how-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  const title = document.createElement("h2");
  title.textContent = "이렇게 플레이해요";
  const steps = document.createElement("div");
  steps.className = "how-steps";
  const data = [
    ["1", "움직이기", "방향키·WASD 또는 왼쪽 조이스틱으로 걸어요."],
    ["2", "살펴보기", "빛나는 장치 가까이에서 Space·E 또는 ‘살펴보기’를 눌러요."],
    ["3", "알맞게 판단하기", "너무 적지도, 많지도 않은 선택을 찾아 여러 번 도전해요."],
    ["4", "자동 저장", "미션을 마치면 바로 저장돼요. 다음에 ‘이어하기’를 누르면 돼요."],
  ];
  for (const [n, label, copy] of data) {
    const card = document.createElement("article");
    const badge = document.createElement("b");
    badge.textContent = n;
    const body = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = label;
    const text = document.createElement("p");
    text.textContent = copy;
    body.append(heading, text);
    card.append(badge, body);
    steps.appendChild(card);
  }
  const close = document.createElement("button");
  close.className = "simple-button primary";
  close.textContent = "알겠어요";
  close.addEventListener("click", () => overlay.remove());
  panel.append(title, steps, close);
  overlay.appendChild(panel);
  app.appendChild(overlay);
  close.focus();
}

/** 새 시작 시 한 명의 주인공 호진티를 소개한다. */
function showCharSelect(app: HTMLElement): Promise<"m"> {
  return new Promise((resolve) => {
    const screen = document.createElement("div");
    screen.className = "char-select";
    screen.dataset.testid = "char-select";

    const title = document.createElement("div");
    title.className = "title-sub";
    title.textContent = CHAR_SELECT_LABEL;

    const row = document.createElement("div");
    row.className = "char-select-row";

    const btn = document.createElement("button");
    btn.className = "char-select-btn";
    btn.dataset.testid = "char-m";
    const img = document.createElement("img");
    img.src = `${BASE}assets/char-m-se-idle.png`;
    img.alt = "안경을 쓰고 주황색 가방을 멘 호진티";
    const label = document.createElement("span");
    label.textContent = "호진티와 출발하기";
    btn.append(img, label);
    btn.addEventListener("click", () => {
      Sfx.confirm();
      screen.remove();
      resolve("m");
    });
    row.appendChild(btn);

    screen.append(title, row);
    app.appendChild(screen);
  });
}

/** 방별 배선 — 방에 처음 들어설 때 한 번만 실행할 것들.
 *
 *  ⚠ **`new Game(...)` 전에 호출해야 한다.** `map:enter`는 첫 방에서도 발화하는데
 *  (`Game.start()` 끝), 그 뒤에 구독하면 첫 방의 발화를 놓친다.
 *
 *  방 인트로 대사도 같은 자리에 건다:
 *
 *    const shown = new Set<string>();
 *    bus.on(`map:enter:<방 id>`, () => {
 *      if (shown.has("<방 id>")) return;
 *      shown.add("<방 id>");
 *      void showDialogue("#<인트로 앵커>", app);
 *    });
 *
 *  다만 첫 방의 인트로는 프롤로그 대사 **뒤에** 와야 순서가 맞으므로
 *  startPrologue에서 직접 재생한다 (map:enter는 start() 시점 = 튜토리얼보다 앞이다). */
/** 첫 방을 뺀 나머지 방의 입장 대사 — 한 세션에 한 번만. 첫 방은 프롤로그 대사
 *  뒤에 와야 순서가 맞으므로 startPrologue에서 직접 재생한다(map:enter는 그보다 이르다). */
function registerRoomIntros(): void {
  const shown = new Set<string>();
  for (const [mapId, anchor] of Object.entries(ROOM_INTRO_ANCHOR)) {
    if (mapId === FIRST_ROOM.id) continue;
    bus.on(`map:enter:${mapId}`, () => {
      if (shown.has(mapId)) return;
      shown.add(mapId);
      void showDialogue(anchor, document.getElementById("app")!);
    });
  }
}

async function startPrologue(app: HTMLElement): Promise<void> {
  await showDialogue("#prologue-wake", app);
  registerRoomIntros();

  const game = new Game(app, FIRST_ROOM);
  await game.start();
  bus.emit("prologue:done");

  await showDialogue("#prologue-tutorial", app);
  await showDialogue("#prologue-rule", app); // 규칙: 청소 네 가지를 다 마쳐야 문이 열린다
  await showDialogue("#hy-room-intro", app);
}

/** 이어하기: 프롤로그 생략, 마지막 방에서 재개 */
async function startContinue(app: HTMLElement): Promise<void> {
  const saved = loadProgress();
  const startMap: GameMap = (saved.lastMap && maps[saved.lastMap]) || FIRST_ROOM;
  registerRoomIntros();

  const game = new Game(app, startMap);
  await game.start();
  bus.emit("prologue:done");
}

const app = document.getElementById("app");
if (!app) throw new Error("#app 루트가 없습니다");
applyTokens();
showTitle(app);
