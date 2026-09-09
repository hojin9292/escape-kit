#!/usr/bin/env python3
"""Build Hojn-T's eight-direction game sprites from a five-view turnaround."""
from pathlib import Path
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets-src/gen-src/hojinti-turnaround.png"
OUT = ROOT / "assets-src/ext-char"
VIEWS = ("front", "qfront", "side", "qback", "back")


def remove_magenta(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    alpha = Image.new("L", rgba.size, 255)
    src, dst = rgba.load(), alpha.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, _ = src[x, y]
            if r > 135 and b > 95 and r - g > 48 and b - g > 34:
                dst[x, y] = 0
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.65))
    rgba.putalpha(alpha)
    bbox = alpha.getbbox()
    if bbox is None:
        raise RuntimeError("No Hojn-T foreground found")
    return rgba.crop(bbox)


def on_canvas(sprite: Image.Image) -> Image.Image:
    max_w, max_h = 244, 246
    scale = min(max_w / sprite.width, max_h / sprite.height)
    sprite = sprite.resize(
        (round(sprite.width * scale), round(sprite.height * scale)),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (280, 260))
    canvas.alpha_composite(sprite, ((280 - sprite.width) // 2, 254 - sprite.height))
    return canvas


def main() -> None:
    atlas = Image.open(SOURCE).convert("RGB")
    cells: dict[str, Image.Image] = {}
    for i, view in enumerate(VIEWS):
        x0 = round(i * atlas.width / 5) + 8
        x1 = round((i + 1) * atlas.width / 5) - 8
        cells[view] = on_canvas(remove_magenta(atlas.crop((x0, 0, x1, atlas.height))))

    by_facing = {
        "s": cells["front"],
        "se": cells["qfront"],
        "e": cells["side"],
        "ne": cells["qback"],
        "n": cells["back"],
        "nw": cells["qback"].transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "w": cells["side"].transpose(Image.Transpose.FLIP_LEFT_RIGHT),
        "sw": cells["qfront"].transpose(Image.Transpose.FLIP_LEFT_RIGHT),
    }
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("char-*.png"):
        old.unlink()
    for facing, idle in by_facing.items():
        frames = {
            "idle": idle,
            # A tiny whole-body sway reads better than cutting Hojn-T's short legs.
            "a": idle.rotate(-1.4, Image.Resampling.BICUBIC, center=(140, 250)),
            "b": idle.rotate(1.4, Image.Resampling.BICUBIC, center=(140, 250)),
        }
        for frame, image in frames.items():
            image.save(OUT / f"char-m-{facing}-{frame}.png", optimize=True)
    (OUT / "meta.json").write_text('{\n  "scale": 1\n}\n', encoding="utf-8")
    print(f"Hojn-T: {len(by_facing) * 3} frames -> {OUT}")


if __name__ == "__main__":
    main()
