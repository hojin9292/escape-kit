/**
 * 식사 퍼즐 P2: 얼음 넣기 (FO-008).
 *
 * 조작: [넣기] 탭마다 얼음이 1개씩 쌓인다. 되돌리기 없음(hand-sanitizer-pump와 같은
 * 설계 — 넣은 얼음은 도로 못 뺀다). 오답(too high) 확정 시 컵을 비우고 재도전.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { MAX_ICE, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;
const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag);
}

export const iceDrop: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let count = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("ice-root");

    const sign = document.createElement("p");
    sign.className = "ice-sign";
    sign.textContent = "주문표에 ‘얼음 두세 개’라고 적혀 있어요. 하나씩 세어 넣어요.";

    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 100 100");
    view.classList.add("ice-svg");
    view.dataset.testid = "ice-view";

    const cup = svgEl("path");
    cup.setAttribute("d", "M25 22 H75 L69 82 Q68 88 61 88 H39 Q32 88 31 82 Z");
    cup.classList.add("ice-cup");
    view.appendChild(cup);

    const cubesGroup = svgEl("g");
    view.appendChild(cubesGroup);

    function drawCubes(): void {
      cubesGroup.innerHTML = "";
      const cols = 3;
      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const cube = svgEl("rect");
        cube.setAttribute("x", String(34 + col * 11));
        cube.setAttribute("y", String(73 - row * 11));
        cube.setAttribute("width", "10");
        cube.setAttribute("height", "10");
        cube.setAttribute("rx", "2.5");
        cube.setAttribute("transform", `rotate(${col === 1 ? -5 : 5} ${39 + col * 11} ${78 - row * 11})`);
        cube.classList.add("ice-cube");
        cubesGroup.appendChild(cube);
      }
    }

    const state = document.createElement("p");
    state.className = "ice-state";
    state.dataset.testid = "ice-state";
    state.textContent = "아직 넣지 않았어요.";

    const done = document.createElement("div");
    done.className = "ice-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "딱 좋은 개수예요!";
    done.hidden = true;

    function sync(): void {
      drawCubes();
      if (count <= 0) {
        state.textContent = "아직 넣지 않았어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(count);
      if (j === "low") {
        state.textContent = "조금 더 넣어도 괜찮아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "얼음이 컵 위로 솟았어요.";
        state.dataset.level = "high";
      } else {
        state.textContent = "주문표의 두세 개를 넣었어요!";
        state.dataset.level = "good";
      }
    }

    const dropBtn = document.createElement("button");
    dropBtn.type = "button";
    dropBtn.className = "ice-btn";
    dropBtn.dataset.testid = "ice-drop-btn";
    dropBtn.textContent = "넣기";
    dropBtn.addEventListener("click", () => {
      if (solved || count >= MAX_ICE) return;
      count += 1;
      sync();
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "ice-confirm-btn";
    confirmBtn.dataset.testid = "ice-confirm";
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
    api.root.append(sign, view, dropBtn, state, done);

    return () => {};
  },
};
