/**
 * 물건 퍼즐 P2: 수도꼭지 (OB-004). toothpaste-squeeze와 같은 구조 —
 * [더 틀기]/[덜 틀기] 탭으로 이산 스텝을 오르내리고 [됐어요]로 확정한다.
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

export const faucetTurn: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("faucet-root");
    const sign = document.createElement("p");
    sign.className = "faucet-sign";
    sign.textContent = "수도꼭지를 돌려 보세요 — 물줄기가 곧게 떨어지고 튀지 않을 만큼이면 충분해요.";

    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 100 100");
    view.classList.add("faucet-svg");
    view.dataset.testid = "faucet-view";
    const spout = svgEl("rect");
    spout.setAttribute("x", "35");
    spout.setAttribute("y", "20");
    spout.setAttribute("width", "30");
    spout.setAttribute("height", "12");
    spout.setAttribute("rx", "4");
    spout.classList.add("faucet-spout");
    const stream = svgEl("rect");
    stream.classList.add("faucet-stream");
    stream.setAttribute("x", "46");
    stream.setAttribute("y", "32");
    stream.setAttribute("width", "8");
    view.append(spout, stream);

    function drawStream(): void {
      const value = stepToValue(step);
      const h = (value / 100) * 55;
      stream.setAttribute("height", String(h));
      stream.style.opacity = value <= 0 ? "0" : "1";
    }

    const state = document.createElement("p");
    state.className = "faucet-state";
    state.dataset.testid = "faucet-state";
    state.textContent = "아직 잠겨 있어요.";
    const done = document.createElement("div");
    done.className = "faucet-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "딱 좋은 물줄기예요!";
    done.hidden = true;

    function sync(): void {
      drawStream();
      const value = stepToValue(step);
      if (value <= 0) {
        state.textContent = "아직 잠겨 있어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(value);
      if (j === "low") {
        state.textContent = "조금 더 틀어도 괜찮아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "물이 튈 것 같아요. 줄여볼까요?";
        state.dataset.level = "high";
      } else {
        state.textContent = "물줄기가 곧게 떨어져요!";
        state.dataset.level = "good";
      }
    }

    const moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "faucet-btn faucet-btn-more";
    moreBtn.dataset.testid = "faucet-more";
    moreBtn.textContent = "더 틀기";
    moreBtn.addEventListener("click", () => {
      if (solved || step >= MAX_STEPS) return;
      step += 1;
      sync();
    });
    const lessBtn = document.createElement("button");
    lessBtn.type = "button";
    lessBtn.className = "faucet-btn faucet-btn-less";
    lessBtn.dataset.testid = "faucet-less";
    lessBtn.textContent = "덜 틀기";
    lessBtn.addEventListener("click", () => {
      if (solved || step <= 0) return;
      step -= 1;
      sync();
    });
    const row = document.createElement("div");
    row.className = "faucet-button-row";
    row.append(lessBtn, moreBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "faucet-confirm-btn";
    confirmBtn.dataset.testid = "faucet-confirm";
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
