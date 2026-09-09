/**
 * 시간 퍼즐 P4: 친구 말 끝나기 (TI-018). microwave-wait와 같은 관찰형(정방향) —
 * 말풍선이 움직이는 동안 지켜보다 적당할 때 [지금!]을 누른다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { TICK_MS, GOOD_START, GOOD_END, judgeAtStep } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const friendTurnWait: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("friend-root");
    const sign = document.createElement("p");
    sign.className = "friend-sign";
    sign.textContent = "친구의 말을 듣다가 문장이 끝나고 나를 보면 [내 차례]를 눌러요.";

    const bubble = document.createElement("div");
    bubble.className = "friend-bubble";
    bubble.dataset.testid = "friend-bubble";
    bubble.textContent = "말하는 중…";

    const state = document.createElement("p");
    state.className = "friend-state";
    state.dataset.testid = "friend-state";
    state.textContent = "";
    const done = document.createElement("div");
    done.className = "friend-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "내 이야기가 자연스럽게 이어져요!";
    done.hidden = true;

    const timer = setInterval(() => {
      if (solved) return;
      step += 1;
      bubble.classList.toggle("blink");
      bubble.textContent = step < GOOD_START ? "친구가 말하는 중…" : step <= GOOD_END ? "말을 마치고 나를 봐요" : "다음 이야기를 시작했어요";
    }, TICK_MS);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "friend-confirm-btn";
    confirmBtn.dataset.testid = "friend-confirm";
    confirmBtn.textContent = "내 차례";
    confirmBtn.addEventListener("click", () => {
      if (solved) return;
      const j = judgeAtStep(step);
      if (j === "good") {
        solved = true;
        clearInterval(timer);
        done.hidden = false;
        state.textContent = "내 이야기가 자연스럽게 이어져요!";
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
    api.root.append(sign, bubble, state, done);
    return () => clearInterval(timer);
  },
};
