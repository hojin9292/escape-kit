/**
 * 식사 퍼즐 P1: 물 따르기 (FO-001).
 *
 * 조작: [따르기]/[덜어내기] 탭으로 이산 스텝을 오르내리고, [그만 따르기]로 확정한다.
 * toothpaste-squeeze와 같은 구조 — 그림만 컵에 물이 차는 형태.
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

export const waterPour: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("water-root");

    const sign = document.createElement("p");
    sign.className = "water-sign";
    sign.textContent = "물을 들고 자리까지 이동해야 해요. 컵에 표시된 안전선까지 따라요.";

    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 100 100");
    view.classList.add("water-svg");
    view.dataset.testid = "water-view";

    const cup = svgEl("rect");
    cup.setAttribute("x", "28");
    cup.setAttribute("y", "22");
    cup.setAttribute("width", "44");
    cup.setAttribute("height", "56");
    cup.setAttribute("rx", "6");
    cup.classList.add("water-cup");

    const rim = svgEl("rect");
    rim.setAttribute("x", "26");
    rim.setAttribute("y", "20");
    rim.setAttribute("width", "48");
    rim.setAttribute("height", "5");
    rim.setAttribute("rx", "2.5");
    rim.classList.add("water-rim");

    const fill = svgEl("rect");
    fill.classList.add("water-fill");
    fill.setAttribute("x", "30.5");

    const safeLine = svgEl("line");
    safeLine.setAttribute("x1", "29");
    safeLine.setAttribute("x2", "71");
    safeLine.setAttribute("y1", "42");
    safeLine.setAttribute("y2", "42");
    safeLine.classList.add("water-safe-line");

    view.append(cup, fill, safeLine, rim);

    const fullH = 52;

    function drawFill(): void {
      const value = stepToValue(step);
      const h = (value / 100) * fullH;
      fill.setAttribute("y", String(78 - h - 2));
      fill.setAttribute("width", "39");
      fill.setAttribute("height", String(h));
      fill.style.opacity = value <= 0 ? "0" : "1";
    }

    const state = document.createElement("p");
    state.className = "water-state";
    state.dataset.testid = "water-state";
    state.textContent = "아직 따르지 않았어요.";

    const done = document.createElement("div");
    done.className = "water-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "안전선까지 알맞게 따랐어요!";
    done.hidden = true;

    function sync(): void {
      drawFill();
      const value = stepToValue(step);
      if (value <= 0) {
        state.textContent = "아직 따르지 않았어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(value);
      if (j === "low") {
        state.textContent = "조금 더 따라도 괜찮아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "조금 많아요. 줄여볼까요?";
        state.dataset.level = "high";
      } else {
        state.textContent = "딱 좋은 높이예요!";
        state.dataset.level = "good";
      }
    }

    const pourBtn = document.createElement("button");
    pourBtn.type = "button";
    pourBtn.className = "water-btn water-btn-pour";
    pourBtn.dataset.testid = "water-pour-btn";
    pourBtn.textContent = "따르기";
    pourBtn.addEventListener("click", () => {
      if (solved || step >= MAX_STEPS) return;
      step += 1;
      sync();
    });

    const lessBtn = document.createElement("button");
    lessBtn.type = "button";
    lessBtn.className = "water-btn water-btn-less";
    lessBtn.dataset.testid = "water-less";
    lessBtn.textContent = "덜어내기";
    lessBtn.addEventListener("click", () => {
      if (solved || step <= 0) return;
      step -= 1;
      sync();
    });

    const buttonRow = document.createElement("div");
    buttonRow.className = "water-button-row";
    buttonRow.append(lessBtn, pourBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "water-confirm-btn";
    confirmBtn.dataset.testid = "water-confirm";
    confirmBtn.textContent = "그만 따르기";
    confirmBtn.addEventListener("click", () => {
      if (solved || step <= 0) return;
      const value = stepToValue(step);
      const j = judge(value);
      if (j === "good") {
        solved = true;
        done.hidden = false;
        state.textContent = "딱 좋은 높이예요!";
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
    api.root.append(sign, view, buttonRow, state, done);

    return () => {};
  },
};
