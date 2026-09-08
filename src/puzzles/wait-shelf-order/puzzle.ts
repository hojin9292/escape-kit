/**
 * 최종 콘솔: 기다림 진열대 서열 퍼즐 (wait-shelf-order). soap-shelf-order와 같은 구조.
 * 6방 중 마지막 방의 마지막 자물쇠 — 이 퍼즐의 reward.event(door:time-open)가
 * 게임 전체의 마지막 문을 연다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { ITEMS, judgeOrder } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;
const DISPLAY_ORDER = [...ITEMS].reverse();

export const waitShelfOrder: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let placed: string[] = [];
    let solved = false;

    api.root.classList.add("ti-shelf-root");
    const sign = document.createElement("p");
    sign.className = "ti-shelf-sign";
    sign.textContent = "짧은 기다림부터 긴 기다림 순서로 눌러서 진열대에 올려봐요.";

    const slots = document.createElement("div");
    slots.className = "ti-shelf-slots";
    slots.dataset.testid = "ti-shelf-slots";
    const slotEls = ITEMS.map((_, i) => {
      const el = document.createElement("div");
      el.className = "ti-shelf-slot";
      el.dataset.testid = `ti-shelf-slot-${i}`;
      const idx = document.createElement("span");
      idx.className = "ti-shelf-slot-index";
      idx.textContent = String(i + 1);
      const label = document.createElement("span");
      label.className = "ti-shelf-slot-label";
      label.textContent = i === 0 ? "가장 짧게" : i === ITEMS.length - 1 ? "가장 길게" : "";
      el.append(idx, label);
      slots.appendChild(el);
      return { el, label };
    });

    const pool = document.createElement("div");
    pool.className = "ti-shelf-pool";
    pool.dataset.testid = "ti-shelf-pool";

    const state = document.createElement("p");
    state.className = "ti-shelf-state";
    state.dataset.testid = "ti-shelf-state";
    state.textContent = "";

    const done = document.createElement("div");
    done.className = "ti-shelf-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "정확해요! 문이 열렸어요.";
    done.hidden = true;

    function renderSlots(): void {
      slotEls.forEach(({ el, label }, i) => {
        const id = placed[i];
        const item = ITEMS.find((it) => it.id === id);
        el.classList.toggle("filled", Boolean(item));
        label.textContent = item ? item.name : i === 0 ? "가장 짧게" : i === ITEMS.length - 1 ? "가장 길게" : "";
      });
    }
    function renderPool(): void {
      pool.innerHTML = "";
      const remaining = DISPLAY_ORDER.filter((it) => !placed.includes(it.id));
      for (const item of remaining) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ti-shelf-card";
        btn.dataset.testid = `ti-shelf-card-${item.id}`;
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
    undoBtn.className = "ti-shelf-undo-btn";
    undoBtn.dataset.testid = "ti-shelf-undo";
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
