import { test, expect } from "@playwright/test";
import { enterHygieneRoom, openStation, dismissDialogues, goDoor } from "./helpers";
import {
  GOOD_MIN as TOOTH_GOOD_MIN,
  GOOD_MAX as TOOTH_GOOD_MAX,
  SOLVE_STEP as TOOTH_SOLVE_STEP,
  stepToValue as toothStepToValue,
  judge as toothJudge,
} from "../../src/puzzles/toothpaste-squeeze/autoplay";
import {
  GOOD_MIN as SANI_GOOD_MIN,
  GOOD_MAX as SANI_GOOD_MAX,
  SOLVE_COUNT as SANI_SOLVE_COUNT,
  judge as saniJudge,
} from "../../src/puzzles/hand-sanitizer-pump/autoplay";
import {
  GOOD_START,
  GOOD_END,
  TICK_MS,
  SOLVE_STEP as BRUSH_SOLVE_STEP,
  judgeAtStep,
} from "../../src/puzzles/brushing-timer/autoplay";
import {
  GOOD_MIN as PAPER_GOOD_MIN,
  GOOD_MAX as PAPER_GOOD_MAX,
  SOLVE_STEP as PAPER_SOLVE_STEP,
  stepToValue as paperStepToValue,
  judge as paperJudge,
} from "../../src/puzzles/toilet-paper-pull/autoplay";
import { RECAP_IDS, isRecapComplete } from "../../src/puzzles/soap-shelf-order/autoplay";

/**
 * 「깨끗한 방」 — 순수 함수 검산(정답 상수는 각 autoplay.ts에서만 가져온다) +
 * 방 전체를 실제로 걸어서 완주하는 e2e. 최종 복습 보드(soap-shelf-order)는
 * 네 활동을 어떤 순서로 확인해도 완료되는지 검산한다.
 */

test.describe("정답 상수 검산 — 각 puzzle의 autoplay.ts", () => {
  test("toothpaste-squeeze: HY-001 구간(28~45)과 스텝 단위가 일치한다", () => {
    expect(TOOTH_GOOD_MIN).toBe(28);
    expect(TOOTH_GOOD_MAX).toBe(45);
    expect(toothJudge(toothStepToValue(TOOTH_SOLVE_STEP))).toBe("good");
    expect(toothJudge(toothStepToValue(0))).toBe("low");
    expect(toothJudge(toothStepToValue(12))).toBe("high");
  });

  test("hand-sanitizer-pump: HY-004 구간(1~2회)과 일치한다", () => {
    expect(SANI_GOOD_MIN).toBe(1);
    expect(SANI_GOOD_MAX).toBe(2);
    expect(saniJudge(SANI_SOLVE_COUNT)).toBe("good");
    expect(saniJudge(0)).toBe("low");
    expect(saniJudge(4)).toBe("high");
  });

  test("brushing-timer: 네 부위를 다 보기 전엔 low, 그 뒤엔 good, 한 바퀴 더 돌면 high", () => {
    expect(judgeAtStep(0)).toBe("low");
    expect(judgeAtStep(GOOD_START - 1)).toBe("low");
    expect(judgeAtStep(GOOD_START)).toBe("good");
    expect(judgeAtStep(GOOD_END)).toBe("good");
    expect(judgeAtStep(GOOD_END + 1)).toBe("high");
    expect(judgeAtStep(BRUSH_SOLVE_STEP)).toBe("good");
  });

  test("toilet-paper-pull: HY-005 구간(30~55)과 일치한다", () => {
    expect(PAPER_GOOD_MIN).toBe(30);
    expect(PAPER_GOOD_MAX).toBe(55);
    expect(paperJudge(paperStepToValue(PAPER_SOLVE_STEP))).toBe("good");
    expect(paperJudge(paperStepToValue(0))).toBe("low");
    expect(paperJudge(paperStepToValue(8))).toBe("high");
  });

  test("soap-shelf-order: 네 활동을 어떤 순서로 확인해도 완료된다", () => {
    expect(RECAP_IDS).toHaveLength(4);
    expect(isRecapComplete(RECAP_IDS)).toBe(true);
    expect(isRecapComplete([...RECAP_IDS].reverse())).toBe(true);
    expect(isRecapComplete(RECAP_IDS.slice(0, 3))).toBe(false);
  });
});

test("「깨끗한 방」 완주 — 청소 4개를 풀고 복습 카드를 확인하면 문이 열린다", async ({ page }) => {
  test.setTimeout(240_000);
  const isMobile = test.info().project.name === "mobile";
  await enterHygieneRoom(page);

  // P1 치약 짜기 — 정답 스텝만큼 짜고 확정
  await openStation(page, isMobile, 4, 3, "puzzle-tooth");
  for (let i = 0; i < TOOTH_SOLVE_STEP; i++) await page.getByTestId("tooth-squeeze").click();
  await page.getByTestId("tooth-confirm").click();
  await expect(page.getByTestId("tooth-done")).toBeVisible();
  await dismissDialogues(page); // #hy-tooth-clear
  await expect(page.getByTestId("puzzle-tooth")).toBeHidden();

  // P2 손 소독제 펌프
  await openStation(page, isMobile, 11, 3, "puzzle-sani");
  for (let i = 0; i < SANI_SOLVE_COUNT; i++) await page.getByTestId("sani-pump").click();
  await page.getByTestId("sani-confirm").click();
  await expect(page.getByTestId("sani-done")).toBeVisible();
  await dismissDialogues(page); // #hy-sani-clear
  await expect(page.getByTestId("puzzle-sani")).toBeHidden();

  // P3 양치 시간 — 네 부위를 다 볼 때까지 기다렸다가 '지금!'
  await openStation(page, isMobile, 4, 6.5, "puzzle-brush");
  await page.waitForTimeout(TICK_MS * BRUSH_SOLVE_STEP + 200);
  await page.getByTestId("brush-confirm").click();
  await expect(page.getByTestId("brush-done")).toBeVisible();
  await dismissDialogues(page); // #hy-brush-clear
  await expect(page.getByTestId("puzzle-brush")).toBeHidden();

  // P4 화장실 휴지
  await openStation(page, isMobile, 11, 6.5, "puzzle-paper");
  for (let i = 0; i < PAPER_SOLVE_STEP; i++) await page.getByTestId("paper-pull").click();
  await page.getByTestId("paper-confirm").click();
  await expect(page.getByTestId("paper-done")).toBeVisible();
  await dismissDialogues(page); // #hy-paper-clear
  await expect(page.getByTestId("puzzle-paper")).toBeHidden();

  // 네 개를 다 풀었으니 정리대 봉인이 걷힌다 — 페이드가 끝날 때까지 기다린다
  await expect
    .poll(
      () =>
        page.evaluate(
          () => (window as never as { __qe: { seals: Record<string, number> } }).__qe.seals["shelf-corner"],
        ),
      { timeout: 12_000 },
    )
    .toBe(0);

  // 최종 복습 보드 — 순서 없이 네 활동을 모두 확인한다
  await openStation(page, isMobile, 9, 11.5, "puzzle-shelf");
  for (const id of [...RECAP_IDS].reverse()) {
    await page.getByTestId(`shelf-card-${id}`).click();
  }
  await expect(page.getByTestId("shelf-done")).toBeVisible();
  await dismissDialogues(page); // #hy-shelf-clear
  await expect(page.getByTestId("puzzle-shelf")).toBeHidden();

  // 문이 열렸다 — 걸어가서 통과하면 다음 방(food-room)으로 이어진다
  await expect
    .poll(() =>
      page.evaluate(() => (window as never as { __qe: { events: string[] } }).__qe.events),
    )
    .toContain("door:hygiene-open");

  await goDoor(page, isMobile, 7, 1, "food-room");
});
