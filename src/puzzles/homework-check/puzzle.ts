/** 시간 퍼즐 P2: 횟수 맞히기 대신 실제 제출 체크리스트를 완료한다. */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { CHECK_IDS, type CheckId, isComplete } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;
const ITEMS: Record<CheckId, { icon: string; label: string; detail: string }> = {
  name: { icon: "✍️", label: "이름 확인", detail: "이름 칸에 내 이름이 있어요." },
  blank: { icon: "🔎", label: "빠진 칸 확인", detail: "비어 있는 답 칸이 없어요." },
};

export const homeworkCheck: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    const checked = new Set<CheckId>();
    let solved = false;
    let saidIncomplete = false;
    api.root.classList.add("homework-root");
    const sign = document.createElement("p");
    sign.className = "homework-sign";
    sign.textContent = "숙제를 제출하기 전에 이름과 빠진 칸을 확인해요. 두 가지를 모두 확인했으면 제출해요.";
    const paper = document.createElement("div");
    paper.className = "homework-paper";
    paper.innerHTML = '<div class="homework-name">이름: 호진티</div><div class="homework-lines">① ✓　② ✓　③ ✓</div>';
    const list = document.createElement("div");
    list.className = "homework-list";
    for (const id of CHECK_IDS) {
      const item = ITEMS[id];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "homework-check-item";
      btn.dataset.testid = `homework-check-${id}`;
      btn.innerHTML = `<span aria-hidden="true">${item.icon}</span><strong>${item.label}</strong><small>${item.detail}</small>`;
      btn.addEventListener("click", () => {
        if (solved) return;
        checked.add(id);
        btn.classList.add("checked");
        btn.setAttribute("aria-pressed", "true");
        state.textContent = isComplete([...checked]) ? "두 가지를 모두 확인했어요!" : "한 가지를 더 확인해요.";
      });
      list.appendChild(btn);
    }
    const state = document.createElement("p");
    state.className = "homework-state";
    state.dataset.testid = "homework-state";
    state.textContent = "확인할 항목이 두 가지 있어요.";
    const done = document.createElement("div");
    done.className = "homework-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "이름도 있고 빠진 칸도 없어요!";
    done.hidden = true;
    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "homework-confirm-btn";
    confirmBtn.dataset.testid = "homework-confirm";
    confirmBtn.textContent = "제출하기";
    confirmBtn.addEventListener("click", () => {
      if (solved) return;
      if (!isComplete([...checked])) {
        state.textContent = "이름과 빠진 칸을 모두 확인해요.";
        if (!saidIncomplete) { saidIncomplete = true; void api.say(manifest.narrative.extra!["toolow"]); }
        api.fail();
        return;
      }
      solved = true;
      done.hidden = false;
      state.dataset.level = "good";
      api.solve();
    });
    api.actions.appendChild(confirmBtn);
    api.root.append(sign, paper, list, state, done);
    return () => {};
  },
};
