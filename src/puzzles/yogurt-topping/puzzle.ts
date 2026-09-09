/** 식사 퍼즐 P4: 주문 카드에 맞는 요거트 토핑 양을 고른다. */
import "./puzzle.css";
import type { PuzzleApi, PuzzleManifest, PuzzleModule } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { TOPPING_CHOICES, type ToppingChoice, isCorrect } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

const LABELS: Record<ToppingChoice, { amount: string; detail: string; dots: number }> = {
  none: { amount: "토핑 없음", detail: "요거트만 있어요", dots: 0 },
  "one-spoon": { amount: "한 숟가락", detail: "가운데에 가볍게", dots: 7 },
  covered: { amount: "가득 덮기", detail: "요거트가 안 보여요", dots: 18 },
};

export const yogurtTopping: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let selected: ToppingChoice | null = null;
    let solved = false;
    let saidLow = false;
    let saidHigh = false;

    api.root.classList.add("topping-root");
    const sign = document.createElement("p");
    sign.className = "topping-sign";
    sign.innerHTML = "주문 카드: <strong>토핑 한 숟가락</strong><br>주문과 같은 그릇을 골라요.";

    const choices = document.createElement("div");
    choices.className = "topping-choices";
    for (const choice of TOPPING_CHOICES) {
      const data = LABELS[choice];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "topping-choice";
      button.dataset.testid = `topping-choice-${choice}`;
      button.setAttribute("aria-pressed", "false");

      const bowl = document.createElement("span");
      bowl.className = `topping-bowl topping-bowl--${choice}`;
      bowl.setAttribute("aria-hidden", "true");
      for (let i = 0; i < data.dots; i += 1) {
        const dot = document.createElement("i");
        dot.style.setProperty("--dot-x", `${18 + ((i * 23) % 66)}%`);
        dot.style.setProperty("--dot-y", `${18 + ((i * 37) % 60)}%`);
        bowl.appendChild(dot);
      }

      const amount = document.createElement("strong");
      amount.textContent = data.amount;
      const detail = document.createElement("small");
      detail.textContent = data.detail;
      button.append(bowl, amount, detail);
      button.addEventListener("click", () => {
        if (solved) return;
        selected = choice;
        for (const candidate of choices.querySelectorAll<HTMLButtonElement>(".topping-choice")) {
          candidate.classList.toggle("selected", candidate === button);
          candidate.setAttribute("aria-pressed", String(candidate === button));
        }
      });
      choices.appendChild(button);
    }

    const state = document.createElement("p");
    state.className = "topping-state";
    state.dataset.testid = "topping-state";
    state.textContent = "그릇 하나를 골라보세요.";
    const done = document.createElement("div");
    done.className = "topping-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "주문 카드와 같아요!";
    done.hidden = true;

    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.className = "topping-confirm-btn";
    confirm.dataset.testid = "topping-confirm";
    confirm.textContent = "이 그릇으로 준비하기";
    confirm.addEventListener("click", () => {
      if (solved || selected === null) return;
      if (isCorrect(selected)) {
        solved = true;
        state.textContent = "토핑 한 숟가락, 주문과 같아요!";
        state.dataset.level = "good";
        done.hidden = false;
        api.solve();
        return;
      }
      const tooLittle = selected === "none";
      state.dataset.level = tooLittle ? "low" : "high";
      state.textContent = tooLittle ? "주문에는 토핑이 있어요." : "한 숟가락보다 많아요.";
      if (tooLittle && !saidLow) {
        saidLow = true;
        void api.say(manifest.narrative.extra!["toolow"]);
      } else if (!tooLittle && !saidHigh) {
        saidHigh = true;
        void api.say(manifest.narrative.extra!["toohigh"]);
      }
      api.fail();
    });

    api.actions.appendChild(confirm);
    api.root.append(sign, choices, state, done);
    return () => {};
  },
};
