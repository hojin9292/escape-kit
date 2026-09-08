/**
 * 최종 콘솔: 거리 진열대 서열 퍼즐 (distance-shelf-order). soap-shelf-order와 같은 구조.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { ITEMS, judgeOrder } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;
const DISPLAY_ORDER = [...ITEMS].reverse();

export const distanceShelfOrder: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let placed: string[] = [];
    let solved = false;

    api.root.classList.add("so-shelf-root");
    const sign = document.createElement("p");
    sign.className = "so-shelf-sign";
    sign.textContent = "가까운 거리부터 먼 거리 순서로 눌러서 진열대에 올려봐요.";

    const slots = document.createElement("div");
    slots.className = "so-shelf-slots";
    slots.dataset.testid = "so-shelf-slots";
    const slotEls = ITEMS.map((_, i) => {
      const el = document.createElement("div");
      el.className = "so-shelf-slot";
      el.dataset.testid = `so-shelf-slot-${i}`;
      const idx = document.createElement("span");
      idx.className = "so-shelf-slot-index";
      idx.textContent = String(i + 1);
      const label = document.createElement("span");
      label.className = "so-shelf-slot-label";
      label.textContent = i === 0 ? "가장 가깝게" : i === ITEMS.length - 1 ? "가장 멀게" : "";
      el.append(idx, label);
      slots.appendChild(el);
      return { el, label };
    });

    const pool = document.createElement("div");
    pool.className = "so-shelf-pool";
    pool.dataset.testid = "so-shelf-pool";

    const state = document.createElement("p");
    state.className = "so-shelf-state";
    state.dataset.testid = "so-shelf-state";
    state.textContent = "";

    const done = document.createElement("div");
    done.className = "so-shelf-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "정확해요! 문이 열렸어요.";
    done.hidden = true;

    function renderSlots(): void {
      slotEls.forEach(({ el, label }, i) => {
        const id = placed[i];
        const item = ITEMS.find((it) => it.id === id);
        el.classList.toggle("filled", Boolean(item));
        label.textContent = item ? item.name : i === 0 ? "가장 가깝게" : i === ITEMS.length - 1 ? "가장 멀게" : "";
      });
    }
    function renderPool(): void {
      pool.innerHTML = "";
      const remaining = DISPLAY_ORDER.filter((it) => !placed.includes(it.id));
      for (const item of remaining) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "so-shelf-card";
        btn.dataset.testid = `so-shelf-card-${item.id}`;
        btn.textContent = item.name;
        btn.addEventListener("click", () => place(item.id));
        pool.appendChild(btn);
      }
    }
    function place(id: string): void {
      if (solved || placed.length >= ITEMS.length || placed.includes(id)) return;
      placed = [...placed, id];
      renderSlots();
      renderPool();
      if (placed.length === ITEMS.length) check();
    }
    function check(): void {
      if (judgeOrder(placed)) {
        solved = true;
        done.hidden = false;
        state.textContent = "";
        api.solve();
      } else {
        state.textContent = "순서가 조금 다른 것 같아요. 다시 놓아볼까요?";
        void api.say(manifest.narrative.extra!["wrong"]);
        api.fail();
        placed = [];
        setTimeout(() => {
          renderSlots();
          renderPool();
        }, 300);
      }
    }

    const undoBtn = document.createElement("button");
    undoBtn.type = "button";
    undoBtn.className = "so-shelf-undo-btn";
    undoBtn.dataset.testid = "so-shelf-undo";
    undoBtn.textContent = "↩️ 하나 되돌리기";
    undoBtn.addEventListener("click", () => {
      if (solved || placed.length === 0) return;
      placed = placed.slice(0, -1);
      renderSlots();
      renderPool();
    });

    renderSlots();
    renderPool();
    api.root.append(sign, slots, pool, undoBtn, state, done);
    return () => {};
  },
};
