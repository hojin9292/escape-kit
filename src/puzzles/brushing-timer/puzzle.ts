/**
 * 청소 퍼즐 P3: 양치 시간 (HY-009).
 *
 * 조작: 화면의 4부위가 순서대로 밝아지는 것을 지켜보다, 네 부위가 다 밝아졌다
 * 싶으면 [지금!]을 누른다. 반응속도가 아니라 "네 부위를 다 봤는가"만 판정한다
 * (autoplay.ts의 judgeAtStep — 순수 함수, 타이밍 압박 없음).
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { ZONE_NAMES, TICK_MS, zoneAtStep, judgeAtStep } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;

export const brushingTimer: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("brush-root");

    const sign = document.createElement("p");
    sign.className = "brush-sign";
    sign.textContent = "앞니·양쪽 어금니·안쪽 표시가 모두 켜지는지 보고 [골고루 닦았어요]를 눌러요.";

    const zoneRow = document.createElement("div");
    zoneRow.className = "brush-zone-row";
    zoneRow.dataset.testid = "brush-zones";
    zoneRow.dataset.step = "0";

    const zoneEls = ZONE_NAMES.map((name, i) => {
      const el = document.createElement("div");
      el.className = "brush-zone";
      el.dataset.testid = `brush-zone-${i}`;
      el.textContent = name;
      zoneRow.appendChild(el);
      return el;
    });

    const state = document.createElement("p");
    state.className = "brush-state";
    state.dataset.testid = "brush-state";
    state.textContent = "지켜보는 중…";

    const done = document.createElement("div");
    done.className = "brush-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "네 군데를 한 번씩 닦았어요!";
    done.hidden = true;

    function highlight(): void {
      const active = zoneAtStep(step);
      zoneEls.forEach((el, i) => el.classList.toggle("on", i === active));
      zoneRow.dataset.step = String(step);
    }

    const timer = setInterval(() => {
      if (solved) return;
      step += 1;
      highlight();
    }, TICK_MS);
    highlight();

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "brush-confirm-btn";
    confirmBtn.dataset.testid = "brush-confirm";
    confirmBtn.textContent = "골고루 닦았어요";
    confirmBtn.addEventListener("click", () => {
      if (solved) return;
      const j = judgeAtStep(step);
      if (j === "good") {
        solved = true;
        clearInterval(timer);
        done.hidden = false;
        state.textContent = "네 군데를 한 번씩 닦았어요!";
        state.dataset.level = "good";
        api.solve();
      } else if (j === "low") {
        state.dataset.level = "low";
        if (!saidToolow) {
          saidToolow = true;
          void api.say(manifest.narrative.extra!["toolow"]);
        }
        api.fail();
      } else {
        state.dataset.level = "high";
        if (!saidToohigh) {
          saidToohigh = true;
          void api.say(manifest.narrative.extra!["toohigh"]);
        }
        api.fail();
        // 이미 다 닦인 뒤엔 저절로 되돌아오지 않으니 처음부터 다시 지켜보게 한다.
        step = 0;
        highlight();
      }
    });

    api.actions.appendChild(confirmBtn);
    api.root.append(sign, zoneRow, state, done);

    return () => clearInterval(timer);
  },
};
