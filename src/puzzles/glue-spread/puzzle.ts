/**
 * 물건 퍼즐 P4: 풀칠 (OB-011). jam-spread와 같은 격자 탭 구조 —
 * 칸을 눌러 풀을 바르고(다시 누르면 지움), [됐어요]로 확정한다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { COLS, TOTAL_CELLS, cellsToPercent, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const glueSpread: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;
    const spread = new Array<boolean>(TOTAL_CELLS).fill(false);

    api.root.classList.add("glue-root");
    const sign = document.createElement("p");
    sign.className = "glue-sign";
    sign.textContent = "칸을 눌러 풀을 발라 보세요 — 네 귀퉁이와 가운데에 닿을 만큼. 다시 누르면 지워져요.";

    const grid = document.createElement("div");
    grid.className = "glue-grid";
    grid.dataset.testid = "glue-grid";
    grid.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

    for (let i = 0; i < TOTAL_CELLS; i++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "glue-cell";
      cell.dataset.testid = `glue-cell-${i}`;
      cell.addEventListener("click", () => {
        if (solved) return;
        spread[i] = !spread[i];
        cell.classList.toggle("on", spread[i]);
        sync();
      });
      grid.appendChild(cell);
    }

    const state = document.createElement("p");
    state.className = "glue-state";
    state.dataset.testid = "glue-state";
    state.textContent = "아직 안 발랐어요.";
    const done = document.createElement("div");
    done.className = "glue-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "딱 좋게 발랐어요!";
    done.hidden = true;

    function coveredCount(): number {
      return spread.filter(Boolean).length;
    }
    function sync(): void {
      const covered = coveredCount();
      const percent = cellsToPercent(covered);
      if (covered <= 0) {
        state.textContent = "아직 안 발랐어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(percent);
      if (j === "low") {
        state.textContent = "조금 더 넓게 발라도 괜찮아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "조금 많아요. 줄여볼까요?";
        state.dataset.level = "high";
      } else {
        state.textContent = "네 귀퉁이까지 잘 발랐어요!";
        state.dataset.level = "good";
      }
    }

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "glue-confirm-btn";
    confirmBtn.dataset.testid = "glue-confirm";
    confirmBtn.textContent = "됐어요";
    confirmBtn.addEventListener("click", () => {
      if (solved) return;
      const covered = coveredCount();
      if (covered <= 0) return;
      const percent = cellsToPercent(covered);
      const j = judge(percent);
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
    sync();
    api.root.append(sign, grid, state, done);
    return () => {};
  },
};
