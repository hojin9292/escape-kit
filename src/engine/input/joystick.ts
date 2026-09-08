/**
 * 모바일 가상 조이스틱 + 살펴보기(상호작용) 버튼.
 * Pointer Events 통일 계층(onDrag) 위에서 동작 — 터치/마우스 공용.
 * 표시 여부는 엔진이 결정 (pointer: coarse 감지).
 */
import { onDrag } from "./pointer";

const KNOB_RADIUS = 40; // 노브 최대 이동 반경(px)

export class VirtualJoystick {
  private dir: [number, number] = [0, 0];
  private root: HTMLElement;
  private act: HTMLButtonElement;
  private detach: (() => void)[] = [];

  constructor(host: HTMLElement, onInteract: () => void) {
    this.root = document.createElement("div");
    this.root.className = "joystick-layer";
    this.root.dataset.testid = "joystick-layer";

    const base = document.createElement("div");
    base.className = "joystick-base";
    const knob = document.createElement("div");
    knob.className = "joystick-knob";
    base.appendChild(knob);

    const act = document.createElement("button");
    this.act = act;
    act.className = "act-button";
    act.dataset.testid = "act-button";
    act.textContent = "살펴보기";
    act.setAttribute("aria-label", "가까운 물건 살펴보기");

    this.root.append(base, act);
    host.appendChild(this.root);

    this.detach.push(
      onDrag(base, {
        onMove: (s) => {
          const len = Math.hypot(s.dx, s.dy);
          const clamped = Math.min(len, KNOB_RADIUS);
          const nx = len > 0 ? s.dx / len : 0;
          const ny = len > 0 ? s.dy / len : 0;
          knob.style.transform = `translate(${nx * clamped}px, ${ny * clamped}px)`;
          // 데드존 20% — 미세 떨림 무시
          this.dir = clamped > KNOB_RADIUS * 0.2 ? [nx, ny] : [0, 0];
        },
        onEnd: () => {
          knob.style.transform = "";
          this.dir = [0, 0];
        },
      })
    );

    act.addEventListener("click", onInteract);
    const reset = () => {
      this.dir = [0, 0];
      knob.style.transform = "";
    };
    const onVisibility = () => { if (document.hidden) reset(); };
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", onVisibility);
    base.addEventListener("lostpointercapture", reset);
    this.detach.push(() => {
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", onVisibility);
      base.removeEventListener("lostpointercapture", reset);
      act.removeEventListener("click", onInteract);
    });
  }

  /** 도달 가능한 대상이 있을 때만 상호작용을 켠다. */
  setTarget(name: string | null, blocked: boolean): void {
    const ready = !!name && !blocked;
    if (this.act.disabled !== !ready) this.act.disabled = !ready;
    const label = ready ? `${name} 살펴보기` : "물건 가까이 이동해요";
    if (this.act.getAttribute("aria-label") !== label) {
      this.act.setAttribute("aria-label", label);
      this.act.title = label;
      this.act.textContent = ready ? "살펴보기" : "가까이 가요";
    }
    if (blocked) this.dir = [0, 0];
  }

  /** 현재 화면 기준 방향 (정규화) */
  direction(): [number, number] {
    return this.dir;
  }

  destroy(): void {
    this.detach.forEach((d) => d());
    this.root.remove();
  }
}

/** 터치 우선 환경인가 (가상 조이스틱 표시 기준) */
export function isTouchDevice(): boolean {
  return window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
}
