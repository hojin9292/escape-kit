/**
 * 사회성 퍼즐 P2: 어깨 톡톡 (SO-010). 이 방에서 처음 쓰는 **단계 선택** 조작 —
 * 1~5단계 버튼 중 하나를 탭해 고르고(자유롭게 바꿀 수 있음) [톡톡]으로 확정한다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { LEVELS, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const shoulderTap: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let selected: number | null = null;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("tap-root");
    const sign = document.createElement("p");
    sign.className = "tap-sign";
    sign.textContent = "친구 어깨를 두드릴 세기를 골라 보세요 — 1단계가 가장 약해요.";

    const levelRow = document.createElement("div");
    levelRow.className = "tap-level-row";
    levelRow.dataset.testid = "tap-levels";
    const levelBtns = LEVELS.map((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tap-level-btn";
      btn.dataset.testid = `tap-level-${i}`;
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
    state.className = "tap-state";
    state.dataset.testid = "tap-state";
    state.textContent = "세기를 골라 보세요.";
    const done = document.createElement("div");
    done.className = "tap-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "친구가 자연스럽게 돌아봤어요!";
    done.hidden = true;

    function sync(): void {
      if (selected === null) {
        state.textContent = "세기를 골라 보세요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(LEVELS[selected]);
      if (j === "low") {
        state.textContent = "이 정도면 친구가 못 느낄 수도 있어요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "이 정도면 친구가 아플 수도 있어요.";
        state.dataset.level = "high";
      } else {
        state.textContent = "딱 좋은 세기 같아요!";
        state.dataset.level = "good";
      }
    }

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "tap-confirm-btn";
    confirmBtn.dataset.testid = "tap-confirm";
    confirmBtn.textContent = "톡톡";
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
