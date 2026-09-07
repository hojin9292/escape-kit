/**
 * 청소 퍼즐 P2: 손 소독제 펌프 (HY-004).
 *
 * 조작: [펌프] 탭마다 손바닥 웅덩이가 1단위씩 는다. 되돌리기 없음(펌프는 실제로
 * 되돌릴 수 없다는 자연스러운 제약을 그대로 둔다) — 대신 확정 전 웅덩이 크기가
 * 항상 보인다. [됐어요]로 확정.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { MAX_PUMPS, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;
const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag);
}

export const handSanitizerPump: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let count = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("sani-root");

    const sign = document.createElement("p");
    sign.className = "sani-sign";
    sign.textContent = "손 소독제를 펌프해 보세요 — 손바닥 가운데 동그랗게 고이는 한 번이면 충분해요.";

    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 100 100");
    view.classList.add("sani-svg");
    view.dataset.testid = "sani-view";

    const palm = svgEl("path");
    palm.setAttribute("d", "M 20 55 Q 20 82 50 88 Q 80 82 80 55 Q 70 40 50 44 Q 30 40 20 55 Z");
    palm.classList.add("sani-palm");

    const puddle = svgEl("circle");
    puddle.classList.add("sani-puddle");
    puddle.setAttribute("cx", "50");
    puddle.setAttribute("cy", "62");

    view.append(palm, puddle);

    function drawPuddle(): void {
      const r = count <= 0 ? 0 : 6 + count * 5;
      puddle.setAttribute("r", String(r));
      puddle.style.opacity = count <= 0 ? "0" : "1";
    }

    const state = document.createElement("p");
    state.className = "sani-state";
    state.dataset.testid = "sani-state";
    state.textContent = "아직 누르지 않았어요.";

    const done = document.createElement("div");
    done.className = "sani-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "딱 한 번! 알맞게 발랐어요.";
    done.hidden = true;

    function sync(): void {
      drawPuddle();
      if (count <= 0) {
        state.textContent = "아직 누르지 않았어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(count);
      if (j === "low") {
        state.textContent = "조금 더 눌러도 괜찮아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "손에서 뚝뚝 떨어질 것 같아요.";
        state.dataset.level = "high";
      } else {
        state.textContent = "손바닥 가운데 동그랗게 고였어요!";
        state.dataset.level = "good";
      }
    }

    const pumpBtn = document.createElement("button");
    pumpBtn.type = "button";
    pumpBtn.className = "sani-btn";
    pumpBtn.dataset.testid = "sani-pump";
    pumpBtn.textContent = "펌프하기";
    pumpBtn.addEventListener("click", () => {
      if (solved || count >= MAX_PUMPS) return;
      count += 1;
      sync();
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "sani-confirm-btn";
    confirmBtn.dataset.testid = "sani-confirm";
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
        // 펌프는 되돌릴 수 없지만, 손을 헹구고 새로 시작하는 것으로 재도전을 허용한다
        // (안 그러면 최대치를 넘긴 순간 이 퍼즐이 영영 풀리지 않는다).
        count = 0;
        sync();
      }
    });

    api.actions.appendChild(confirmBtn);
    sync();
    api.root.append(sign, view, pumpBtn, state, done);

    return () => {};
  },
};
