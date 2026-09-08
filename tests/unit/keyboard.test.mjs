import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KeyboardInput } from '../../src/engine/input/keyboard.ts';

function setup() {
  const target = new EventTarget();
  target.document = new EventTarget();
  target.document.hidden = false;
  const input = new KeyboardInput();
  const detach = input.attach(target);
  const key = (type, code, repeat = false) => {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, { code, repeat });
    target.dispatchEvent(event);
  };
  return { target, input, detach, key };
}

test('holding interaction keys triggers once per physical press', () => {
  const { input, key, detach } = setup();
  let calls = 0;
  input.onInteract = () => calls++;
  key('keydown', 'KeyE');
  for (let i = 0; i < 10; i++) key('keydown', 'KeyE', true);
  assert.equal(calls, 1);
  key('keyup', 'KeyE');
  key('keydown', 'Space');
  assert.equal(calls, 2);
  detach();
  key('keydown', 'KeyE');
  assert.equal(calls, 2);
});

test('blur and hidden tabs release movement without a keyup', () => {
  const { target, input, key, detach } = setup();
  key('keydown', 'ArrowRight');
  assert.deepEqual(input.direction(), [1, 0]);
  target.dispatchEvent(new Event('blur'));
  assert.deepEqual(input.direction(), [0, 0]);
  key('keydown', 'KeyW');
  target.document.hidden = true;
  target.document.dispatchEvent(new Event('visibilitychange'));
  assert.deepEqual(input.direction(), [0, 0]);
  detach();
});
