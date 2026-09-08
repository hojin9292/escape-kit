/**
 * 식사 퍼즐 P3: 잼 바르기 (FO-005).
 *
 * 조작: 6×4 격자 칸을 탭하면 잼이 발리고(다시 탭하면 지워짐 — 확정 전 자유 수정),
 * [됐어요]로 확정하면 칠해진 칸 비율(%)을 정답 구간과 비교한다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { COLS, TOTAL_CELLS, cellsToPercent, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const jamSpread: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;
    const spread = new Array<boolean>(TOTAL_CELLS).fill(false);

    api.root.classList.add("jam-root");

    const sign = document.createElement("p");
    sign.className = "jam-sign";
    sign.textContent =
      "칸을 눌러 잼을 발라 보세요 — 빵 색이 살짝 비칠 만큼 얇고 고르게. 잘못 눌렀으면 다시 눌러 지워요.";

    const grid = document.createElement("div");
    grid.className = "jam-grid";
    grid.dataset.testid = "jam-grid";
    grid.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

    for (let i = 0; i < TOTAL_CELLS; i++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "jam-cell";
      cell.dataset.testid = `jam-cell-${i}`;
      cell.addEventListener("click", () => {
        if (solved) return;
        spread[i] = !spread[i];
        cell.classList.toggle("on", spread[i]);
        sync();
      });
      grid.appendChild(cell);
    }

    const state = document.createElement("p");
    state.className = "jam-state";
    state.dataset.testid = "jam-state";
    state.textContent = "아직 바르지 않았어요.";

    const done = document.createElement("div");
    done.className = "jam-done";
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
        state.textContent = "아직 바르지 않았어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(percent);
      if (j === "low") {
        state.textContent = "조금 더 넓게 펴도 괜찮아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "조금 두꺼워요. 줄여볼까요?";
        state.dataset.level = "high";
      } else {
        state.textContent = "빵 색이 살짝 비쳐요!";
        state.dataset.level = "good";
      }
    }

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "jam-confirm-btn";
    confirmBtn.dataset.testid = "jam-confirm";
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
        state.textContent = "빵 색이 살짝 비쳐요!";
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
