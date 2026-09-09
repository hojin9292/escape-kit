/** 물건 퍼즐 P4: 종이 위를 직접 문질러 네 귀퉁이와 가운데에 풀을 바른다. */
import "./puzzle.css";
import type { PuzzleApi, PuzzleManifest, PuzzleModule } from "../../engine/puzzle-host/types";
import { onDrag } from "../../engine/input/pointer";
import manifestJson from "./manifest.json";
import { COLS, ROWS, REQUIRED_ZONES, judgeSpread } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const glueSpread: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let solved = false;
    let saidLow = false;
    let saidHigh = false;
    const painted = new Set<number>();

    api.root.classList.add("glue-root");
    const sign = document.createElement("p");
    sign.className = "glue-sign";
    sign.textContent = "풀 막대를 움직여 네 귀퉁이와 가운데에 얇게 발라요.";

    const surface = document.createElement("div");
    surface.className = "glue-surface";
    surface.dataset.testid = "glue-surface";
    surface.setAttribute("role", "img");
    surface.setAttribute("aria-label", "풀을 문질러 바르는 종이");
    const guide = document.createElement("div");
    guide.className = "glue-guide";
    for (let i = 0; i < REQUIRED_ZONES.length; i += 1) guide.appendChild(document.createElement("i"));
    const spreadLayer = document.createElement("div");
    spreadLayer.className = "glue-spread-layer";
    const stick = document.createElement("img");
    stick.className = "glue-stick";
    stick.src = "./assets/ui-glue-stick.png";
    stick.alt = "";
    surface.append(guide, spreadLayer, stick);

    const state = document.createElement("p");
    state.className = "glue-state";
    state.dataset.testid = "glue-state";
    const done = document.createElement("div");
    done.className = "glue-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "네 귀퉁이와 가운데에 잘 발랐어요!";
    done.hidden = true;

    function renderCell(id: number): void {
      const row = Math.floor(id / COLS);
      const col = id % COLS;
      const stroke = document.createElement("i");
      stroke.style.left = `${((col + 0.5) / COLS) * 100}%`;
      stroke.style.top = `${((row + 0.5) / ROWS) * 100}%`;
      spreadLayer.appendChild(stroke);
    }

    function paint(x: number, y: number): void {
      if (solved) return;
      const rect = surface.getBoundingClientRect();
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      const col = Math.min(COLS - 1, Math.floor((x / rect.width) * COLS));
      const row = Math.min(ROWS - 1, Math.floor((y / rect.height) * ROWS));
      const id = row * COLS + col;
      stick.style.left = `${x}px`;
      stick.style.top = `${y}px`;
      stick.classList.add("active");
      if (!painted.has(id)) {
        painted.add(id);
        renderCell(id);
        sync();
      }
    }

    function sync(): void {
      if (painted.size === 0) {
        state.textContent = "점선으로 표시된 곳을 따라 발라보세요.";
        delete state.dataset.level;
        return;
      }
      const missing = REQUIRED_ZONES.filter((id) => !painted.has(id)).length;
      const result = judgeSpread(painted);
      if (result === "high") {
        state.textContent = "풀이 너무 넓게 묻었어요. 새 종이로 다시 해봐요.";
        state.dataset.level = "high";
      } else if (result === "good") {
        state.textContent = "귀퉁이와 가운데가 모두 반짝여요!";
        state.dataset.level = "good";
      } else {
        state.textContent = `아직 ${missing}곳이 남았어요.`;
        state.dataset.level = "low";
      }
    }

    const releaseDrag = onDrag(surface, {
      onStart: ({ x, y }) => paint(x, y),
      onMove: ({ x, y }) => paint(x, y),
      onEnd: () => stick.classList.remove("active"),
    });

    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "glue-reset-btn";
    reset.dataset.testid = "glue-reset";
    reset.textContent = "↺ 새 종이로 다시";
    reset.addEventListener("click", () => {
      if (solved) return;
      painted.clear();
      spreadLayer.replaceChildren();
      stick.classList.remove("active");
      sync();
    });

    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.className = "glue-confirm-btn";
    confirm.dataset.testid = "glue-confirm";
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
