#!/usr/bin/env node
/** 호환용 진입점. 실제 호진티 가공은 Pillow 기반 Python 스크립트가 담당한다. */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const result = spawnSync("python3", [join(root, "scripts/import-hojinti.py")], {
  cwd: root,
  stdio: "inherit",
});
process.exit(result.status ?? 1);
