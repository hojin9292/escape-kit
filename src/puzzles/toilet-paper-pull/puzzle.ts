/**
 * 청소 퍼즐 P4: 화장실 휴지 (HY-005).
 *
 * 조작: [당기기]/[말아넣기] 탭으로 이산 스텝을 오르내리고, [끊기]로 확정한다.
 * toothpaste-squeeze와 같은 스텝 구조지만 그림은 길이(가로 막대)라 조작 감각이 다르다.
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

export const toiletPaperPull: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("paper-root");

    const sign = document.createElement("p");
    sign.className = "paper-sign";
    sign.textContent = "이번 활동에서는 휴지 세 칸을 접어 사용해요. 점선을 보며 세 칸 정도 당겨요.";

    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 100 100");
    view.classList.add("paper-svg");
    view.dataset.testid = "paper-view";

    const roll = svgEl("circle");
    roll.setAttribute("cx", "18");
    roll.setAttribute("cy", "50");
    roll.setAttribute("r", "15");
    roll.classList.add("paper-roll");

    const core = svgEl("circle");
    core.setAttribute("cx", "18");
    core.setAttribute("cy", "50");
    core.setAttribute("r", "5");
    core.classList.add("paper-core");

    const sheet = svgEl("rect");
    sheet.setAttribute("x", "30");
    sheet.setAttribute("y", "42");
    sheet.setAttribute("height", "16");
    sheet.setAttribute("rx", "2");
    sheet.classList.add("paper-sheet");

    view.append(roll, core, sheet);

    function drawSheet(): void {
      const value = stepToValue(step);
      const w = value <= 0 ? 0 : 4 + (value / 100) * 60;
      sheet.setAttribute("width", String(w));
      sheet.style.opacity = value <= 0 ? "0" : "1";
    }

    const state = document.createElement("p");
    state.className = "paper-state";
    state.dataset.testid = "paper-state";
    state.textContent = "아직 당기지 않았어요.";

    const done = document.createElement("div");
    done.className = "paper-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "딱 좋은 길이로 끊었어요!";
    done.hidden = true;

    function sync(): void {
      drawSheet();
      const value = stepToValue(step);
      if (value <= 0) {
        state.textContent = "아직 당기지 않았어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(value);
      if (j === "low") {
        state.textContent = "조금 더 당겨도 괜찮아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "꽤 길어요. 여기서 끊어볼까요?";
        state.dataset.level = "high";
      } else {
        state.textContent = "손바닥 위에 접기 좋은 길이예요!";
        state.dataset.level = "good";
      }
    }

    const pullBtn = document.createElement("button");
    pullBtn.type = "button";
    pullBtn.className = "paper-btn paper-btn-pull";
    pullBtn.dataset.testid = "paper-pull";
    pullBtn.textContent = "당기기";
    pullBtn.addEventListener("click", () => {
      if (solved || step >= MAX_STEPS) return;
      step += 1;
      sync();
    });

    const rollBackBtn = document.createElement("button");
    rollBackBtn.type = "button";
    rollBackBtn.className = "paper-btn paper-btn-back";
    rollBackBtn.dataset.testid = "paper-rollback";
    rollBackBtn.textContent = "말아넣기";
    rollBackBtn.addEventListener("click", () => {
      if (solved || step <= 0) return;
      step -= 1;
      sync();
    });

    const buttonRow = document.createElement("div");
    buttonRow.className = "paper-button-row";
    buttonRow.append(rollBackBtn, pullBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "paper-confirm-btn";
    confirmBtn.dataset.testid = "paper-confirm";
    confirmBtn.textContent = "끊기";
    confirmBtn.addEventListener("click", () => {
      if (solved || step <= 0) return;
      const value = stepToValue(step);
      const j = judge(value);
      if (j === "good") {
        solved = true;
        done.hidden = false;
        state.textContent = "손바닥 위에 접기 좋은 길이예요!";
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
