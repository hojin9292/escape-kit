/**
 * 대화 퍼즐 P4: 내 이야기 길이 (CO-014). yogurt-topping과 같은 관찰형(역방향) —
 * 이야기 카드가 자동으로 하나씩 쌓이는 동안 지켜보다, 너무 쌓이기 전에 [차례 넘기기!].
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { TICK_MS, GOOD_MAX, judgeAtStep } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const storyTurn: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("story-root");
    const sign = document.createElement("p");
    sign.className = "story-sign";
    sign.textContent = "이야기 카드가 저절로 쌓여요 — 너무 많이 쌓이기 전에 [차례 넘기기!]를 눌러요.";

    const stack = document.createElement("div");
    stack.className = "story-stack";
    stack.dataset.testid = "story-stack";

    function drawStack(): void {
      stack.innerHTML = "";
      for (let i = 0; i < Math.min(step, GOOD_MAX + 2); i++) {
        const card = document.createElement("div");
        card.className = "story-card";
        stack.appendChild(card);
      }
    }

    const state = document.createElement("p");
    state.className = "story-state";
    state.dataset.testid = "story-state";
    state.textContent = "";

    const done = document.createElement("div");
    done.className = "story-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "친구가 이어서 이야기해요!";
    done.hidden = true;

    drawStack();
    const timer = setInterval(() => {
      if (solved) return;
      step += 1;
      drawStack();
    }, TICK_MS);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "story-confirm-btn";
    confirmBtn.dataset.testid = "story-confirm";
    confirmBtn.textContent = "차례 넘기기!";
    confirmBtn.addEventListener("click", () => {
      if (solved) return;
      const j = judgeAtStep(step);
      if (j === "good") {
        solved = true;
        clearInterval(timer);
        done.hidden = false;
        state.textContent = "친구가 이어서 이야기해요!";
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
        drawStack();
      }
    });

    api.actions.appendChild(confirmBtn);
    api.root.append(sign, stack, state, done);
    return () => clearInterval(timer);
  },
};
