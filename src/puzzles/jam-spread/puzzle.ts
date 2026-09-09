/** 식사 퍼즐 P3: 빵 위를 직접 문질러 잼을 얇고 고르게 편다. */
import "./puzzle.css";
import type { PuzzleApi, PuzzleManifest, PuzzleModule } from "../../engine/puzzle-host/types";
import { onDrag } from "../../engine/input/pointer";
import manifestJson from "./manifest.json";
import { COLS, ROWS, cellsToPercent, judge, judgeSpread } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const jamSpread: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let solved = false;
    let saidLow = false;
    let saidHigh = false;
    const painted = new Set<number>();

    api.root.classList.add("jam-root");
    const sign = document.createElement("p");
    sign.className = "jam-sign";
    sign.textContent = "손가락이나 마우스로 빵 위를 문질러 잼을 얇고 고르게 펴 발라요.";

    const surface = document.createElement("div");
    surface.className = "jam-surface";
    surface.dataset.testid = "jam-surface";
    surface.setAttribute("role", "img");
    surface.setAttribute("aria-label", "잼을 문질러 바르는 식빵");
    const spreadLayer = document.createElement("div");
    spreadLayer.className = "jam-spread-layer";
    const knife = document.createElement("span");
    knife.className = "jam-knife";
    knife.textContent = "🥄";
    surface.append(spreadLayer, knife);

    const state = document.createElement("p");
    state.className = "jam-state";
    state.dataset.testid = "jam-state";
    const done = document.createElement("div");
    done.className = "jam-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "얇고 고르게 발랐어요!";
    done.hidden = true;

    function renderCell(id: number): void {
      const row = Math.floor(id / COLS);
      const col = id % COLS;
      const stamp = document.createElement("i");
      stamp.style.left = `${((col + 0.5) / COLS) * 100}%`;
      stamp.style.top = `${((row + 0.5) / ROWS) * 100}%`;
      spreadLayer.appendChild(stamp);
    }

    function paint(x: number, y: number): void {
      if (solved) return;
      const rect = surface.getBoundingClientRect();
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      const col = Math.min(COLS - 1, Math.floor((x / rect.width) * COLS));
      const row = Math.min(ROWS - 1, Math.floor((y / rect.height) * ROWS));
      const id = row * COLS + col;
      knife.style.left = `${x}px`;
      knife.style.top = `${y}px`;
      knife.classList.add("active");
      if (!painted.has(id)) {
        painted.add(id);
        renderCell(id);
        sync();
      }
    }

    function sync(): void {
      if (painted.size === 0) {
        state.textContent = "아직 바르지 않았어요.";
        delete state.dataset.level;
        return;
      }
      const amount = judge(cellsToPercent(painted.size));
      const result = judgeSpread(painted);
      if (amount === "high") {
        state.textContent = "조금 두꺼워요. 다시 얇게 발라볼까요?";
        state.dataset.level = "high";
      } else if (result === "good") {
        state.textContent = "빵 전체에 얇고 고르게 퍼졌어요!";
        state.dataset.level = "good";
      } else if (amount === "good") {
        state.textContent = "한쪽에 몰렸어요. 빈 쪽으로 더 펴봐요.";
        state.dataset.level = "low";
      } else {
        state.textContent = "마른 부분이 남아 있어요. 조금 더 펴봐요.";
        state.dataset.level = "low";
      }
    }

    const releaseDrag = onDrag(surface, {
      onStart: ({ x, y }) => paint(x, y),
      onMove: ({ x, y }) => paint(x, y),
      onEnd: () => knife.classList.remove("active"),
    });

    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "jam-reset-btn";
    reset.dataset.testid = "jam-reset";
    reset.textContent = "↺ 새 빵으로 다시";
    reset.addEventListener("click", () => {
      if (solved) return;
      painted.clear();
      spreadLayer.replaceChildren();
      knife.classList.remove("active");
      sync();
    });

    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.className = "jam-confirm-btn";
    confirm.dataset.testid = "jam-confirm";
    confirm.textContent = "다 발랐어요";
    confirm.addEventListener("click", () => {
      if (solved || painted.size === 0) return;
      const result = judgeSpread(painted);
      if (result === "good") {
        solved = true;
        done.hidden = false;
        state.dataset.level = "good";
        api.solve();
      } else if (result === "high") {
        if (!saidHigh) {
          saidHigh = true;
          void api.say(manifest.narrative.extra!["toohigh"]);
        }
        api.fail();
      } else {
        if (!saidLow) {
          saidLow = true;
          void api.say(manifest.narrative.extra!["toolow"]);
        }
        api.fail();
      }
    });

    api.actions.append(reset, confirm);
    sync();
    api.root.append(sign, surface, state, done);
    return releaseDrag;
  },
};
