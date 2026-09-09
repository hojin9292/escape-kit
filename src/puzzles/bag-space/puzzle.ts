/** 사회성 퍼즐 P4: 버스에서 가방 둘 곳 고르기. */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { CHOICES, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;
const OPTIONS = [
  { asset: "ui-bag-seat", title: "옆 빈 좌석", detail: "가방이 한 자리를 차지해요." },
  { asset: "ui-bag-aisle", title: "통로 가운데", detail: "지나가는 사람이 걸릴 수 있어요." },
  { asset: "ui-bag-feet", title: "내 발 사이", detail: "가방을 세워 통로를 비워요." },
] as const;

export const bagSpace: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let selected: number | null = null;
    let solved = false;
    let saidLow = false;
    let saidHigh = false;
    api.root.classList.add("bag-root");
    const sign = document.createElement("p");
    sign.className = "bag-sign";
    sign.textContent = "사람이 많은 버스예요. 다른 자리와 통로를 비워 둘 수 있는 가방 자리를 골라요.";
    const state = document.createElement("p");
    state.className = "bag-state";
    state.dataset.testid = "bag-state";
    state.textContent = "가방을 둘 곳을 골라 보세요.";
    const row = document.createElement("div");
    row.className = "bag-choice-row";
    const buttons = OPTIONS.map((option, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bag-choice-btn";
      btn.dataset.testid = `bag-choice-${i}`;
      btn.innerHTML = `<img src="./assets/${option.asset}.png" alt="" aria-hidden="true"><strong>${option.title}</strong><small>${option.detail}</small>`;
      btn.addEventListener("click", () => {
        if (solved) return;
        selected = i;
        buttons.forEach((b, j) => b.classList.toggle("selected", i === j));
        state.textContent = i === 2 ? "좌석과 통로를 모두 비워 둘 수 있어요." : "다른 사람이 앉거나 지나갈 자리도 살펴볼까요?";
        state.dataset.level = i === 2 ? "good" : "high";
      });
      row.appendChild(btn);
      return btn;
    });
    const done = document.createElement("div");
    done.className = "bag-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "옆자리도 통로도 편하게 사용할 수 있어요!";
    done.hidden = true;
    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "bag-confirm-btn";
    confirmBtn.dataset.testid = "bag-confirm";
    confirmBtn.textContent = "여기에 둘래요";
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
    api.root.append(sign, row, state, done);
    return () => {};
  },
};
