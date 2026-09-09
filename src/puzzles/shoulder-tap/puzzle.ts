/** 사회성 퍼즐 P2: 좁은 길에서 부탁하기. */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { CHOICES, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;
const LABELS = [
  { icon: "✋", title: "말없이 밀고 지나가기", detail: "친구 몸을 밀어요." },
  { icon: "💬", title: "“잠깐 지나갈게” 말하기", detail: "말한 뒤 친구가 움직일 때까지 기다려요." },
  { icon: "📣", title: "큰 소리로 비키라고 하기", detail: "친구에게 계속 크게 말해요." },
] as const;

export const shoulderTap: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let selected: number | null = null;
    let solved = false;
    let saidLow = false;
    let saidHigh = false;
    api.root.classList.add("tap-root");

    const sign = document.createElement("p");
    sign.className = "tap-sign";
    sign.textContent = "교실 통로를 친구가 막고 있어요. 안전하고 기분 좋게 지나가는 방법을 골라요.";
    const scene = document.createElement("div");
    scene.className = "tap-scene";
    scene.innerHTML = '<span aria-hidden="true">🚶</span><span class="tap-path">통로</span><span aria-hidden="true">🧍</span>';
    const state = document.createElement("p");
    state.className = "tap-state";
    state.dataset.testid = "tap-state";
    state.textContent = "한 가지 방법을 골라 보세요.";

    const choiceRow = document.createElement("div");
    choiceRow.className = "tap-choice-row";
    choiceRow.dataset.testid = "tap-choices";
    const buttons = LABELS.map((label, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tap-choice-btn";
      btn.dataset.testid = `tap-choice-${i}`;
      btn.innerHTML = `<span class="tap-choice-icon" aria-hidden="true">${label.icon}</span><strong>${label.title}</strong><small>${label.detail}</small>`;
      btn.addEventListener("click", () => {
        if (solved) return;
        selected = i;
        buttons.forEach((b, j) => b.classList.toggle("selected", j === i));
        state.textContent = i === 1 ? "말하고 기다리는 방법을 골랐어요." : "친구의 몸과 기분도 생각해 볼까요?";
        state.dataset.level = i === 1 ? "good" : "high";
      });
      choiceRow.appendChild(btn);
      return btn;
    });

    const done = document.createElement("div");
    done.className = "tap-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "친구가 길을 비켜 주었어요. “고마워!”";
    done.hidden = true;
    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "tap-confirm-btn";
    confirmBtn.dataset.testid = "tap-confirm";
    confirmBtn.textContent = "이렇게 할래요";
    confirmBtn.addEventListener("click", () => {
      if (solved || selected === null) return;
      const result = judge(CHOICES[selected]);
      if (result === "good") {
        solved = true; done.hidden = false; state.dataset.level = "good"; api.solve();
      } else if (result === "low") {
        if (!saidLow) { saidLow = true; void api.say(manifest.narrative.extra!["toolow"]); }
        api.fail();
      } else {
        if (!saidHigh) { saidHigh = true; void api.say(manifest.narrative.extra!["toohigh"]); }
        api.fail();
      }
    });
    api.actions.appendChild(confirmBtn);
    api.root.append(sign, scene, choiceRow, state, done);
    return () => {};
  },
};
