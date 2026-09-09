#!/usr/bin/env python3
"""Split a five-cell ImageGen atlas and remove its magenta key background.

Usage:
  python3 scripts/split-magenta-atlas.py ATLAS.png OUT_DIR name-a name-b name-c name-d name-e

The exported files use a shared transparent 440x320 canvas so puzzle artwork
stays visually stable even when the generated objects have different bounds.
"""
from pathlib import Path
import sys

from PIL import Image, ImageFilter


CANVAS = (440, 320)


def keyed_cell(cell: Image.Image) -> Image.Image:
    rgba = cell.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size

    # ImageGen's key color is a vivid magenta. Keep cream, orange and blue
    # object colors intact by requiring both red/blue dominance over green.
    hard = Image.new("L", rgba.size, 255)
    mask = hard.load()
    for y in range(height):
        for x in range(width):
            r, g, b, _ = pixels[x, y]
            if r > 135 and b > 95 and r - g > 48 and b - g > 34:
                mask[x, y] = 0

    # A one-pixel feather preserves smooth generated edges after keying.
    soft = hard.filter(ImageFilter.GaussianBlur(0.65))
    rgba.putalpha(soft)
    bbox = soft.getbbox()
    if bbox is None:
        raise RuntimeError("No foreground found after magenta keying")
    rgba = rgba.crop(bbox)

    max_w, max_h = 406, 292
    scale = min(max_w / rgba.width, max_h / rgba.height, 1.0)
    if scale < 1:
        rgba = rgba.resize(
            (max(1, round(rgba.width * scale)), max(1, round(rgba.height * scale))),
            Image.Resampling.LANCZOS,
        )
    out = Image.new("RGBA", CANVAS)
    out.alpha_composite(rgba, ((CANVAS[0] - rgba.width) // 2, CANVAS[1] - rgba.height - 8))
    return out


def main() -> None:
    if len(sys.argv) != 8:
        raise SystemExit(__doc__)
    source = Path(sys.argv[1])
    out_dir = Path(sys.argv[2])
    names = sys.argv[3:]
    atlas = Image.open(source).convert("RGB")
    out_dir.mkdir(parents=True, exist_ok=True)
    for i, name in enumerate(names):
        x0 = round(i * atlas.width / 5)
        x1 = round((i + 1) * atlas.width / 5)
        # Generated atlases may draw a dark divider directly on the cell edge.
        # Drop that narrow gutter before foreground detection so it cannot make
        # the actual object look tiny on the shared output canvas.
        cell = atlas.crop((x0 + 10, 0, x1 - 10, atlas.height))
        keyed_cell(cell).save(out_dir / f"tool-{name}.png", optimize=True)
        print(out_dir / f"tool-{name}.png")


if __name__ == "__main__":
    main()
