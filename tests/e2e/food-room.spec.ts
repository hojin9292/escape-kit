import { test, expect } from "@playwright/test";
import { enterFoodRoom, openStation, dismissDialogues, goDoor } from "./helpers";
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
  SOLVE_CELL_IDS as JAM_SOLVE_CELL_IDS,
  cellsToPercent,
  judge as jamJudge,
  judgeSpread as jamJudgeSpread,
} from "../../src/puzzles/jam-spread/autoplay";
import { SOLVE_CHOICE as TOPPING_SOLVE_CHOICE, isCorrect as toppingIsCorrect } from "../../src/puzzles/yogurt-topping/autoplay";
import { RECAP_IDS, isRecapComplete } from "../../src/puzzles/pour-shelf-order/autoplay";

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

  test("ice-drop: 화면 주문 카드의 2~3개와 일치한다", () => {
    expect(ICE_GOOD_MIN).toBe(2);
    expect(ICE_GOOD_MAX).toBe(3);
    expect(iceJudge(ICE_SOLVE_COUNT)).toBe("good");
    expect(iceJudge(0)).toBe("low");
    expect(iceJudge(7)).toBe("high");
  });

  test("jam-spread: 알맞은 면적이 여러 행과 열에 고르게 퍼져야 한다", () => {
    expect(JAM_GOOD_MIN).toBe(45);
    expect(JAM_GOOD_MAX).toBe(72);
    expect(jamJudgeSpread(JAM_SOLVE_CELL_IDS)).toBe("good");
    expect(jamJudgeSpread([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])).toBe("low");
    expect(jamJudge(cellsToPercent(0))).toBe("low");
    expect(jamJudge(cellsToPercent(24))).toBe("high");
  });

  test("yogurt-topping: 주문 카드와 같은 한 숟가락만 정답이다", () => {
    expect(toppingIsCorrect("none")).toBe(false);
    expect(toppingIsCorrect(TOPPING_SOLVE_CHOICE)).toBe(true);
    expect(toppingIsCorrect("covered")).toBe(false);
  });

  test("pour-shelf-order: 네 활동을 어떤 순서로 확인해도 완료된다", () => {
    expect(RECAP_IDS).toHaveLength(4);
    expect(isRecapComplete(RECAP_IDS)).toBe(true);
    expect(isRecapComplete([...RECAP_IDS].reverse())).toBe(true);
    expect(isRecapComplete(RECAP_IDS.slice(0, 3))).toBe(false);
  });
});

test("「먹고 마시는 방」 완주 — 식사 준비 4개를 풀고 복습 카드를 확인하면 문이 열린다", async ({
  page,
}) => {
  test.setTimeout(240_000);
  const isMobile = test.info().project.name === "mobile";
  await enterFoodRoom(page);

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

  // P3 잼 바르기 — 빵 위를 문질러 여러 방향에 고르게 편다
  await openStation(page, isMobile, 4, 6.5, "puzzle-jam");
  const jamBox = await page.getByTestId("jam-surface").boundingBox();
  if (!jamBox) throw new Error("jam surface not found");
  for (const id of JAM_SOLVE_CELL_IDS) {
    const x = jamBox.x + ((id % 6) + 0.5) * (jamBox.width / 6);
    const y = jamBox.y + (Math.floor(id / 6) + 0.5) * (jamBox.height / 4);
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.up();
  }
  await page.getByTestId("jam-confirm").click();
  await expect(page.getByTestId("jam-done")).toBeVisible();
  await dismissDialogues(page); // #fo-jam-clear
  await expect(page.getByTestId("puzzle-jam")).toBeHidden();

  // P4 요거트 토핑 — 주문 카드와 같은 한 숟가락 그릇 선택
  await openStation(page, isMobile, 11, 6.5, "puzzle-topping");
  await page.getByTestId(`topping-choice-${TOPPING_SOLVE_CHOICE}`).click();
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

  // 최종 복습 보드 — 순서 없이 네 활동을 모두 확인한다
  await openStation(page, isMobile, 9, 11.5, "puzzle-fo-shelf");
  for (const id of [...RECAP_IDS].reverse()) {
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

  await goDoor(page, isMobile, 7, 1, "communication-room");
});
