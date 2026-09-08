/**
 * 물건 퍼즐 P3: 책 쌓기 (OB-019). toothpaste-squeeze와 같은 구조지만 단위가 1권씩 —
 * [쌓기]/[내리기] 탭으로 책 권수를 오르내리고 [됐어요]로 확정한다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { MAX_STEPS, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const bookStack: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let count = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("book-root");
    const sign = document.createElement("p");
    sign.className = "book-sign";
    sign.textContent = "책을 쌓아 보세요 — 손을 떼도 흔들리지 않는 높이면 충분해요.";

    const stack = document.createElement("div");
    stack.className = "book-stack-view";
    stack.dataset.testid = "book-view";

    function drawStack(): void {
      stack.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const book = document.createElement("div");
        book.className = "book-item";
        stack.appendChild(book);
      }
    }

    const state = document.createElement("p");
    state.className = "book-state";
    state.dataset.testid = "book-state";
    state.textContent = "아직 안 쌓았어요.";
    const done = document.createElement("div");
    done.className = "book-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "흔들리지 않아요!";
    done.hidden = true;

    function sync(): void {
      drawStack();
      if (count <= 0) {
        state.textContent = "아직 안 쌓았어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(count);
      if (j === "low") {
        state.textContent = "조금 더 쌓아도 괜찮아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "너무 높아요. 기울어질 것 같아요.";
        state.dataset.level = "high";
      } else {
        state.textContent = "손을 떼도 흔들리지 않아요!";
        state.dataset.level = "good";
      }
    }

    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "book-btn book-btn-up";
    upBtn.dataset.testid = "book-up";
    upBtn.textContent = "쌓기";
    upBtn.addEventListener("click", () => {
      if (solved || count >= MAX_STEPS) return;
      count += 1;
      sync();
    });
    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.className = "book-btn book-btn-down";
    downBtn.dataset.testid = "book-down";
    downBtn.textContent = "내리기";
    downBtn.addEventListener("click", () => {
      if (solved || count <= 0) return;
      count -= 1;
      sync();
    });
    const row = document.createElement("div");
    row.className = "book-button-row";
    row.append(downBtn, upBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "book-confirm-btn";
    confirmBtn.dataset.testid = "book-confirm";
    confirmBtn.textContent = "됐어요";
    confirmBtn.addEventListener("click", () => {
      if (solved || count <= 0) return;
      const j = judge(count);
      if (j === "good") {
        solved = true;
        done.hidden = false;
        state.dataset.level = "good";
        api.solve();
      } else if (j === "low") {
        state.dataset.level = "low";
        if (!saidToolow) {
          saidToolow = true;
          void api.say(manifest.narrative.extra!["toolow"]);
        }
        api.fail();
      } else {
        state.dataset.level = "high";
        if (!saidToohigh) {
          saidToohigh = true;
          void api.say(manifest.narrative.extra!["toohigh"]);
        }
        api.fail();
      }
    });

    api.actions.appendChild(confirmBtn);
    sync();
    api.root.append(sign, stack, row, state, done);
    return () => {};
  },
};
