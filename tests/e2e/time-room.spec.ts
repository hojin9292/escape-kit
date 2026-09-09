import { test, expect } from "@playwright/test";
import { enterTimeRoom, openStation, dismissDialogues, interact, moveTo } from "./helpers";
import { TICK_MS as MICROWAVE_TICK_MS, SOLVE_STEP as MICROWAVE_SOLVE_STEP, judgeAtStep as microwaveJudgeAtStep } from "../../src/puzzles/microwave-wait/autoplay";
import { CHECK_IDS as HOMEWORK_CHECK_IDS, isComplete as homeworkIsComplete } from "../../src/puzzles/homework-check/autoplay";
import { TICK_MS as CROSSWALK_TICK_MS, SOLVE_STEP as CROSSWALK_SOLVE_STEP, judgeAtStep as crosswalkJudgeAtStep } from "../../src/puzzles/crosswalk-signal/autoplay";
import { TICK_MS as FRIEND_TICK_MS, SOLVE_STEP as FRIEND_SOLVE_STEP, judgeAtStep as friendJudgeAtStep } from "../../src/puzzles/friend-turn-wait/autoplay";
import { RECAP_IDS, isRecapComplete } from "../../src/puzzles/wait-shelf-order/autoplay";

test.describe("정답 상수 검산 — 각 puzzle의 autoplay.ts", () => {
  test("microwave-wait: 너무 빠르면 low, 적당하면 good, 너무 오래면 high", () => {
    expect(microwaveJudgeAtStep(0)).toBe("low");
    expect(microwaveJudgeAtStep(MICROWAVE_SOLVE_STEP)).toBe("good");
    expect(microwaveJudgeAtStep(20)).toBe("high");
  });

  test("homework-check: 이름과 빠진 칸을 모두 확인해야 한다", () => {
    expect(HOMEWORK_CHECK_IDS).toEqual(["name", "blank"]);
    expect(homeworkIsComplete(HOMEWORK_CHECK_IDS)).toBe(true);
    expect(homeworkIsComplete(["name"])).toBe(false);
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

  test("wait-shelf-order: 네 활동을 어떤 순서로 확인해도 완료된다", () => {
    expect(RECAP_IDS).toHaveLength(4);
    expect(isRecapComplete(RECAP_IDS)).toBe(true);
    expect(isRecapComplete([...RECAP_IDS].reverse())).toBe(true);
    expect(isRecapComplete(RECAP_IDS.slice(0, 3))).toBe(false);
  });
});

test("「시간과 횟수 방」 완주 — 네 가지를 풀고 복습 카드를 확인하면 게임 전체 엔딩이 뜬다", async ({
  page,
}) => {
  test.setTimeout(240_000);
  const isMobile = test.info().project.name === "mobile";
  await enterTimeRoom(page);

  await openStation(page, isMobile, 4, 3, "puzzle-microwave");
  await page.waitForTimeout(MICROWAVE_TICK_MS * MICROWAVE_SOLVE_STEP + 200);
  await page.getByTestId("microwave-confirm").click();
  await expect(page.getByTestId("microwave-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-microwave")).toBeHidden();

  await openStation(page, isMobile, 11, 3, "puzzle-homework");
  for (const id of HOMEWORK_CHECK_IDS) await page.getByTestId(`homework-check-${id}`).click();
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
  for (const id of [...RECAP_IDS].reverse()) {
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
