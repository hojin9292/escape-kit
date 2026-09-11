import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('start-button').click();
  await page.getByTestId('char-m').click();
  await expect(page.getByTestId('dialogue-box')).toBeVisible();
});

test('reading gestures and repeated keys do not dismiss the dialogue', async ({ page }) => {
  const box = page.getByTestId('dialogue-box');
  const original = await box.locator('.dialogue-text').textContent();
  await box.dispatchEvent('pointerdown', { pointerId: 1, button: 0, clientX: 100, clientY: 180 });
  await box.dispatchEvent('pointermove', { pointerId: 1, clientX: 100, clientY: 100 });
  await box.dispatchEvent('pointerup', { pointerId: 1, clientX: 100, clientY: 100 });
  await page.locator('body').dispatchEvent('keydown', { code: 'Space', repeat: true, bubbles: true });
  await expect(box.locator('.dialogue-text')).toHaveText(original!);
  await box.getByRole('button', { name: '계속 →' }).click();
  await expect(page.getByTestId('game-canvas')).toBeVisible();
});

test('short taps still advance the dialogue', async ({ page }) => {
  await page.getByTestId('dialogue-box').click();
  await expect(page.getByTestId('game-canvas')).toBeVisible();
});

test('continue button advances even when a tablet reports slight pointer movement', async ({ page }) => {
  const button = page.getByRole('button', { name: '계속 →' });
  await button.dispatchEvent('pointerdown', { pointerId: 2, button: 0, clientX: 100, clientY: 100 });
  await button.dispatchEvent('pointermove', { pointerId: 2, clientX: 110, clientY: 100 });
  await button.dispatchEvent('pointerup', { pointerId: 2, button: 0, clientX: 110, clientY: 100 });
  await button.dispatchEvent('click', { button: 0 });
  await expect(page.getByTestId('game-canvas')).toBeVisible();
});

test('canvas resolution is capped on high-DPR touch devices', async ({ page }) => {
  await page.getByTestId('dialogue-box').click();
  const canvasScale = await page.getByTestId('game-canvas').evaluate((canvas: HTMLCanvasElement) => ({
    coarse: matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window,
    scale: canvas.width / canvas.getBoundingClientRect().width,
  }));
  expect(canvasScale.scale).toBeLessThanOrEqual(canvasScale.coarse ? 1.26 : 2.01);
});
