import { test, expect } from "@playwright/test";
import { enterFoodRoom, openStation, dismissDialogues } from "./helpers";
import {
  GOOD_MIN as WATER_GOOD_MIN,
  GOOD_MAX as WATER_GOOD_MAX,
  SOLVE_STEP as WATER_SOLVE_STEP,
  stepToValue as waterStepToValue,
  judge as waterJudge,
} from "../../src/puzzles/water-pour/autoplay";
import {
  GOOD_MIN as ICE_GOOD_MIN,
  GOOD_MAX as ICE_GOOD_MAX,
  SOLVE_COUNT as ICE_SOLVE_COUNT,
  judge as iceJudge,
} from "../../src/puzzles/ice-drop/autoplay";
import {
  GOOD_MIN as JAM_GOOD_MIN,
  GOOD_MAX as JAM_GOOD_MAX,
  SOLVE_CELLS as JAM_SOLVE_CELLS,
  cellsToPercent,
  judge as jamJudge,
} from "../../src/puzzles/jam-spread/autoplay";
import { TICK_MS, SOLVE_STEP as TOPPING_SOLVE_STEP, judgeAtStep } from "../../src/puzzles/yogurt-topping/autoplay";
import { ITEMS, CORRECT_ORDER, isUniqueSolution, judgeOrder } from "../../src/puzzles/pour-shelf-order/autoplay";

/**
 * 「먹고 마시는 방」 — 순수 함수 검산 + 방 전체를 실제로 걸어서 완주하는 e2e.
 * 앞 방(hygiene-room)은 이미 hygiene-room.spec.ts가 검증하므로, 여기서는
 * `__qe.warp`로 그 사슬을 건너뛰고 food-room부터 시작한다.
 */

test.describe("정답 상수 검산 — 각 puzzle의 autoplay.ts", () => {
  test("water-pour: FO-001 구간(55~78)과 일치한다", () => {
    expect(WATER_GOOD_MIN).toBe(55);
    expect(WATER_GOOD_MAX).toBe(78);
    expect(waterJudge(waterStepToValue(WATER_SOLVE_STEP))).toBe("good");
    expect(waterJudge(waterStepToValue(0))).toBe("low");
    expect(waterJudge(waterStepToValue(12))).toBe("high");
  });

  test("ice-drop: FO-008 구간(2~5개)과 일치한다", () => {
    expect(ICE_GOOD_MIN).toBe(2);
    expect(ICE_GOOD_MAX).toBe(5);
    expect(iceJudge(ICE_SOLVE_COUNT)).toBe("good");
    expect(iceJudge(0)).toBe("low");
    expect(iceJudge(7)).toBe("high");
  });

  test("jam-spread: FO-005 넓이 구간(45~72%)과 격자 칸 수가 일치한다", () => {
    expect(JAM_GOOD_MIN).toBe(45);
    expect(JAM_GOOD_MAX).toBe(72);
    expect(jamJudge(cellsToPercent(JAM_SOLVE_CELLS))).toBe("good");
    expect(jamJudge(cellsToPercent(0))).toBe("low");
    expect(jamJudge(cellsToPercent(24))).toBe("high");
  });

  test("yogurt-topping: 하나도 안 올리면 low, 부분적으로 덮이면 good, 다 덮이면 high", () => {
    expect(judgeAtStep(0)).toBe("low");
    expect(judgeAtStep(TOPPING_SOLVE_STEP)).toBe("good");
    expect(judgeAtStep(3)).toBe("good");
    expect(judgeAtStep(4)).toBe("high");
  });

  test("pour-shelf-order: 네 용기의 중앙값이 전부 달라 정답 순열이 유일하다", () => {
    expect(isUniqueSolution()).toBe(true);
    expect(ITEMS.length).toBe(4);
    expect(CORRECT_ORDER).toEqual(["juice-cup", "cereal-milk", "water-cup", "water-bottle"]);
    expect(judgeOrder(CORRECT_ORDER)).toBe(true);
    expect(judgeOrder([...CORRECT_ORDER].reverse())).toBe(false);
    const permute = (arr: string[]): string[][] =>
      arr.length <= 1
        ? [arr]
        : arr.flatMap((x, i) => permute([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p]));
    const all = permute(ITEMS.map((it) => it.id));
    expect(all.length).toBe(24);
    expect(all.filter((p) => judgeOrder(p)).length).toBe(1);
  });
});

test("「먹고 마시는 방」 완주 — 식사 준비 4개를 풀면 정리대가 열리고, 서열을 맞히면 문이 열린다", async ({
  page,
}) => {
  test.setTimeout(240_000);
  const isMobile = test.info().project.name === "mobile";
  await enterFoodRoom(page, isMobile ? "f" : "m");

  // P1 물 따르기
  await openStation(page, isMobile, 4, 3, "puzzle-water");
  for (let i = 0; i < WATER_SOLVE_STEP; i++) await page.getByTestId("water-pour-btn").click();
  await page.getByTestId("water-confirm").click();
  await expect(page.getByTestId("water-done")).toBeVisible();
  await dismissDialogues(page); // #fo-water-clear
  await expect(page.getByTestId("puzzle-water")).toBeHidden();

  // P2 얼음 넣기
  await openStation(page, isMobile, 11, 3, "puzzle-ice");
  for (let i = 0; i < ICE_SOLVE_COUNT; i++) await page.getByTestId("ice-drop-btn").click();
  await page.getByTestId("ice-confirm").click();
  await expect(page.getByTestId("ice-done")).toBeVisible();
  await dismissDialogues(page); // #fo-ice-clear
  await expect(page.getByTestId("puzzle-ice")).toBeHidden();

  // P3 잼 바르기 — 격자 칸을 정답 개수만큼 채운다
  await openStation(page, isMobile, 4, 6.5, "puzzle-jam");
  for (let i = 0; i < JAM_SOLVE_CELLS; i++) await page.getByTestId(`jam-cell-${i}`).click();
  await page.getByTestId("jam-confirm").click();
  await expect(page.getByTestId("jam-done")).toBeVisible();
  await dismissDialogues(page); // #fo-jam-clear
  await expect(page.getByTestId("puzzle-jam")).toBeHidden();

  // P4 요거트 토핑 — 흰 부분이 아직 보이는 동안 그만!
  await openStation(page, isMobile, 11, 6.5, "puzzle-topping");
  await page.waitForTimeout(TICK_MS * TOPPING_SOLVE_STEP + 200);
  await page.getByTestId("topping-confirm").click();
  await expect(page.getByTestId("topping-done")).toBeVisible();
  await dismissDialogues(page); // #fo-topping-clear
  await expect(page.getByTestId("puzzle-topping")).toBeHidden();

  // 네 개를 다 풀었으니 정리대 봉인이 걷힌다
  await expect
    .poll(
      () =>
        page.evaluate(
          () => (window as never as { __qe: { seals: Record<string, number> } }).__qe.seals["shelf-corner"],
        ),
      { timeout: 12_000 },
    )
    .toBe(0);

  // 최종 콘솔 — 먼저 화면에 뒤섞여 나온 순서(정답의 역순)를 그대로 눌러 오답 반응을 확인한다
  await openStation(page, isMobile, 9, 11.5, "puzzle-fo-shelf");
  for (let i = 0; i < 4; i++) {
    await page.locator('[data-testid="fo-shelf-pool"] button').first().click();
  }
  await dismissDialogues(page); // #fo-shelf-wrong
  await expect(page.getByTestId("puzzle-fo-shelf")).toBeVisible();

  // 정답 순서대로 다시 놓는다
  for (const id of CORRECT_ORDER) {
    await page.getByTestId(`fo-shelf-card-${id}`).click();
  }
  await expect(page.getByTestId("fo-shelf-done")).toBeVisible();
  await dismissDialogues(page); // #fo-shelf-clear
  await expect(page.getByTestId("puzzle-fo-shelf")).toBeHidden();

  await expect
    .poll(() =>
      page.evaluate(() => (window as never as { __qe: { events: string[] } }).__qe.events),
    )
    .toContain("door:food-open");
});
