import { test, expect } from "@playwright/test";
import { enterSocialRoom, openStation, dismissDialogues, goDoor } from "./helpers";
import {
  GOOD_MIN as ELEV_GOOD_MIN,
  GOOD_MAX as ELEV_GOOD_MAX,
  SOLVE_STEP as ELEV_SOLVE_STEP,
  stepToValue as elevStepToValue,
  judge as elevJudge,
} from "../../src/puzzles/elevator-distance/autoplay";
import { LEVELS, GOOD_MIN as TAP_GOOD_MIN, GOOD_MAX as TAP_GOOD_MAX, SOLVE_LEVEL, judge as tapJudge } from "../../src/puzzles/shoulder-tap/autoplay";
import { TICK_MS as APPROACH_TICK_MS, SOLVE_STEP as APPROACH_SOLVE_STEP, judgeAtStep as approachJudgeAtStep } from "../../src/puzzles/approach-friend/autoplay";
import {
  GOOD_MIN as BAG_GOOD_MIN,
  GOOD_MAX as BAG_GOOD_MAX,
  SOLVE_STEP as BAG_SOLVE_STEP,
  stepToValue as bagStepToValue,
  judge as bagJudge,
} from "../../src/puzzles/bag-space/autoplay";
import { RECAP_IDS, isRecapComplete } from "../../src/puzzles/distance-shelf-order/autoplay";

test.describe("정답 상수 검산 — 각 puzzle의 autoplay.ts", () => {
  test("elevator-distance: SO-003 구간(24~48)과 일치한다(값이 작을수록 가까움)", () => {
    expect(ELEV_GOOD_MIN).toBe(24);
    expect(ELEV_GOOD_MAX).toBe(48);
    expect(elevJudge(elevStepToValue(ELEV_SOLVE_STEP))).toBe("good");
    expect(elevJudge(elevStepToValue(0))).toBe("low");
    expect(elevJudge(elevStepToValue(12))).toBe("high");
  });

  test("shoulder-tap: SO-010 구간(18~38)과 일치하고 정답 단계가 유일하다", () => {
    expect(TAP_GOOD_MIN).toBe(18);
    expect(TAP_GOOD_MAX).toBe(38);
    expect(tapJudge(LEVELS[SOLVE_LEVEL])).toBe("good");
    const goodLevels = LEVELS.map((v) => tapJudge(v)).filter((j) => j === "good");
    expect(goodLevels.length).toBe(1);
  });

  test("approach-friend: 이르면 high(너무 멂), 적당하면 good, 늦으면 low(너무 가까움)", () => {
    expect(approachJudgeAtStep(0)).toBe("high");
    expect(approachJudgeAtStep(APPROACH_SOLVE_STEP)).toBe("good");
    expect(approachJudgeAtStep(20)).toBe("low");
  });

  test("bag-space: SO-015 구간(10~28)과 일치한다", () => {
    expect(BAG_GOOD_MIN).toBe(10);
    expect(BAG_GOOD_MAX).toBe(28);
    expect(bagJudge(bagStepToValue(BAG_SOLVE_STEP))).toBe("good");
    expect(bagJudge(bagStepToValue(0))).toBe("low");
    expect(bagJudge(bagStepToValue(16))).toBe("high");
  });

  test("distance-shelf-order: 네 활동을 어떤 순서로 확인해도 완료된다", () => {
    expect(RECAP_IDS).toHaveLength(4);
    expect(isRecapComplete(RECAP_IDS)).toBe(true);
    expect(isRecapComplete([...RECAP_IDS].reverse())).toBe(true);
    expect(isRecapComplete(RECAP_IDS.slice(0, 3))).toBe(false);
  });
});

test("「함께 지내는 방」 완주 — 네 가지를 풀고 복습 카드를 확인하면 문이 열린다", async ({
  page,
}) => {
  test.setTimeout(240_000);
  const isMobile = test.info().project.name === "mobile";
  await enterSocialRoom(page);

  await openStation(page, isMobile, 4, 3, "puzzle-elevator");
  for (let i = 0; i < ELEV_SOLVE_STEP; i++) await page.getByTestId("elevator-far").click();
  await page.getByTestId("elevator-confirm").click();
  await expect(page.getByTestId("elevator-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-elevator")).toBeHidden();

  await openStation(page, isMobile, 11, 3, "puzzle-tap");
  await page.getByTestId(`tap-level-${SOLVE_LEVEL}`).click();
  await page.getByTestId("tap-confirm").click();
  await expect(page.getByTestId("tap-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-tap")).toBeHidden();

  await openStation(page, isMobile, 4, 6.5, "puzzle-approach");
  await page.waitForTimeout(APPROACH_TICK_MS * APPROACH_SOLVE_STEP + 200);
  await page.getByTestId("approach-confirm").click();
  await expect(page.getByTestId("approach-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-approach")).toBeHidden();

  await openStation(page, isMobile, 11, 6.5, "puzzle-bag");
  for (let i = 0; i < BAG_SOLVE_STEP; i++) await page.getByTestId("bag-up").click();
  await page.getByTestId("bag-confirm").click();
  await expect(page.getByTestId("bag-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-bag")).toBeHidden();

  await expect
    .poll(
      () =>
        page.evaluate(
          () => (window as never as { __qe: { seals: Record<string, number> } }).__qe.seals["shelf-corner"],
        ),
      { timeout: 12_000 },
    )
    .toBe(0);

  await openStation(page, isMobile, 9, 11.5, "puzzle-so-shelf");
  for (const id of [...RECAP_IDS].reverse()) {
    await page.getByTestId(`so-shelf-card-${id}`).click();
  }
  await expect(page.getByTestId("so-shelf-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-so-shelf")).toBeHidden();

  await expect
    .poll(() => page.evaluate(() => (window as never as { __qe: { events: string[] } }).__qe.events))
    .toContain("door:social-open");

  await goDoor(page, isMobile, 7, 1, "objects-room");
});
