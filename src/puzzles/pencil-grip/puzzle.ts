/**
 * 물건 퍼즐 P1: 연필 잡기 (OB-001). shoulder-tap과 같은 **단계 선택** 조작.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { LEVELS, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const pencilGrip: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let selected: number | null = null;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("pencil-root");
    const sign = document.createElement("p");
    sign.className = "pencil-sign";
    sign.textContent = "연필을 잡을 세기를 골라 보세요 — 1단계가 가장 약해요.";

    const levelRow = document.createElement("div");
    levelRow.className = "pencil-level-row";
    levelRow.dataset.testid = "pencil-levels";
    const levelBtns = LEVELS.map((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pencil-level-btn";
      btn.dataset.testid = `pencil-level-${i}`;
      btn.textContent = String(i + 1);
      btn.addEventListener("click", () => {
        if (solved) return;
        selected = i;
        levelBtns.forEach((b, j) => b.classList.toggle("selected", j === i));
        sync();
      });
      levelRow.appendChild(btn);
      return btn;
    });

    const state = document.createElement("p");
    state.className = "pencil-state";
    state.dataset.testid = "pencil-state";
    state.textContent = "세기를 골라 보세요.";
    const done = document.createElement("div");
    done.className = "pencil-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "글씨가 또렷하게 써져요!";
    done.hidden = true;

    function sync(): void {
      if (selected === null) {
        state.textContent = "세기를 골라 보세요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(LEVELS[selected]);
      if (j === "low") {
        state.textContent = "연필이 손에서 미끄러질 것 같아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "손가락이 하얘질 것 같아요.";
        state.dataset.level = "high";
      } else {
        state.textContent = "딱 좋은 세기 같아요!";
        state.dataset.level = "good";
      }
    }

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "pencil-confirm-btn";
    confirmBtn.dataset.testid = "pencil-confirm";
    confirmBtn.textContent = "써보기";
    confirmBtn.addEventListener("click", () => {
      if (solved || selected === null) return;
      const j = judge(LEVELS[selected]);
      if (j === "good") {
        solved = true;
        done.hidden = false;
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
      }
    });

    api.actions.appendChild(confirmBtn);
    api.root.append(sign, levelRow, state, done);
    return () => {};
  },
};
