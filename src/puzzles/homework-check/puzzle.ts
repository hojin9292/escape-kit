/**
 * 시간 퍼즐 P2: 숙제 확인 (TI-013). call-name과 같은 구조 —
 * [확인하기] 탭마다 횟수가 쌓인다. 되돌리기 없음, too-high면 리셋 후 재도전.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { MAX_CHECKS, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const homeworkCheck: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let count = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("homework-root");
    const sign = document.createElement("p");
    sign.className = "homework-sign";
    sign.textContent = "제출 전에 숙제를 확인해 보세요 — 한 번 확인하고 이상이 없으면 충분해요.";

    const view = document.createElement("div");
    view.className = "homework-view";
    view.dataset.testid = "homework-view";
    const dots = document.createElement("div");
    dots.className = "homework-dots";
    view.appendChild(dots);

    function drawDots(): void {
      dots.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const dot = document.createElement("span");
        dot.className = "homework-dot";
        dots.appendChild(dot);
      }
    }

    const state = document.createElement("p");
    state.className = "homework-state";
    state.dataset.testid = "homework-state";
    state.textContent = "아직 확인하지 않았어요.";
    const done = document.createElement("div");
    done.className = "homework-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "이름도 있고 빠진 칸도 없어요!";
    done.hidden = true;

    function sync(): void {
      drawDots();
      if (count <= 0) {
        state.textContent = "아직 확인하지 않았어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(count);
      if (j === "low") {
        state.textContent = "아직 확인 전이에요. 한 번 더 볼까요?";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "너무 여러 번 확인했어요.";
        state.dataset.level = "high";
      } else {
        state.textContent = "확인이 끝난 것 같아요!";
        state.dataset.level = "good";
      }
    }

    const checkBtn = document.createElement("button");
    checkBtn.type = "button";
    checkBtn.className = "homework-btn";
    checkBtn.dataset.testid = "homework-check-btn";
    checkBtn.textContent = "확인하기";
    checkBtn.addEventListener("click", () => {
      if (solved || count >= MAX_CHECKS) return;
      count += 1;
      sync();
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "homework-confirm-btn";
    confirmBtn.dataset.testid = "homework-confirm";
    confirmBtn.textContent = "제출하기";
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
    api.root.append(sign, view, checkBtn, state, done);
    return () => {};
  },
};
