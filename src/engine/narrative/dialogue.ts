/**
 * 내러티브 표시 시스템 — 라플라스 대사·연구노트 오버레이.
 * 텍스트 원문은 docs/story.md가 단일 소스이며, 빌드된 데이터(src/data/story-data.ts)를
 * 소비한다. 이 모듈에 대사를 하드코딩하지 않는다.
 */
import { storyData, type StoryEntry } from "../../data/story-data";
import { Sfx } from "../audio/sfx";
import { setInline } from "./markup";

/** story.md 앵커로 엔트리 조회. `story.md#foo` · `#foo` · `foo` 셋 다 같은 키로 본다 */
export function getEntry(anchor: string): StoryEntry | undefined {
  const key = anchor.replace(/^story\.md/, "").replace(/^#/, "");
  return storyData[key];
}

// ── 대사 직렬화 큐 ────────────────────────────
// 스토리 진행(main)·상호작용(Game)·퍼즐(say)이 각자 대사를 띄우면 박스가 겹친다.
// 모든 대사를 하나의 큐로 직렬화해 "화면에는 항상 한 박스만" 보장한다.
let queueTail: Promise<void> = Promise.resolve();
let openBoxes = 0;

/** 대사 박스가 떠 있는가 — 이동·상호작용 잠금 판정용 */
export function isDialogueBusy(): boolean {
  return openBoxes > 0;
}

/** 홀로그램 스타일 대사 박스를 표시하고, 사용자가 넘길 때 resolve (전역 큐로 직렬화) */
export function showDialogue(anchor: string, host: HTMLElement): Promise<void> {
  const run = queueTail.then(() => showDialogueNow(anchor, host));
  queueTail = run.catch(() => {});
  return run;
}

function showDialogueNow(anchor: string, host: HTMLElement): Promise<void> {
  const entry = getEntry(anchor);
  if (!entry) {
    console.warn(`[narrative] 스토리 앵커 없음: ${anchor}`);
    return Promise.resolve();
  }
  // 호스트가 이미 화면에서 제거됐으면(닫힌 퍼즐 오버레이 등) 표시 생략
  if (!host.isConnected) return Promise.resolve();

  openBoxes++;
  return new Promise((resolve) => {
    let settled = false;
    const box = document.createElement("div");
    box.className = "dialogue-box";
    box.dataset.testid = "dialogue-box";

    const speaker = document.createElement("div");
    speaker.className = "dialogue-speaker";
    speaker.textContent = entry.speaker ?? "";

    const text = document.createElement("p");
    text.className = "dialogue-text";
    setInline(text, entry.text);

    const hint = document.createElement("button");
    hint.type = "button";
    hint.className = "dialogue-hint";
    hint.textContent = "계속 →";

    box.append(speaker, text, hint);
    host.appendChild(box);

    // 정리는 단 한 번 — 사용자가 넘겼든, 호스트 오버레이가 통째로 사라졌든.
    // (키패드를 ✕로 닫으면 그 안의 대사 박스도 함께 제거되는데, 그때 정리를
    //  놓치면 openBoxes가 영영 0으로 안 돌아와 이동·상호작용이 잠긴다)
    const settle = () => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
      box.remove();
      openBoxes--;
      resolve();
    };
    const advance = () => {
      if (settled) return;
      Sfx.select();
      settle();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "KeyE") {
        // preventDefault 없으면 브라우저 기본 동작이 포커스된 버튼(마지막으로 클릭한
        // 퍼즐 버튼 등)을 다시 눌러, 대사를 넘길 때마다 유령 클릭이 난다
        e.preventDefault();
        if (e.repeat) return;
        advance();
      }
    };
    const observer = new MutationObserver(() => {
      if (!box.isConnected) settle();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // 읽기 위한 스크롤은 대사를 넘기는 탭과 구분한다.
    let touchStart: { id: number; x: number; y: number; scroll: number } | null = null;
    let dragged = false;
    box.addEventListener("pointerdown", (e) => {
      if (touchStart || e.button !== 0) return;
      touchStart = { id: e.pointerId, x: e.clientX, y: e.clientY, scroll: box.scrollTop };
      dragged = false;
    });
    box.addEventListener("pointermove", (e) => {
      if (touchStart?.id === e.pointerId &&
        Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y) > 8) dragged = true;
    });
    box.addEventListener("pointercancel", () => { touchStart = null; });
    box.addEventListener("pointerleave", () => {
      touchStart = null;
      dragged = true;
    });
    box.addEventListener("pointerup", (e) => {
      if (touchStart?.id !== e.pointerId) return;
      const tapped = !dragged && Math.abs(box.scrollTop - touchStart.scroll) < 2;
      touchStart = null;
      if (tapped && !hint.contains(e.target as Node)) advance();
    });
    // 버튼의 native click은 언제나 진행으로 인정한다. 태블릿에서는 손가락의 미세한
    // 흔들림도 pointermove 8px을 넘길 수 있는데, 여기서 dragged를 다시 검사하면
    // 버튼만 눌렀을 때는 무시되고 박스 본문을 눌러야 넘어가는 것처럼 보였다.
    // 실제 스크롤 제스처 뒤의 click 취소는 브라우저가 담당한다.
    hint.addEventListener("click", advance);
    window.addEventListener("keydown", onKey);
  });
}
