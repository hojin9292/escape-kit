/**
 * 사회성 퍼즐 P1: 엘리베이터 거리 (SO-003). toothpaste-squeeze와 같은 구조 —
 * [가까이]/[멀리] 탭으로 이산 스텝을 오르내리고 [됐어요]로 확정한다.
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

export const elevatorDistance: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0; // 처음엔 붙어서 시작(엘리베이터 문이 막 열려 다 같이 탄 상태)
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("elevator-root");
    const sign = document.createElement("p");
    sign.className = "elevator-sign";
    sign.textContent = "옆 사람과의 거리를 조절해 보세요 — 어깨가 닿지 않을 만큼이면 충분해요.";

    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 100 100");
    view.classList.add("elevator-svg");
    view.dataset.testid = "elevator-view";
    const me = svgEl("circle");
    me.setAttribute("cy", "60");
    me.setAttribute("r", "10");
    me.classList.add("elevator-me");
    const other = svgEl("circle");
    other.setAttribute("cx", "85");
    other.setAttribute("cy", "60");
    other.setAttribute("r", "10");
    other.classList.add("elevator-other");
    view.append(me, other);

    function drawMe(): void {
      const value = stepToValue(step);
      const x = 85 - (value / 100) * 70;
      me.setAttribute("cx", String(x));
    }

    const state = document.createElement("p");
    state.className = "elevator-state";
    state.dataset.testid = "elevator-state";
    state.textContent = "";
    const done = document.createElement("div");
    done.className = "elevator-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "딱 좋은 거리예요!";
    done.hidden = true;

    function sync(): void {
      drawMe();
      const value = stepToValue(step);
      const j = judge(value);
      if (j === "low") {
        state.textContent = "너무 가까워요. 조금 떨어져 볼까요?";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "너무 멀어요. 조금 가까이 가볼까요?";
        state.dataset.level = "high";
      } else {
        state.textContent = "딱 좋은 거리예요!";
        state.dataset.level = "good";
      }
    }

    const farBtn = document.createElement("button");
    farBtn.type = "button";
    farBtn.className = "elevator-btn elevator-btn-far";
    farBtn.dataset.testid = "elevator-far";
    farBtn.textContent = "멀리";
    farBtn.addEventListener("click", () => {
      if (solved || step >= MAX_STEPS) return;
      step += 1;
      sync();
    });
    const nearBtn = document.createElement("button");
    nearBtn.type = "button";
    nearBtn.className = "elevator-btn elevator-btn-near";
    nearBtn.dataset.testid = "elevator-near";
    nearBtn.textContent = "가까이";
    nearBtn.addEventListener("click", () => {
      if (solved || step <= 0) return;
      step -= 1;
      sync();
    });
    const row = document.createElement("div");
    row.className = "elevator-button-row";
    row.append(nearBtn, farBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "elevator-confirm-btn";
    confirmBtn.dataset.testid = "elevator-confirm";
    confirmBtn.textContent = "됐어요";
    confirmBtn.addEventListener("click", () => {
      if (solved) return;
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
