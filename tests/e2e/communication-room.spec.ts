import { test, expect } from "@playwright/test";
import { enterCommunicationRoom, openStation, dismissDialogues, goDoor } from "./helpers";
import {
  GOOD_MIN as VOICE_GOOD_MIN,
  GOOD_MAX as VOICE_GOOD_MAX,
  SOLVE_STEP as VOICE_SOLVE_STEP,
  stepToValue as voiceStepToValue,
  judge as voiceJudge,
} from "../../src/puzzles/voice-volume/autoplay";
import {
  GOOD_MIN as CALL_GOOD_MIN,
  GOOD_MAX as CALL_GOOD_MAX,
  SOLVE_COUNT as CALL_SOLVE_COUNT,
  judge as callJudge,
} from "../../src/puzzles/call-name/autoplay";
import { TICK_MS as WAIT_TICK_MS, SOLVE_STEP as WAIT_SOLVE_STEP, judgeAtStep as waitJudgeAtStep } from "../../src/puzzles/wait-answer/autoplay";
import {
  TICK_MS as STORY_TICK_MS,
  SOLVE_STEP as STORY_SOLVE_STEP,
  judgeAtStep as storyJudgeAtStep,
} from "../../src/puzzles/story-turn/autoplay";
import { RECAP_IDS, isRecapComplete } from "../../src/puzzles/voice-shelf-order/autoplay";

test.describe("정답 상수 검산 — 각 puzzle의 autoplay.ts", () => {
  test("voice-volume: CO-003 구간(30~52)과 일치한다", () => {
    expect(VOICE_GOOD_MIN).toBe(30);
    expect(VOICE_GOOD_MAX).toBe(52);
    expect(voiceJudge(voiceStepToValue(VOICE_SOLVE_STEP))).toBe("good");
    expect(voiceJudge(voiceStepToValue(0))).toBe("low");
    expect(voiceJudge(voiceStepToValue(12))).toBe("high");
  });

  test("call-name: CO-007 구간(1~2회)과 일치한다", () => {
    expect(CALL_GOOD_MIN).toBe(1);
    expect(CALL_GOOD_MAX).toBe(2);
    expect(callJudge(CALL_SOLVE_COUNT)).toBe("good");
    expect(callJudge(0)).toBe("low");
    expect(callJudge(4)).toBe("high");
  });

  test("wait-answer: 너무 빠르면 low, 적당하면 good, 너무 오래면 high", () => {
    expect(waitJudgeAtStep(0)).toBe("low");
    expect(waitJudgeAtStep(WAIT_SOLVE_STEP)).toBe("good");
    expect(waitJudgeAtStep(20)).toBe("high");
  });

  test("story-turn: 한 문장은 low, 두세 문장은 good, 너무 쌓이면 high", () => {
    expect(storyJudgeAtStep(0)).toBe("low");
    expect(storyJudgeAtStep(1)).toBe("low");
    expect(storyJudgeAtStep(STORY_SOLVE_STEP)).toBe("good");
    expect(storyJudgeAtStep(10)).toBe("high");
  });

  test("voice-shelf-order: 네 활동을 어떤 순서로 확인해도 완료된다", () => {
    expect(RECAP_IDS).toHaveLength(4);
    expect(isRecapComplete(RECAP_IDS)).toBe(true);
    expect(isRecapComplete([...RECAP_IDS].reverse())).toBe(true);
    expect(isRecapComplete(RECAP_IDS.slice(0, 3))).toBe(false);
  });
});

test("「말하고 듣는 방」 완주 — 네 가지를 풀고 복습 카드를 확인하면 문이 열린다", async ({
  page,
}) => {
  test.setTimeout(240_000);
  const isMobile = test.info().project.name === "mobile";
  await enterCommunicationRoom(page);

  await openStation(page, isMobile, 4, 3, "puzzle-voice");
  for (let i = 0; i < VOICE_SOLVE_STEP; i++) await page.getByTestId("voice-up").click();
  await page.getByTestId("voice-confirm").click();
  await expect(page.getByTestId("voice-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-voice")).toBeHidden();

  await openStation(page, isMobile, 11, 3, "puzzle-call");
  for (let i = 0; i < CALL_SOLVE_COUNT; i++) await page.getByTestId("call-btn").click();
  await page.getByTestId("call-confirm").click();
  await expect(page.getByTestId("call-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-call")).toBeHidden();

  await openStation(page, isMobile, 4, 6.5, "puzzle-wait");
  await page.waitForTimeout(WAIT_TICK_MS * WAIT_SOLVE_STEP + 200);
  await page.getByTestId("wait-confirm").click();
  await expect(page.getByTestId("wait-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-wait")).toBeHidden();

  await openStation(page, isMobile, 11, 6.5, "puzzle-story");
  await page.waitForTimeout(STORY_TICK_MS * STORY_SOLVE_STEP + 200);
  await page.getByTestId("story-confirm").click();
  await expect(page.getByTestId("story-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-story")).toBeHidden();

  await expect
    .poll(
      () =>
        page.evaluate(
          () => (window as never as { __qe: { seals: Record<string, number> } }).__qe.seals["shelf-corner"],
        ),
      { timeout: 12_000 },
    )
    .toBe(0);

  await openStation(page, isMobile, 9, 11.5, "puzzle-co-shelf");
  for (const id of [...RECAP_IDS].reverse()) {
    await page.getByTestId(`co-shelf-card-${id}`).click();
  }
  await expect(page.getByTestId("co-shelf-done")).toBeVisible();
  await dismissDialogues(page);
  await expect(page.getByTestId("puzzle-co-shelf")).toBeHidden();

  await expect
    .poll(() => page.evaluate(() => (window as never as { __qe: { events: string[] } }).__qe.events))
    .toContain("door:communication-open");

  await goDoor(page, isMobile, 7, 1, "social-room");
});
