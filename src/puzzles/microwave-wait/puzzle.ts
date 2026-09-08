/**
 * 시간 퍼즐 P1: 전자레인지 (TI-003). brushing-timer와 같은 관찰형(정방향) —
 * 숫자가 줄어드는 걸 지켜보다 적당할 때 [지금!]을 누른다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { TICK_MS, judgeAtStep } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const microwaveWait: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("microwave-root");
    const sign = document.createElement("p");
    sign.className = "microwave-sign";
    sign.textContent = "전자레인지가 돌아가는 동안 지켜보다, 적당할 때 [지금!]을 눌러요.";

    const display = document.createElement("div");
    display.className = "microwave-display";
    display.dataset.testid = "microwave-display";
    display.textContent = "작동 중…";

    const state = document.createElement("p");
    state.className = "microwave-state";
    state.dataset.testid = "microwave-state";
    state.textContent = "";
    const done = document.createElement("div");
    done.className = "microwave-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "음식이 골고루 따뜻해요!";
    done.hidden = true;

    const timer = setInterval(() => {
      if (solved) return;
      step += 1;
      display.classList.toggle("tick");
    }, TICK_MS);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "microwave-confirm-btn";
    confirmBtn.dataset.testid = "microwave-confirm";
    confirmBtn.textContent = "지금!";
    confirmBtn.addEventListener("click", () => {
      if (solved) return;
      const j = judgeAtStep(step);
      if (j === "good") {
        solved = true;
        clearInterval(timer);
        done.hidden = false;
        state.textContent = "음식이 골고루 따뜻해요!";
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
      }
    });

    api.actions.appendChild(confirmBtn);
    api.root.append(sign, display, state, done);
    return () => clearInterval(timer);
  },
};
