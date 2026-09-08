import { test, expect } from "@playwright/test";
import { enterTimeRoom, openStation, dismissDialogues, interact, moveTo } from "./helpers";
import { TICK_MS as MICROWAVE_TICK_MS, SOLVE_STEP as MICROWAVE_SOLVE_STEP, judgeAtStep as microwaveJudgeAtStep } from "../../src/puzzles/microwave-wait/autoplay";
import { GOOD_MIN as HOMEWORK_GOOD_MIN, GOOD_MAX as HOMEWORK_GOOD_MAX, SOLVE_COUNT as HOMEWORK_SOLVE_COUNT, judge as homeworkJudge } from "../../src/puzzles/homework-check/autoplay";
import { TICK_MS as CROSSWALK_TICK_MS, SOLVE_STEP as CROSSWALK_SOLVE_STEP, judgeAtStep as crosswalkJudgeAtStep } from "../../src/puzzles/crosswalk-signal/autoplay";
import { TICK_MS as FRIEND_TICK_MS, SOLVE_STEP as FRIEND_SOLVE_STEP, judgeAtStep as friendJudgeAtStep } from "../../src/puzzles/friend-turn-wait/autoplay";
import { ITEMS, CORRECT_ORDER, isUniqueSolution, judgeOrder } from "../../src/puzzles/wait-shelf-order/autoplay";

test.describe("정답 상수 검산 — 각 puzzle의 autoplay.ts", () => {
  test("microwave-wait: 너무 빠르면 low, 적당하면 good, 너무 오래면 high", () => {
    expect(microwaveJudgeAtStep(0)).toBe("low");
    expect(microwaveJudgeAtStep(MICROWAVE_SOLVE_STEP)).toBe("good");
    expect(microwaveJudgeAtStep(20)).toBe("high");
  });

  test("homework-check: TI-013 구간(1~2회)과 일치한다", () => {
    expect(HOMEWORK_GOOD_MIN).toBe(1);
    expect(HOMEWORK_GOOD_MAX).toBe(2);
    expect(homeworkJudge(HOMEWORK_SOLVE_COUNT)).toBe("good");
    expect(homeworkJudge(0)).toBe("low");
    expect(homeworkJudge(4)).toBe("high");
  });

  test("crosswalk-signal: 빨간불이면 low, 초록불이면 good, 깜빡이면 high", () => {
    expect(crosswalkJudgeAtStep(0)).toBe("low");
    expect(crosswalkJudgeAtStep(CROSSWALK_SOLVE_STEP)).toBe("good");
    expect(crosswalkJudgeAtStep(20)).toBe("high");
  });

  test("friend-turn-wait: 너무 빠르면 low, 적당하면 good, 너무 오래면 high", () => {
    expect(friendJudgeAtStep(0)).toBe("low");
    expect(friendJudgeAtStep(FRIEND_SOLVE_STEP)).toBe("good");
    expect(friendJudgeAtStep(20)).toBe("high");
  });

  test("wait-shelf-order: 네 상황의 중앙값이 전부 달라 정답 순열이 유일하다", () => {
    expect(isUniqueSolution()).toBe(true);
    expect(ITEMS.length).toBe(4);
    expect(CORRECT_ORDER).toEqual(["washer", "favor", "friend-answer", "elevator"]);
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

test("「시간과 횟수 방」 완주 — 네 가지를 풀고 서열을 맞히면 게임 전체 엔딩이 뜬다", async ({
  page,
}) => {
  test.setTimeout(240_000);
  const isMobile = test.info().project.name === "mobile";
  await enterTimeRoom(page, isMobile ? "f" : "m");

  await openStation(page, isMobile, 4, 3, "puzzle-microwave");
  await page.waitForTimeout(MICROWAVE_TICK_MS * MICROWAVE_SOLVE_STEP + 200);
  await page.getByTestId("microwave-confirm").click();
  await expect(page.getByTestId("microwave-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-microwave")).toBeHidden();

  await openStation(page, isMobile, 11, 3, "puzzle-homework");
  for (let i = 0; i < HOMEWORK_SOLVE_COUNT; i++) await page.getByTestId("homework-check-btn").click();
  await page.getByTestId("homework-confirm").click();
  await expect(page.getByTestId("homework-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-homework")).toBeHidden();

  await openStation(page, isMobile, 4, 6.5, "puzzle-crosswalk");
  await page.waitForTimeout(CROSSWALK_TICK_MS * CROSSWALK_SOLVE_STEP + 200);
  await page.getByTestId("crosswalk-confirm").click();
  await expect(page.getByTestId("crosswalk-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-crosswalk")).toBeHidden();

  await openStation(page, isMobile, 11, 6.5, "puzzle-friend");
  await page.waitForTimeout(FRIEND_TICK_MS * FRIEND_SOLVE_STEP + 200);
  await page.getByTestId("friend-confirm").click();
  await expect(page.getByTestId("friend-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-friend")).toBeHidden();

  await expect
    .poll(
      () =>
        page.evaluate(
          () => (window as never as { __qe: { seals: Record<string, number> } }).__qe.seals["shelf-corner"],
        ),
      { timeout: 12_000 },
    )
    .toBe(0);

  await openStation(page, isMobile, 9, 11.5, "puzzle-ti-shelf");
  for (let i = 0; i < 4; i++) {
    await page.locator('[data-testid="ti-shelf-pool"] button').first().click();
  }
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-ti-shelf")).toBeVisible();

  for (const id of CORRECT_ORDER) {
    await page.getByTestId(`ti-shelf-card-${id}`).click();
  }
  await expect(page.getByTestId("ti-shelf-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-ti-shelf")).toBeHidden();

  await expect
    .poll(() => page.evaluate(() => (window as never as { __qe: { events: string[] } }).__qe.events))
    .toContain("door:time-open");

  // 마지막 문 — ending:true라 다른 방으로 넘어가지 않고 엔딩 화면이 뜬다
  await moveTo(page, isMobile, 7, 1, 1.2);
  await interact(page, isMobile);
  await dismissDialogues(page); // #epilogue-final-open, #epilogue-final-notes-incomplete
  await expect(page.getByTestId("ending-screen")).toBeVisible();
  await expect(page.getByTestId("ending-stats")).toBeVisible();
});
