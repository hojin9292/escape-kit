/**
 * 시간 퍼즐 P3: 횡단보도 (TI-014). 신호등이 자동으로 바뀌는 관찰형(정방향) —
 * 빨간불 → 초록불 → 깜빡임 순서로 진행되고, 초록불일 때 [건너기!]를 누른다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { TICK_MS, judgeAtStep, lightAtStep } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const crosswalkSignal: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("crosswalk-root");
    const sign = document.createElement("p");
    sign.className = "crosswalk-sign";
    sign.textContent = "신호등을 지켜보다 초록불에 차가 멈추면 [건너기!]를 눌러요.";

    const light = document.createElement("div");
    light.className = "crosswalk-light";
    light.dataset.testid = "crosswalk-light";

    function drawLight(): void {
      const l = lightAtStep(step);
      light.dataset.color = l;
      light.textContent = l === "red" ? "빨간불" : l === "green" ? "초록불" : "깜빡임";
    }
    drawLight();

    const timer = setInterval(() => {
      if (solved) return;
      step += 1;
      drawLight();
    }, TICK_MS);

    const state = document.createElement("p");
    state.className = "crosswalk-state";
    state.dataset.testid = "crosswalk-state";
    state.textContent = "";
    const done = document.createElement("div");
    done.className = "crosswalk-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "안전하게 건넜어요!";
    done.hidden = true;

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "crosswalk-confirm-btn";
    confirmBtn.dataset.testid = "crosswalk-confirm";
    confirmBtn.textContent = "건너기!";
    confirmBtn.addEventListener("click", () => {
      if (solved) return;
      const j = judgeAtStep(step);
      if (j === "good") {
        solved = true;
        clearInterval(timer);
        done.hidden = false;
        state.textContent = "안전하게 건넜어요!";
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
        step = 0;
        drawLight();
      }
    });

    api.actions.appendChild(confirmBtn);
    api.root.append(sign, light, state, done);
    return () => clearInterval(timer);
  },
};
