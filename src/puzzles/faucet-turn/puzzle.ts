/**
 * 물건 퍼즐 P2: 수도꼭지 (OB-004). toothpaste-squeeze와 같은 구조 —
 * [더 틀기]/[덜 틀기] 탭으로 이산 스텝을 오르내리고 [됐어요]로 확정한다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { MAX_STEPS, stepToValue, litersAtStep, judge } from "./autoplay";

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
    sign.textContent = "수도를 얼마나 열지 조절해요. 같은 시간 동안 받은 물의 양으로 비교해 볼게요.";

    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 180 145");
    view.classList.add("faucet-svg");
    view.dataset.testid = "faucet-view";

    const defs = svgEl("defs");
    const clip = svgEl("clipPath");
    clip.setAttribute("id", "faucet-fill-clip");
    const clipShape = svgEl("path");
    clipShape.setAttribute("d", "M46 62 H134 L126 140 H54 Z");
    clip.appendChild(clipShape);
    defs.appendChild(clip);

    const fill = svgEl("rect");
    fill.setAttribute("x", "46");
    fill.setAttribute("width", "88");
    fill.setAttribute("clip-path", "url(#faucet-fill-clip)");
    fill.classList.add("faucet-fill");

    const cup = svgEl("path");
    cup.setAttribute("d", "M46 62 H134 L126 140 H54 Z");
    cup.classList.add("faucet-cup");

    const halfMark = svgEl("path");
    halfMark.setAttribute("d", "M50 101 H64 M116 101 H130");
    halfMark.classList.add("faucet-mark");
    const halfLabel = svgEl("text");
    halfLabel.setAttribute("x", "137");
    halfLabel.setAttribute("y", "105");
    halfLabel.textContent = "0.5 L";
    halfLabel.classList.add("faucet-label");
    const fullLabel = svgEl("text");
    fullLabel.setAttribute("x", "137");
    fullLabel.setAttribute("y", "69");
    fullLabel.textContent = "1 L";
    fullLabel.classList.add("faucet-label");

    const spout = svgEl("path");
    spout.setAttribute("d", "M42 13 H102 Q112 13 112 23 V36 H96 V29 H42 Z");
    spout.classList.add("faucet-spout");
    const stream = svgEl("rect");
    stream.classList.add("faucet-stream");
    stream.setAttribute("y", "36");
    stream.setAttribute("height", "27");
    view.append(defs, fill, cup, halfMark, halfLabel, fullLabel, spout, stream);

    const amount = document.createElement("p");
    amount.className = "faucet-amount";
    amount.dataset.testid = "faucet-amount";

    function drawWater(): void {
      const value = stepToValue(step);
      const fillHeight = (value / 100) * 76;
      fill.setAttribute("y", String(140 - fillHeight));
      fill.setAttribute("height", String(fillHeight));
      // 흐름의 세기는 폭으로만 표현한다. 길이를 늘리면 '많이 틀수록 물이 더 멀리
      // 내려간다'는 잘못된 단서가 되므로 수도와 계량통 사이 거리는 고정한다.
      const streamWidth = 3 + (value / 100) * 12;
      stream.setAttribute("x", String(104 - streamWidth / 2));
      stream.setAttribute("width", String(streamWidth));
      stream.style.opacity = value <= 0 ? "0" : "1";
      fill.style.opacity = value <= 0 ? "0" : "1";
      amount.textContent = `5초 동안 받은 물: ${litersAtStep(step).toFixed(2)} L`;
    }

    const state = document.createElement("p");
    state.className = "faucet-state";
    state.dataset.testid = "faucet-state";
    state.textContent = "아직 잠겨 있어요.";
    const done = document.createElement("div");
    done.className = "faucet-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "손 씻기에 충분하면서 물을 아끼는 양이에요!";
    done.hidden = true;

    function sync(): void {
      drawWater();
      const value = stepToValue(step);
      if (value <= 0) {
        state.textContent = "아직 잠겨 있어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(value);
      if (j === "low") {
        state.textContent = "받은 물이 적어요. 흐름을 조금 늘려요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "같은 시간에 물을 너무 많이 썼어요. 흐름을 줄여요.";
        state.dataset.level = "high";
      } else {
        state.textContent = "5초에 약 0.3~0.5 L예요!";
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
    api.root.append(sign, view, amount, row, state, done);
    return () => {};
  },
};
