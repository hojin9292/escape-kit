import "./recap-board.css";
import type { PuzzleApi } from "../../engine/puzzle-host/types";
import { isRecapComplete } from "./recap";

export interface RecapCard {
  id: string;
  icon: string;
  name: string;
  recap: string;
}

export interface RecapBoardConfig {
  className: string;
  testIdPrefix: string;
  solveTestId: string;
  cards: readonly RecapCard[];
  doneText: string;
}

export function mountRecapBoard(api: PuzzleApi, config: RecapBoardConfig): () => void {
  const selected = new Set<string>();
  let solved = false;

  api.root.classList.add("recap-root", config.className);

  const sign = document.createElement("p");
  sign.className = "recap-sign";
  sign.textContent =
    "앞에서 연습한 네 가지예요. 기억나는 것부터 하나씩 눌러 복습 도장을 모아요. 순서는 상관없어요.";

  const progress = document.createElement("p");
  progress.className = "recap-progress";
  progress.setAttribute("aria-live", "polite");

  const board = document.createElement("div");
  board.className = "recap-board";

  const done = document.createElement("div");
  done.className = "recap-done";
  done.dataset.testid = config.solveTestId;
  done.textContent = config.doneText;
  done.hidden = true;

  function syncProgress(): void {
    progress.textContent = `복습 도장 ${selected.size} / ${config.cards.length}`;
  }

  for (const card of config.cards) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "recap-card";
    button.dataset.testid = `${config.testIdPrefix}-card-${card.id}`;
    button.innerHTML = `
      <span class="recap-card-icon" aria-hidden="true">${card.icon}</span>
      <span class="recap-card-copy">
        <strong>${card.name}</strong>
        <small>${card.recap}</small>
      </span>
      <span class="recap-stamp" aria-hidden="true">○</span>
    `;
    button.addEventListener("click", () => {
      if (solved || selected.has(card.id)) return;
      selected.add(card.id);
      button.classList.add("checked");
      button.setAttribute("aria-pressed", "true");
      const stamp = button.querySelector<HTMLElement>(".recap-stamp");
      if (stamp) stamp.textContent = "✓";
      syncProgress();
      if (isRecapComplete([...selected], config.cards.map((item) => item.id))) {
        solved = true;
        done.hidden = false;
        api.solve();
      }
    });
    button.setAttribute("aria-pressed", "false");
    board.appendChild(button);
  }

  syncProgress();
  api.root.append(sign, progress, board, done);
  return () => {};
}
