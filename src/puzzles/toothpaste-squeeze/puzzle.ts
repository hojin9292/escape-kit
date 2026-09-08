/**
 * 청소 퍼즐 P1: 치약 짜기 — 완두콩 한 알만큼 (HY-001).
 *
 * 조작: [짜기]/[줄이기] 탭으로 이산 스텝을 오르내리고, [됐어요]로 확정한다.
 * 드래그·슬라이더 없음(모터-세이프 원칙) — 자세는 autoplay.ts의 stepToValue/judge가
 * 전부 순수 함수로 결정한다.
 */
import "./puzzle.css";
import type { PuzzleApi, PuzzleModule, PuzzleManifest } from "../../engine/puzzle-host/types";
import manifestJson from "./manifest.json";
import { MAX_STEPS, stepToValue, judge } from "./autoplay";

const manifest = manifestJson as PuzzleManifest;
const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag);
}

export const toothpasteSqueeze: PuzzleModule = {
  manifest,
  mount(api: PuzzleApi): () => void {
    let step = 0;
    let solved = false;
    let saidToolow = false;
    let saidToohigh = false;

    api.root.classList.add("tooth-root");

    const sign = document.createElement("p");
    sign.className = "tooth-sign";
    sign.textContent = "칫솔 위에 치약을 짜 보세요 — 완두콩 한 알만큼이면 딱 좋아요.";

    // ── 그림: 칫솔 위 치약 덩어리 ────────────────────────
    const view = svgEl("svg");
    view.setAttribute("viewBox", "0 0 320 160");
    view.classList.add("tooth-svg");
    view.dataset.testid = "tooth-view";

    const handle = svgEl("path");
    handle.setAttribute(
      "d",
      "M88 91 H270 C287 91 299 102 299 116 C299 130 287 141 270 141 H101 C88 141 78 131 78 118 V105 C78 98 82 93 88 91 Z",
    );
    handle.classList.add("tooth-handle");

    const brush = svgEl("rect");
    brush.setAttribute("x", "20");
    brush.setAttribute("y", "96");
    brush.setAttribute("width", "92");
    brush.setAttribute("height", "39");
    brush.setAttribute("rx", "18");
    brush.classList.add("tooth-brush");

    const bristles = svgEl("g");
    bristles.classList.add("tooth-bristles");
    for (let i = 0; i < 5; i += 1) {
      const bristle = svgEl("rect");
      bristle.setAttribute("x", String(31 + i * 15));
      bristle.setAttribute("y", String(75 + (i % 2) * 3));
      bristle.setAttribute("width", "11");
      bristle.setAttribute("height", String(29 - (i % 2) * 3));
      bristle.setAttribute("rx", "4");
      bristles.appendChild(bristle);
    }

    const blob = svgEl("ellipse");
    blob.classList.add("tooth-blob");
    blob.setAttribute("cy", "78");

    view.append(handle, brush, bristles, blob);

    function drawBlob(): void {
      const value = stepToValue(step);
      const w = 2 + (value / 100) * 52;
      const h = value <= 0 ? 0 : 3 + (value / 100) * 18;
      blob.setAttribute("rx", String(w / 2));
      blob.setAttribute("ry", String(h));
      // 치약은 칫솔모 중앙(66, 78)을 기준으로만 자란다.
      blob.setAttribute("cx", "66");
      blob.setAttribute("cy", String(77 - h / 2));
      blob.style.opacity = value <= 0 ? "0" : "1";
    }

    // ── 상태 문구 ────────────────────────────────────────
    const state = document.createElement("p");
    state.className = "tooth-state";
    state.dataset.testid = "tooth-state";
    state.textContent = "아직 짜지 않았어요.";

    const done = document.createElement("div");
    done.className = "tooth-done";
    done.dataset.testid = manifest.testIds["solveCheck"];
    done.textContent = "완두콩 한 알만큼 짰어요!";
    done.hidden = true;

    function sync(): void {
      drawBlob();
      const value = stepToValue(step);
      if (value <= 0) {
        state.textContent = "아직 짜지 않았어요.";
        delete state.dataset.level;
        return;
      }
      const j = judge(value);
      if (j === "low") {
        state.textContent = "조금 더 짜도 괜찮아요.";
        state.dataset.level = "low";
      } else if (j === "high") {
        state.textContent = "조금 많아요. 줄여볼까요?";
        state.dataset.level = "high";
      } else {
        state.textContent = "딱 좋은 크기예요!";
        state.dataset.level = "good";
      }
    }

    // ── 버튼 ────────────────────────────────────────────
    const squeezeBtn = document.createElement("button");
    squeezeBtn.type = "button";
    squeezeBtn.className = "tooth-btn tooth-btn-squeeze";
    squeezeBtn.dataset.testid = "tooth-squeeze";
    squeezeBtn.textContent = "짜기";
    squeezeBtn.addEventListener("click", () => {
      if (solved) return;
      if (step >= MAX_STEPS) return;
      step += 1;
      sync();
    });

    const lessBtn = document.createElement("button");
    lessBtn.type = "button";
    lessBtn.className = "tooth-btn tooth-btn-less";
    lessBtn.dataset.testid = "tooth-less";
    lessBtn.textContent = "줄이기";
    lessBtn.addEventListener("click", () => {
      if (solved) return;
      if (step <= 0) return;
      step -= 1;
      sync();
    });

    const buttonRow = document.createElement("div");
    buttonRow.className = "tooth-button-row";
    buttonRow.append(lessBtn, squeezeBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "tooth-confirm-btn";
    confirmBtn.dataset.testid = "tooth-confirm";
    confirmBtn.textContent = "됐어요";
    confirmBtn.addEventListener("click", () => {
      if (solved || step <= 0) return;
      const value = stepToValue(step);
      const j = judge(value);
      if (j === "good") {
        solved = true;
        done.hidden = false;
        state.textContent = "딱 좋은 크기예요!";
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
      }
    });

    api.actions.appendChild(confirmBtn);
    sync();
    api.root.append(sign, view, buttonRow, state, done);

    return () => {
      // 버튼은 root와 함께 정리된다. actions는 호스트가 오버레이 제거 시 함께 비운다.
    };
  },
};
