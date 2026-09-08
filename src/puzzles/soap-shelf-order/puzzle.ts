/**
 * 최종 콘솔: 정리대 서열 퍼즐 (soap-shelf-order).
 *
 * 방탈출 잠금 3단계 중 ③ — 키패드가 아니라 **서열 퍼즐 자체가 열쇠**다(gate 없음).
 * 정답을 맞히면 이 퍼즐의 reward.event(door:hygiene-open)가 곧바로 출구를 연다.
 *
 * 조작: 물건 카드를 탭해 선반 슬롯에 순서대로 놓는다(적은 것 → 많은 것).
 * 되돌리기 1단계 지원. 다 놓으면 즉시 채점 — 틀리면 방향 힌트 후 선반을 비우고 재시도.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { ITEMS, judgeOrder } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

/** 진열 순서(표시용) — 정답의 역순으로 고정한다. 이미 정렬된 채로 보여주면
 *  아무 생각 없이 그대로 옮겨도 통과해버린다(런타임 셔플은 규약상 금지). */
const DISPLAY_ORDER = [...ITEMS].reverse();

export const soapShelfOrder: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let placed: string[] = [];
    let solved = false;

    api.root.classList.add("shelf-root");

    const sign = document.createElement("p");
    sign.className = "shelf-sign";
    sign.textContent = "적게 쓰는 것부터 많이 쓰는 순서로 눌러서 선반에 올려봐요.";

    const slots = document.createElement("div");
    slots.className = "shelf-slots";
    slots.dataset.testid = "shelf-slots";

    const slotEls = ITEMS.map((_, i) => {
      const el = document.createElement("div");
      el.className = "shelf-slot";
      el.dataset.testid = `shelf-slot-${i}`;
      const idx = document.createElement("span");
      idx.className = "shelf-slot-index";
      idx.textContent = String(i + 1);
      const label = document.createElement("span");
      label.className = "shelf-slot-label";
      label.textContent = i === 0 ? "가장 적게" : i === ITEMS.length - 1 ? "가장 많이" : "";
      el.append(idx, label);
      slots.appendChild(el);
      return { el, label };
    });

    const pool = document.createElement("div");
    pool.className = "shelf-pool";
    pool.dataset.testid = "shelf-pool";

    const state = document.createElement("p");
    state.className = "shelf-state";
    state.dataset.testid = "shelf-state";
    state.textContent = "";

    const done = document.createElement("div");
    done.className = "shelf-done";
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
        btn.className = "shelf-card";
        btn.dataset.testid = `shelf-card-${item.id}`;
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
    undoBtn.className = "shelf-undo-btn";
    undoBtn.dataset.testid = "shelf-undo";
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
