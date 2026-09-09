/**
 * 대화 퍼즐 P1: 목소리 크기 (CO-003). toothpaste-squeeze와 같은 구조 —
 * [크게]/[작게] 탭으로 이산 스텝을 오르내리고 [됐어요]로 확정한다.
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

export const voiceVolume: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("voice-root");
    const sign = document.createElement("p");
    sign.className = "voice-sign";
    sign.textContent = "조용한 도서관에서 바로 옆 짝꿍에게 말해요. 주변을 방해하지 않는 작은 목소리를 골라요.";

    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 100 100");
    view.classList.add("voice-svg");
    view.dataset.testid = "voice-view";
    const mouth = svgEl("circle");
    mouth.setAttribute("cx", "18");
    mouth.setAttribute("cy", "50");
    mouth.setAttribute("r", "10");
    mouth.classList.add("voice-mouth");
    const ringsGroup = svgEl("g");
    const ear = svgEl("circle");
    ear.setAttribute("cx", "88");
    ear.setAttribute("cy", "50");
    ear.setAttribute("r", "7");
    ear.classList.add("voice-ear");
    view.append(mouth, ringsGroup, ear);

    function drawRings(): void {
      ringsGroup.innerHTML = "";
      const value = stepToValue(step);
      const rings = Math.round((value / 100) * 5);
      for (let i = 0; i < rings; i++) {
        const r = 16 + i * 12;
        const path = svgEl("path");
        path.setAttribute("d", `M 18 ${50 - r * 0.7} A ${r} ${r} 0 0 1 18 ${50 + r * 0.7}`);
        path.classList.add("voice-ring");
        ringsGroup.appendChild(path);
      }
    }

    const state = document.createElement("p");
    state.className = "voice-state";
    state.dataset.testid = "voice-state";
    state.textContent = "아직 말하지 않았어요.";
    const done = document.createElement("div");
    done.className = "voice-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "딱 좋은 크기예요!";
    done.hidden = true;

    function sync(): void {
      drawRings();
      const value = stepToValue(step);
      if (value <= 0) {
        state.textContent = "아직 말하지 않았어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(value);
      if (j === "low") {
        state.textContent = "조금 더 크게 말해도 괜찮아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "조금 줄여볼까요?";
        state.dataset.level = "high";
      } else {
        state.textContent = "딱 좋은 크기예요!";
        state.dataset.level = "good";
      }
    }

    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "voice-btn voice-btn-up";
    upBtn.dataset.testid = "voice-up";
    upBtn.textContent = "크게";
    upBtn.addEventListener("click", () => {
      if (solved || step >= MAX_STEPS) return;
      step += 1;
      sync();
    });
    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.className = "voice-btn voice-btn-down";
    downBtn.dataset.testid = "voice-down";
    downBtn.textContent = "작게";
    downBtn.addEventListener("click", () => {
      if (solved || step <= 0) return;
      step -= 1;
      sync();
    });
    const row = document.createElement("div");
    row.className = "voice-button-row";
    row.append(downBtn, upBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "voice-confirm-btn";
    confirmBtn.dataset.testid = "voice-confirm";
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
