/**
 * 사회성 퍼즐 P4: 가방 자리 (SO-015). toothpaste-squeeze와 같은 구조 —
 * [올리기]/[줄이기] 탭으로 가방이 차지하는 공간을 조절하고 [됐어요]로 확정한다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { MAX_STEPS, stepToValue, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;
const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag);
}

export const bagSpace: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("bag-root");
    const sign = document.createElement("p");
    sign.className = "bag-sign";
    sign.textContent = "가방을 무릎 위에 올려 보세요 — 무릎 위에서 벗어나지 않을 만큼이면 충분해요.";

    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 100 100");
    view.classList.add("bag-svg");
    view.dataset.testid = "bag-view";
    const knee = svgEl("rect");
    knee.setAttribute("x", "20");
    knee.setAttribute("y", "60");
    knee.setAttribute("width", "60");
    knee.setAttribute("height", "20");
    knee.setAttribute("rx", "6");
    knee.classList.add("bag-knee");
    const bag = svgEl("rect");
    bag.classList.add("bag-bag");
    bag.setAttribute("y", "40");
    bag.setAttribute("height", "40");
    bag.setAttribute("rx", "6");
    view.append(knee, bag);

    function drawBag(): void {
      const value = stepToValue(step);
      const w = value <= 0 ? 0 : 10 + (value / 100) * 70;
      bag.setAttribute("width", String(w));
      bag.setAttribute("x", String(50 - w / 2));
      bag.style.opacity = value <= 0 ? "0" : "1";
    }

    const state = document.createElement("p");
    state.className = "bag-state";
    state.dataset.testid = "bag-state";
    state.textContent = "아직 안 올렸어요.";
    const done = document.createElement("div");
    done.className = "bag-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "딱 좋은 크기예요!";
    done.hidden = true;

    function sync(): void {
      drawBag();
      const value = stepToValue(step);
      if (value <= 0) {
        state.textContent = "아직 안 올렸어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(value);
      if (j === "low") {
        state.textContent = "조금 더 올려도 괜찮아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "가방이 무릎 밖으로 나가요. 줄여볼까요?";
        state.dataset.level = "high";
      } else {
        state.textContent = "무릎 위에 잘 있어요!";
        state.dataset.level = "good";
      }
    }

    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "bag-btn bag-btn-up";
    upBtn.dataset.testid = "bag-up";
    upBtn.textContent = "올리기";
    upBtn.addEventListener("click", () => {
      if (solved || step >= MAX_STEPS) return;
      step += 1;
      sync();
    });
    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.className = "bag-btn bag-btn-down";
    downBtn.dataset.testid = "bag-down";
    downBtn.textContent = "줄이기";
    downBtn.addEventListener("click", () => {
      if (solved || step <= 0) return;
      step -= 1;
      sync();
    });
    const row = document.createElement("div");
    row.className = "bag-button-row";
    row.append(downBtn, upBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "bag-confirm-btn";
    confirmBtn.dataset.testid = "bag-confirm";
    confirmBtn.textContent = "됐어요";
    confirmBtn.addEventListener("click", () => {
      if (solved || step <= 0) return;
      const j = judge(stepToValue(step));
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
    api.root.append(sign, view, row, state, done);
    return () => {};
  },
};
