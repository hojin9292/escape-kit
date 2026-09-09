import { test, expect } from "@playwright/test";
import { enterObjectsRoom, openStation, dismissDialogues, goDoor } from "./helpers";
import { LEVELS, GOOD_MIN as PENCIL_GOOD_MIN, GOOD_MAX as PENCIL_GOOD_MAX, SOLVE_LEVEL, judge as pencilJudge } from "../../src/puzzles/pencil-grip/autoplay";
import {
  GOOD_MIN as FAUCET_GOOD_MIN,
  GOOD_MAX as FAUCET_GOOD_MAX,
  SOLVE_STEP as FAUCET_SOLVE_STEP,
  stepToValue as faucetStepToValue,
  judge as faucetJudge,
} from "../../src/puzzles/faucet-turn/autoplay";
import { GOOD_MIN as BOOK_GOOD_MIN, GOOD_MAX as BOOK_GOOD_MAX, SOLVE_STEP as BOOK_SOLVE_STEP, judge as bookJudge } from "../../src/puzzles/book-stack/autoplay";
import {
  GOOD_MIN as GLUE_GOOD_MIN,
  GOOD_MAX as GLUE_GOOD_MAX,
  SOLVE_CELLS as GLUE_SOLVE_CELLS,
  cellsToPercent as glueCellsToPercent,
  judge as glueJudge,
} from "../../src/puzzles/glue-spread/autoplay";
import { RECAP_IDS, isRecapComplete } from "../../src/puzzles/force-shelf-order/autoplay";

test.describe("정답 상수 검산 — 각 puzzle의 autoplay.ts", () => {
  test("pencil-grip: OB-001 구간(28~52)과 일치하고 정답 단계가 유일하다", () => {
    expect(PENCIL_GOOD_MIN).toBe(28);
    expect(PENCIL_GOOD_MAX).toBe(52);
    expect(pencilJudge(LEVELS[SOLVE_LEVEL])).toBe("good");
    const goodLevels = LEVELS.map((v) => pencilJudge(v)).filter((j) => j === "good");
    expect(goodLevels.length).toBe(1);
  });

  test("faucet-turn: OB-004 구간(28~50)과 일치한다", () => {
    expect(FAUCET_GOOD_MIN).toBe(28);
    expect(FAUCET_GOOD_MAX).toBe(50);
    expect(faucetJudge(faucetStepToValue(FAUCET_SOLVE_STEP))).toBe("good");
    expect(faucetJudge(faucetStepToValue(0))).toBe("low");
    expect(faucetJudge(faucetStepToValue(12))).toBe("high");
  });

  test("book-stack: OB-019 구간(3~6권)과 일치한다", () => {
    expect(BOOK_GOOD_MIN).toBe(3);
    expect(BOOK_GOOD_MAX).toBe(6);
    expect(bookJudge(BOOK_SOLVE_STEP)).toBe("good");
    expect(bookJudge(0)).toBe("low");
    expect(bookJudge(9)).toBe("high");
  });

  test("glue-spread: OB-011 넓이 구간(55~82%)과 격자 칸 수가 일치한다", () => {
    expect(GLUE_GOOD_MIN).toBe(55);
    expect(GLUE_GOOD_MAX).toBe(82);
    expect(glueJudge(glueCellsToPercent(GLUE_SOLVE_CELLS))).toBe("good");
    expect(glueJudge(glueCellsToPercent(0))).toBe("low");
    expect(glueJudge(glueCellsToPercent(24))).toBe("high");
  });

  test("force-shelf-order: 네 활동을 어떤 순서로 확인해도 완료된다", () => {
    expect(RECAP_IDS).toHaveLength(4);
    expect(isRecapComplete(RECAP_IDS)).toBe(true);
    expect(isRecapComplete([...RECAP_IDS].reverse())).toBe(true);
    expect(isRecapComplete(RECAP_IDS.slice(0, 3))).toBe(false);
  });
});

test("「물건 쓰는 방」 완주 — 네 가지를 풀고 복습 카드를 확인하면 문이 열린다", async ({
  page,
}) => {
  test.setTimeout(240_000);
  const isMobile = test.info().project.name === "mobile";
  await enterObjectsRoom(page);

  await openStation(page, isMobile, 4, 3, "puzzle-pencil");
  await page.getByTestId(`pencil-level-${SOLVE_LEVEL}`).click();
  await page.getByTestId("pencil-confirm").click();
  await expect(page.getByTestId("pencil-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-pencil")).toBeHidden();

  await openStation(page, isMobile, 11, 3, "puzzle-faucet");
  for (let i = 0; i < FAUCET_SOLVE_STEP; i++) await page.getByTestId("faucet-more").click();
  await page.getByTestId("faucet-confirm").click();
  await expect(page.getByTestId("faucet-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-faucet")).toBeHidden();

  await openStation(page, isMobile, 4, 6.5, "puzzle-book");
  for (let i = 0; i < BOOK_SOLVE_STEP; i++) await page.getByTestId("book-up").click();
  await page.getByTestId("book-confirm").click();
  await expect(page.getByTestId("book-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-book")).toBeHidden();

  await openStation(page, isMobile, 11, 6.5, "puzzle-glue");
  for (let i = 0; i < GLUE_SOLVE_CELLS; i++) await page.getByTestId(`glue-cell-${i}`).click();
  await page.getByTestId("glue-confirm").click();
  await expect(page.getByTestId("glue-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-glue")).toBeHidden();

  await expect
    .poll(
      () =>
        page.evaluate(
          () => (window as never as { __qe: { seals: Record<string, number> } }).__qe.seals["shelf-corner"],
        ),
      { timeout: 12_000 },
    )
    .toBe(0);

  await openStation(page, isMobile, 9, 11.5, "puzzle-ob-shelf");
  for (const id of [...RECAP_IDS].reverse()) {
    await page.getByTestId(`ob-shelf-card-${id}`).click();
  }
  await expect(page.getByTestId("ob-shelf-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-ob-shelf")).toBeHidden();

  await expect
    .poll(() => page.evaluate(() => (window as never as { __qe: { events: string[] } }).__qe.events))
    .toContain("door:objects-open");

  await goDoor(page, isMobile, 7, 1, "time-room");
});
