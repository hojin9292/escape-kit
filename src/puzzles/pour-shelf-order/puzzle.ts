/**
 * 최종 콘솔: 식탁 정리대 서열 퍼즐 (pour-shelf-order). soap-shelf-order와 같은 구조.
 *
 * 조작: 용기 카드를 탭해 선반 슬롯에 순서대로 놓는다(적은 것 → 많은 것).
 * 되돌리기 1단계 지원. 다 놓으면 즉시 채점 — 틀리면 방향 힌트 후 선반을 비우고 재시도.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { ITEMS, judgeOrder } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

/** 진열 순서(표시용) — 정답의 역순으로 고정한다(런타임 셔플은 규약상 금지). */
const DISPLAY_ORDER = [...ITEMS].reverse();

export const pourShelfOrder: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let placed: string[] = [];
    let solved = false;

    api.root.classList.add("fo-shelf-root");

    const sign = document.createElement("p");
    sign.className = "fo-shelf-sign";
    sign.textContent = "적게 따르는 것부터 많이 따르는 순서로 눌러서 선반에 올려봐요.";

    const slots = document.createElement("div");
    slots.className = "fo-shelf-slots";
    slots.dataset.testid = "fo-shelf-slots";

    const slotEls = ITEMS.map((_, i) => {
      const el = document.createElement("div");
      el.className = "fo-shelf-slot";
      el.dataset.testid = `fo-shelf-slot-${i}`;
      const idx = document.createElement("span");
      idx.className = "fo-shelf-slot-index";
      idx.textContent = String(i + 1);
      const label = document.createElement("span");
      label.className = "fo-shelf-slot-label";
      label.textContent = i === 0 ? "가장 적게" : i === ITEMS.length - 1 ? "가장 많이" : "";
      el.append(idx, label);
      slots.appendChild(el);
      return { el, label };
    });

    const pool = document.createElement("div");
    pool.className = "fo-shelf-pool";
    pool.dataset.testid = "fo-shelf-pool";

    const state = document.createElement("p");
    state.className = "fo-shelf-state";
    state.dataset.testid = "fo-shelf-state";
    state.textContent = "";

    const done = document.createElement("div");
    done.className = "fo-shelf-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "정확해요! 문이 열렸어요.";
    done.hidden = true;

    function renderSlots(): void {
      slotEls.forEach(({ el, label }, i) => {
        const id = placed[i];
        const item = ITEMS.find((it) => it.id === id);
        el.classList.toggle("filled", Boolean(item));
        label.textContent = item ? item.name : i === 0 ? "가장 적게" : i === ITEMS.length - 1 ? "가장 많이" : "";
      });
    }

    function renderPool(): void {
      pool.innerHTML = "";
      const remaining = DISPLAY_ORDER.filter((it) => !placed.includes(it.id));
      for (const item of remaining) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fo-shelf-card";
        btn.dataset.testid = `fo-shelf-card-${item.id}`;
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
    undoBtn.className = "fo-shelf-undo-btn";
    undoBtn.dataset.testid = "fo-shelf-undo";
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
