/**
 * 대화 퍼즐 P2: 선생님 부르기 (CO-007). ice-drop과 같은 구조 —
 * [부르기] 탭마다 횟수가 쌓인다. 되돌리기 없음, too-high면 리셋 후 재도전.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { MAX_CALLS, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const callName: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let count = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("call-root");
    const sign = document.createElement("p");
    sign.className = "call-sign";
    sign.textContent = "도움이 필요해요. 선생님을 한 번 부른 뒤 반응을 기다리고, 못 들었을 때만 한 번 더 불러요.";

    const view = document.createElement("div");
    view.className = "call-view";
    view.dataset.testid = "call-view";
    const dots = document.createElement("div");
    dots.className = "call-dots";
    view.appendChild(dots);

    function drawDots(): void {
      dots.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const dot = document.createElement("span");
        dot.className = "call-dot";
        dots.appendChild(dot);
      }
    }

    const state = document.createElement("p");
    state.className = "call-state";
    state.dataset.testid = "call-state";
    state.textContent = "아직 부르지 않았어요.";
    const done = document.createElement("div");
    done.className = "call-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "선생님이 고개를 돌렸어요!";
    done.hidden = true;

    function sync(): void {
      drawDots();
      if (count <= 0) {
        state.textContent = "아직 부르지 않았어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(count);
      if (j === "low") {
        state.textContent = "아직 반응이 없어요. 한 번 더 불러볼까요?";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "너무 여러 번 불렀어요.";
        state.dataset.level = "high";
      } else {
        state.textContent = "선생님이 반응할 것 같아요!";
        state.dataset.level = "good";
      }
    }

    const callBtn = document.createElement("button");
    callBtn.type = "button";
    callBtn.className = "call-btn";
    callBtn.dataset.testid = "call-btn";
    callBtn.textContent = "부르기";
    callBtn.addEventListener("click", () => {
      if (solved || count >= MAX_CALLS) return;
      count += 1;
      sync();
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "call-confirm-btn";
    confirmBtn.dataset.testid = "call-confirm";
    confirmBtn.textContent = "됐어요";
    confirmBtn.addEventListener("click", () => {
      if (solved || count <= 0) return;
      const j = judge(count);
      if (j === "good") {
        solved = true;
        done.hidden = false;
        sync();
        api.solve();
      } else if (j === "low") {
        if (!saidToolow) {
          saidToolow = true;
          void api.say(manifest.narrative.extra!["toolow"]);
        }
        api.fail();
      } else {
        if (!saidToohigh) {
          saidToohigh = true;
          void api.say(manifest.narrative.extra!["toohigh"]);
        }
        api.fail();
        count = 0;
        sync();
      }
    });

    api.actions.appendChild(confirmBtn);
    sync();
    api.root.append(sign, view, callBtn, state, done);
    return () => {};
  },
};
