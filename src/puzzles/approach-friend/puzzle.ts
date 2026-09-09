/**
 * 사회성 퍼즐 P3: 다가가기 (SO-014). brushing-timer 계열 관찰형을 거리에 적용 —
 * 캐릭터가 옆쪽으로 다가가고, 친구가 고개를 들었을 때 [인사하기]를 누른다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { TICK_MS, GOOD_END, judgeAtStep } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;
const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag);
}

export const approachFriend: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;
    const maxStep = GOOD_END + 3;

    api.root.classList.add("approach-root");
    const sign = document.createElement("p");
    sign.className = "approach-sign";
    sign.textContent = "책 읽는 친구의 앞을 가리지 않게 옆쪽으로 다가가요. 친구가 고개를 들면 인사해요.";

    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 100 100");
    view.classList.add("approach-svg");
    view.dataset.testid = "approach-view";
    const friend = svgEl("circle");
    friend.setAttribute("cx", "85");
    friend.setAttribute("cy", "55");
    friend.setAttribute("r", "10");
    friend.classList.add("approach-friend-dot");
    const me = svgEl("circle");
    me.setAttribute("cy", "55");
    me.setAttribute("r", "10");
    me.classList.add("approach-me");
    view.append(friend, me);

    function drawMe(): void {
      const frac = Math.min(step, maxStep) / maxStep;
      const x = 10 + frac * 65;
      me.setAttribute("cx", String(x));
    }
    drawMe();

    const timer = setInterval(() => {
      if (solved) return;
      step += 1;
      drawMe();
    }, TICK_MS);

    const state = document.createElement("p");
    state.className = "approach-state";
    state.dataset.testid = "approach-state";
    state.textContent = "";
    const done = document.createElement("div");
    done.className = "approach-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "친구가 책에서 눈을 들고 나를 봐요!";
    done.hidden = true;

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "approach-confirm-btn";
    confirmBtn.dataset.testid = "approach-confirm";
    confirmBtn.textContent = "인사하기";
    confirmBtn.addEventListener("click", () => {
      if (solved) return;
      const j = judgeAtStep(step);
      if (j === "good") {
        solved = true;
        clearInterval(timer);
        done.hidden = false;
        state.textContent = "친구가 책에서 눈을 들고 나를 봐요!";
        state.dataset.level = "good";
        api.solve();
      } else if (j === "high") {
        state.dataset.level = "high";
        if (!saidToohigh) {
          saidToohigh = true;
          void api.say(manifest.narrative.extra!["toohigh"]);
        }
        api.fail();
      } else {
        state.dataset.level = "low";
        if (!saidToolow) {
          saidToolow = true;
          void api.say(manifest.narrative.extra!["toolow"]);
        }
        api.fail();
        // 너무 가까워진 뒤엔 저절로 되돌아오지 않으니 처음부터 다시 다가가게 한다.
        step = 0;
        drawMe();
      }
    });
    api.actions.appendChild(confirmBtn);
    api.root.append(sign, view, state, done);
    return () => clearInterval(timer);
  },
};
