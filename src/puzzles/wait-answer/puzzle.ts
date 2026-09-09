/**
 * 대화 퍼즐 P3: 질문 후 기다리기 (CO-008). brushing-timer와 같은 관찰형(정방향) —
 * "생각 중…" 표시가 깜빡이는 동안 지켜보다, 적당할 때 [지금!]을 누른다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { TICK_MS, GOOD_START, GOOD_END, judgeAtStep } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const waitAnswer: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("wait-root");
    const sign = document.createElement("p");
    sign.className = "wait-sign";
    sign.textContent = "질문한 뒤 선생님의 표정을 살펴봐요. 생각을 마치고 나를 보면 [대답 듣기]를 눌러요.";

    const bubble = document.createElement("div");
    bubble.className = "wait-bubble";
    bubble.dataset.testid = "wait-bubble";
    bubble.textContent = "생각 중…";

    const state = document.createElement("p");
    state.className = "wait-state";
    state.dataset.testid = "wait-state";
    state.textContent = "";

    const done = document.createElement("div");
    done.className = "wait-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "선생님이 답해줬어요!";
    done.hidden = true;

    const timer = setInterval(() => {
      if (solved) return;
      step += 1;
      bubble.classList.toggle("blink");
      bubble.textContent = step < GOOD_START ? "생각 중…" : step <= GOOD_END ? "고개를 들고 나를 봐요" : "다른 일을 시작했어요";
    }, TICK_MS);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "wait-confirm-btn";
    confirmBtn.dataset.testid = "wait-confirm";
    confirmBtn.textContent = "대답 듣기";
    confirmBtn.addEventListener("click", () => {
      if (solved) return;
      const j = judgeAtStep(step);
      if (j === "good") {
        solved = true;
        clearInterval(timer);
        done.hidden = false;
        state.textContent = "선생님이 답해줬어요!";
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
        // 너무 오래 기다린 뒤엔 저절로 되돌아오지 않으니 다시 지켜보게 한다.
        step = 0;
      }
    });

    api.actions.appendChild(confirmBtn);
    api.root.append(sign, bubble, state, done);
    return () => clearInterval(timer);
  },
};
