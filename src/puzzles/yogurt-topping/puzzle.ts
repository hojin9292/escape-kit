/**
 * 식사 퍼즐 P4: 요거트 토핑 (FO-017).
 *
 * 조작: 토핑이 TICK_MS 간격으로 자동으로 하나씩 떨어진다(입력 없이 진행).
 * 요거트 흰 부분이 아직 보이는 동안 [그만!]을 누르면 정답 — brushing-timer와
 * 짝을 이루는 관찰형이지만 "사라지기 전에 멈춰야" 하는 반대 방향 판단이다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { TICK_MS, whitePercentAtStep, judgeAtStep } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;
const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag);
}

export const yogurtTopping: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("topping-root");

    const sign = document.createElement("p");
    sign.className = "topping-sign";
    sign.textContent = "토핑이 저절로 떨어져요 — 요거트 흰 부분이 아직 보일 때 [그만!]을 눌러요.";

    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 100 100");
    view.classList.add("topping-svg");
    view.dataset.testid = "topping-view";

    const bowl = svgEl("circle");
    bowl.setAttribute("cx", "50");
    bowl.setAttribute("cy", "55");
    bowl.setAttribute("r", "38");
    bowl.classList.add("topping-bowl");

    const white = svgEl("circle");
    white.setAttribute("cx", "50");
    white.setAttribute("cy", "55");
    white.classList.add("topping-white");

    view.append(bowl, white);

    function drawWhite(): void {
      const pct = whitePercentAtStep(step);
      const r = 34 * Math.sqrt(pct / 100);
      white.setAttribute("r", String(r));
      white.style.opacity = pct <= 0 ? "0" : "1";
    }

    const state = document.createElement("p");
    state.className = "topping-state";
    state.dataset.testid = "topping-state";
    state.textContent = "지켜보는 중…";

    const done = document.createElement("div");
    done.className = "topping-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "흰 부분이 남아있어요!";
    done.hidden = true;

    drawWhite();

    const timer = setInterval(() => {
      if (solved) return;
      step += 1;
      drawWhite();
    }, TICK_MS);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "topping-confirm-btn";
    confirmBtn.dataset.testid = "topping-confirm";
    confirmBtn.textContent = "그만!";
    confirmBtn.addEventListener("click", () => {
      if (solved) return;
      const j = judgeAtStep(step);
      if (j === "good") {
        solved = true;
        clearInterval(timer);
        done.hidden = false;
        state.textContent = "흰 부분이 남아있어요!";
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
        // 다 덮인 뒤엔 저절로 되돌아오지 않으니, 새 요거트로 다시 지켜보게 한다.
        step = 0;
        drawWhite();
      }
    });

    api.actions.appendChild(confirmBtn);
    api.root.append(sign, view, state, done);

    return () => clearInterval(timer);
  },
};
